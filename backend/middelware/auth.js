const ErrorHandeller = require("../utils/errorHandeller");
const catchasyncError = require("./catchasyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

exports.isAuthUser = catchasyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandeller("Please Login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandeller(
          `Role: ${req.user.role} is no allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
