const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Administrador, Cooperativa } = require('../models'); // Asegúrate de importar tus modelos.

// Función para autenticar al usuario
const login = async (email, password) => {
  // Buscar al usuario por su email
  const usuario = await Usuario.findOne({
    where: { email },
  });

  if (!usuario) {
    throw new Error('Correo electrónico o contraseña incorrectos');
  }

  // Verificar que la contraseña coincida
  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) {
    throw new Error('Correo electrónico o contraseña incorrectos');
  }

  // Generar un token JWT
  const token = jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return token;
};

// Función para obtener el usuario con su tipo (Cooperativa o Administrador)
const obtenerUsuarioConTipo = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (usuario.tipo === 'cooperativa') {
    const cooperativa = await Cooperativa.findOne({
      where: { id: usuario.id },
    });
    return { usuario, cooperativa };
  } else if (usuario.tipo === 'administrador') {
    const administrador = await Administrador.findOne({
      where: { id: usuario.id },
    });
    return { usuario, administrador };
  }
};

module.exports = { login, obtenerUsuarioConTipo };
