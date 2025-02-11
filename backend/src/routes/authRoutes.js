const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para hacer login
router.post('/login', authController.loginController);

module.exports = router;
