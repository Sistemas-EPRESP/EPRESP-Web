const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Cooperativa, Administrador } = require('../models');

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

  let userData = {};
  if (usuario.tipo === 'cooperativa') {
    // Buscar la cooperativa asociada
    const cooperativa = await Cooperativa.findOne({
      where: { usuarioId: usuario.id },
    });

    userData = {
      idUsuario: usuario.id,
      idCooperativa: cooperativa?.id || null,
      nombre: cooperativa?.nombre || null,
      cuit: usuario.cuit,
      email: cooperativa.email, // Asumiendo que tienes un campo email en la tabla Usuario
      tipo: usuario.tipo,
    };
  } else if (usuario.tipo === 'administrador') {
    // Buscar el administrador asociado
    const administrador = await Administrador.findOne({
      where: { usuarioId: usuario.id },
    });

    userData = {
      idUsuario: usuario.id,
      idAdministrador: administrador?.id || null,
      tipo: usuario.tipo,
    };
  }

  const accessToken = generarAccessToken(usuario); // Lógica tuya para firmar un Access Token
  const refreshToken = generarRefreshToken(usuario); // Lógica tuya para firmar un Refresh Token

  return {
    accessToken,
    refreshToken,
    userData,
  };
};

// // Verificar y renovar Access Token con Refresh Token
// const refreshAccessToken = (refreshToken) => {
//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
//     const nuevoAccessToken = generarAccessToken({ id: decoded.id });
//     return nuevoAccessToken;
//   } catch (error) {
//     throw new Error('Refresh Token inválido o expirado', error);
//   }
// };

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) return null;

    const nuevoAccessToken = generarAccessToken(usuario);

    let userData = {};
    if (usuario.tipo === 'cooperativa') {
      // Buscar la cooperativa asociada
      const cooperativa = await Cooperativa.findOne({
        where: { usuarioId: usuario.id },
      });

      userData = {
        idUsuario: usuario.id,
        idCooperativa: cooperativa?.id || null,
        nombre: cooperativa?.nombre || null,
        cuit: usuario.cuit,
        email: cooperativa.email, // Asumiendo que tienes un campo email en la tabla Usuario
        tipo: usuario.tipo,
      };
    } else if (usuario.tipo === 'administrador') {
      // Buscar el administrador asociado
      const administrador = await Administrador.findOne({
        where: { usuarioId: usuario.id },
      });

      userData = {
        idUsuario: usuario.id,
        idAdministrador: administrador?.id || null,
        tipo: usuario.tipo,
      };
    }
    // Devolver también datos del usuario
    //const userData = { cuit: usuario.cuit, tipo: usuario.tipo };
    return { nuevoAccessToken, userData };
  } catch (error) {
    console.error('Refresh Token inválido o expirado:', error);
    return null;
  }
};

module.exports = { login, refreshAccessToken };
