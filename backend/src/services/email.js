const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.tu_proveedor.com',
  port: 587, // 465 si usas SSL
  secure: false, // true si usas SSL
  auth: {
    user: 'tu_correo@tudominio.com',
    pass: 'tu_password',
  },
});

module.exports = transporter;
