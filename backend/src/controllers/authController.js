const authService = require('../services/authServices');
const { Usuario, Administrador, Cooperativa } = require('../models');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const loginController = async (req, res) => {
  const { cuit, password } = req.body;

  if (!cuit || !password) {
    return res
      .status(400)
      .json({ message: 'Por favor ingresa todos los campos.' });
  }

  try {
    const { accessToken, refreshToken, userData } = await authService.login(
      cuit,
      password,
    );

    // Guardamos ambos tokens en cookies httpOnly
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: process.env.SAME_SITE,
      secure: process.env.NODE_ENV === 'production', //process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hora
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', //process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const logoutController = async (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expirar la cookie inmediatamente
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expirar la cookie inmediatamente
  });

  return res.status(200).json({ message: 'Logout exitoso' });
};
// Endpoint para refrescar el Access Token
const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No autorizado, token faltante' });
    }

    const result = await authService.refreshAccessToken(refreshToken);
    if (!result || !result.nuevoAccessToken) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    // Establecer nuevo AccessToken en cookie
    res.cookie('accessToken', result.nuevoAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return res
      .status(200)
      .json({ message: 'Token renovado', userData: result.userData });
  } catch (error) {
    console.error('Error al renovar token:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const meController = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log('ME controller: ', req.cookies.accessToken);

    if (!accessToken) {
      return res.status(401).json({ message: 'No hay accessToken en cookies' });
    }

    // Verificamos el token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Armamos la misma lógica de userData que en login
    let userData = {};
    if (usuario.tipo === 'cooperativa') {
      const cooperativa = await Cooperativa.findOne({
        where: { usuarioId: usuario.id },
      });
      userData = {
        idUsuario: usuario.id,
        idCooperativa: cooperativa?.id || null,
        nombre: cooperativa?.nombre || null,
        cuit: usuario.cuit,
        email: cooperativa.email,
        tipo: usuario.tipo,
      };
    } else if (usuario.tipo === 'administrador') {
      const administrador = await Administrador.findOne({
        where: { usuarioId: usuario.id },
      });
      userData = {
        idUsuario: usuario.id,
        idAdministrador: administrador?.id || null,
        tipo: usuario.tipo,
      };
    }

    // Devolvemos userData
    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
  meController,
};
