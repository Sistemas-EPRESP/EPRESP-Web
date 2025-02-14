const express = require('express');
const {
  verificarToken,
  verificarCooperativa,
} = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post('/formulario-rendicion', verificarToken, verificarCooperativa);
