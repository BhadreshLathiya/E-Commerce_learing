const ErrorHandeller = require("../utils/errorHandeller");
const catchAsyncErr = require("../middelware/catchasyncError");
const User = require("../models/usersModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
exports.registerUser = catchAsyncErr(async (req, res, next) => {
  const { name, email, password } = req.body;
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatar",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

//login user

exports.loginUser = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandeller("please Enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandeller("Invalid Email or Password", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandeller("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

//logout user

exports.logOut = catchAsyncErr(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
});

//forget passeord
exports.forgetPass = catchAsyncErr(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandeller("user not found", 404));
  }
  //get reset password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your password reset Token is :- \n\n ${resetPasswordUrl} \n\nif you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandeller(error.message, 500));
  }
});

//reset password
exports.resetPassword = catchAsyncErr(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandeller(
        "Reset password token is invalid or has been expire",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandeller("password dose not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//get user detail
exports.getUserDetail = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//change password
exports.updatePassword = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatch) {
    return next(new ErrorHandeller("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandeller("password dose not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);

  res.status(200).json({
    success: true,
    user,
  });
});

//update profile
exports.updateProfile = catchAsyncErr(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatar",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// get all users (admin)
exports.getAllUsers = catchAsyncErr(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single users (admin)
exports.getSingleUsers = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandeller("Use dose not exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//update user role (admin)
exports.updateUserrole = catchAsyncErr(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//delete user (admin)
exports.deleteUser = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandeller("Use dose not exist", 400));
  }
  await user.remove();

  res.status(200).json({
    success: true,
    message: "user delete successfully....",
  });
});
