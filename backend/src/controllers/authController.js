const authService = require('../services/authServices');

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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hora
      sameSite: 'Strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: 'Strict',
    });

    return res.status(200).json({ userData });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const logoutController = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Expirar la cookie inmediatamente
    sameSite: 'Strict',
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
      sameSite: 'Strict',
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

module.exports = { loginController, logoutController, refreshTokenController };
