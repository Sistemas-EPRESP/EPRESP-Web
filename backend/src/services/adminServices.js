const Administrador = require('../models/Administrador');

const createAdministrador = async (cuit, idUsuario) => {
  return Administrador.create({
    nombre: 'admin',
    apellido: 'admin',
    cuit,
    usuarioId: idUsuario,
  });
};

module.exports = { createAdministrador };
