const ErrorHandeller = require("../utils/errorHandeller");

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.message = err.message || "Internal server error");

  //wrong Mongodb err
  if (err.name === "CastError") {
    const msg = `resource not found. Invalid ${err.path}`;
    err = new ErrorHandeller(msg, 400);
  }

  //momgoose duplicate key error

  if (err.code === 11000) {
    const message = "email already exist please login";
    err = new ErrorHandeller(message, 400);
  }

  //wrong jsonToken error

  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid try again";
    err = new ErrorHandeller(message, 400);
  }

  //JWT expire error

  if (err.name === "TokenExpiredError") {
    const message = "Json web token is Expired";
    err = new ErrorHandeller(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
