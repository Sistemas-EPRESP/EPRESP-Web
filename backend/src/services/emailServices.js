const nodemailer = require('nodemailer');
const path = require('path');
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

const enviarCorreo = async (email, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Notificaciones" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Notificación de Incumplimiento',
    text: 'Adjunto encontrará el informe de incumplimiento.',
    attachments: [{ filename: path.basename(pdfPath), path: pdfPath }],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { transporter, enviarCorreo };
