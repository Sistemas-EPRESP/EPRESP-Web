// services/userService.js
const { Usuario } = require('../models');

const verificarUsuario = async (cuit) => {
  const usuarioExistente = await Usuario.findOne({ where: { cuit } });
  if (usuarioExistente) {
    throw new Error(`Ya existe un usuario con el CUIT: ${cuit}`);
  }
};

const createUser = async (cuit, password, tipo) => {
  // 1. Verificar si existe un usuario con el mismo CUIT
  await verificarUsuario(cuit);
  // 2. Crear el usuario
  const usuario = await Usuario.create({
    cuit,
    password,
    tipo,
    activo: true,
  });

  return usuario;
};

const deleteUserByCuit = async (cuit) => {
  // 1. Buscar el usuario por CUIT
  const usuario = await Usuario.findOne({ where: { cuit } });

  if (!usuario) {
    throw new Error(`No existe un usuario con el CUIT: ${cuit}`);
  }

  // 2. Eliminar permanentemente el usuario
  await usuario.destroy();

  return usuario; // Opcionalmente, podrías retornar información del usuario eliminado
};

module.exports = {
  createUser,
  deleteUserByCuit,
};
