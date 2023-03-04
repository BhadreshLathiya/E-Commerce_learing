// creating token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //option for cookie
  const option = {
    expaires: new Date(
      Date.now() + process.env.COOKIE_EXPAIR * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken