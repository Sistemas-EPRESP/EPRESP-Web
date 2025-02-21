const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/crear-usuario', usuarioController.createUser);
//router.post('/mail', usuarioController.sendMail);

module.exports = router;
