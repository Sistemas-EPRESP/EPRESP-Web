const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT_DEVELOP,
  secure: process.env.NODE_ENV === 'production',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_USER_PASS,
  },
});

const sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendMail,
};

module.exports = { transporter, sendMail };
