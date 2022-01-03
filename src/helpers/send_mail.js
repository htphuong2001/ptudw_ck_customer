require("dotenv").config();
const nodemailer = require("nodemailer");

const btnStyle =
  "background: coral; padding: 8px 16px; color: #fff; text-decoration: none; line-height: 40px; height: 40px; display: inline-block;";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const accountVerify = async (emailrReceived, link) => {
  try {
    await transporter.sendMail({
      from: `${process.env.MAIL_USER}`,
      to: `${emailrReceived}`,
      subject: "Account verify",
      html: `<div><p>Please click the Verify button to activate the account</p> <a href="${link}" style="${btnStyle}">Verify</a></div>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  accountVerify,
};
