const express = require('express');
const {
  verificarToken,
  verificarAdmin,
  verificarCooperativa,
} = require('../middlewares/authMiddlewares');
const authController = require('../controllers/authController');
const router = express.Router();

// 📌 🔓 Rutas públicas
router.post('/auth/login', authController.loginController); // Cualquier usuario puede loguearse
router.post('/refresh', authController.refreshTokenController);
router.post('/auth/logout', authController.logoutController);
//router.post('/auth/reset-password', authController.resetPasswordController); // Restablecer contraseña

module.exports = router;
