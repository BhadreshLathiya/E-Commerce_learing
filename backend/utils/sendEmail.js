const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host:'smtp.ethereal.email',
    port:587,
    secure:false,
    auth: {
      user: "raju.smarttechnica@gmail.com",
      pass: "eglnwjtvdgxiisrg",
    },
   
    tls:{
      rejectUnauthorized:false
    }
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

 await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;
