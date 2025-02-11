const authService = require('../services/authServices');

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Por favor ingresa todos los campos.' });
  }

  try {
    const token = await authService.login(email, password);

    // Establecer el token como cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si está en producción
      maxAge: parseInt(process.env.COOKIE_MAX_AGE), // Tiempo de expiración
      sameSite: 'Strict', // Prevenir CSRF
    });

    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = { loginController };
