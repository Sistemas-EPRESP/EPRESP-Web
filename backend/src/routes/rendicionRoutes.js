const express = require('express');
const {
  verificarToken,
  verificarCooperativa,
} = require('../middlewares/authMiddlewares');
const rendicionController = require('../controllers/rendicionController');
const router = express.Router();

router.post(
  '/formulario-rendicion/:id',
  verificarToken,
  verificarCooperativa,
  rendicionController.createFormularioRendicion,
);
