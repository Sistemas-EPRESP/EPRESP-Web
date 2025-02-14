// services/userService.js
const { Usuario } = require('../models');

async function createUser(cuit, password, tipo) {
  // Creamos el usuario (el modelo tiene hooks para encriptar la contraseña)
  const usuario = await Usuario.create({
    cuit,
    password,
    tipo,
    activo: true,
  });

  return usuario;
}

module.exports = {
  createUser,
};
