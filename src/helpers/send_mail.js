require("dotenv").config();
const nodemailer = require("nodemailer");

const cssBtn = "text-decoration: none; margin-left: 20px";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const accountVerify = async (emailrReceived, server, token) => {
  try {
    const reqNo = `${server}/auth/cancel-email/${token}`;
    const reqYes = `${server}/auth/verify-email/${token}`;
    await transporter.sendMail({
      from: `${process.env.MAIL_USER}`,
      to: `${emailrReceived}`,
      subject: "Account verify",
      html:
        "<div>Did you just use this email to register an account on Epic-game ?" +
        `<a style="color: #dc3545;${cssBtn}" href=${reqNo}> No,not me </a>` +
        `<a style="color: #0d6efd;${cssBtn}"  href=${reqYes}> Yes, I did </a></div>`,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  accountVerify,
};
