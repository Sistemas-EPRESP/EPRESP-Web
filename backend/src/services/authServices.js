const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Cooperativa } = require('../models');

// Generar Access Token
const generarAccessToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
};

// Generar Refresh Token
const generarRefreshToken = (usuario) => {
  return jwt.sign({ id: usuario.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// Función de login
const login = async (cuit, password) => {
  const usuario = await Usuario.findOne({ where: { cuit } });

  if (!usuario) {
    throw new Error('CUIT o contraseña incorrectos');
  }

  const isMatch = await bcrypt.compare(password, usuario.password);
  if (!isMatch) {
    throw new Error('CUIT o contraseña incorrectos');
  }

  // Obtener nombre de la cooperativa si es cooperativa
  let nombreCooperativa = null;
  if (usuario.tipo === 'cooperativa') {
    const cooperativa = await Cooperativa.findOne({
      where: { id: usuario.id },
    });
    nombreCooperativa = cooperativa ? cooperativa.nombre : null;
  }

  // Generar tokens
  const accessToken = generarAccessToken(usuario);
  const refreshToken = generarRefreshToken(usuario);

  return { accessToken, refreshToken, nombreCooperativa };
};

// Verificar y renovar Access Token con Refresh Token
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const nuevoAccessToken = generarAccessToken({ id: decoded.id });
    return nuevoAccessToken;
  } catch (error) {
    throw new Error('Refresh Token inválido o expirado');
  }
};

module.exports = { login };

// Función para obtener el usuario con su tipo (Cooperativa o Administrador)
// const obtenerUsuarioConTipo = async (usuarioId) => {
//   const usuario = await Usuario.findByPk(usuarioId);
//   if (usuario.tipo === 'cooperativa') {
//     const cooperativa = await Cooperativa.findOne({
//       where: { id: usuario.id },
//     });
//     return { usuario, cooperativa };
//   } else if (usuario.tipo === 'administrador') {
//     const administrador = await Administrador.findOne({
//       where: { id: usuario.id },
//     });
//     return { usuario, administrador };
//   }
// };

module.exports = { login, refreshAccessToken };
