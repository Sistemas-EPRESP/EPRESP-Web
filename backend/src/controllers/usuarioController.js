const userServices = require('../services/userServices');
const adminServices = require('../services/adminServices');
const coopServices = require('../services/coopServices');

const createUser = async (req, res) => {
  const {
    id,
    cuit,
    nombre,
    password,
    tipo,
    email,
    ciudad,
    numero_expediente,
    ref,
  } = req.body;
  let usuario = null;
  try {
    // Llamamos al servicio que se encarga de la lógica de base de datos
    usuario = await userServices.createUser(cuit, password, tipo, email);
    if (usuario.tipo === 'administrador') {
      await adminServices.createAdministrador(cuit, usuario.id);
    }

    if (usuario.tipo === 'cooperativa') {
      await coopServices.createCooperativa(
        id,
        cuit,
        nombre,
        email,
        usuario.id,
        ciudad,
        numero_expediente,
        ref,
      );
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario, // opcional, puedes retornarlo si quieres mostrar datos en la respuesta
    });
  } catch (error) {
    if (usuario) {
      await userServices.deleteUserByCuit(usuario.cuit);
    }
    res.status(404).json({
      error: error.message,
    });
  }
};

// const sendMail = async (req, res) => {
//   const { email, subject, message } = req.body;
//   try {
//     await userServices.sendMail(email, subject, message);
//     res.status(200).json({
//       message: 'Correo enviado exitosamente',
//     });
//   } catch (error) {
//     res.status(404).json({
//       error: error.message,
//     });
//   }
// };

module.exports = {
  createUser,
};
