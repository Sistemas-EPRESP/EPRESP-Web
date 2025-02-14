const userServices = require('../services/userServices');
const adminServices = require('../services/adminServices');
const coopServices = require('../services/coopServices');

const createUser = async (req, res) => {
  const { cuit, nombre, password, tipo, email } = req.body;

  try {
    // Llamamos al servicio que se encarga de la lógica de base de datos
    const usuario = await userServices.createUser(cuit, password, tipo);
    if (usuario.tipo === 'administrador') {
      await adminServices.createAdministrador(cuit, usuario.id);
    }

    if (usuario.tipo === 'cooperativa') {
      await coopServices.createCooperativa(cuit, nombre, email, usuario.id);
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario, // opcional, puedes retornarlo si quieres mostrar datos en la respuesta
    });
  } catch (error) {
    console.error(error);
    await userServices.deleteUser(cuit);
    res.status(500).json({
      message: 'Error en el servidor',
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
};
