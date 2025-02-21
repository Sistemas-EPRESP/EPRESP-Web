const express = require('express');
const { verificarToken } = require('../middlewares/authMiddlewares');
const rendicionController = require('../controllers/rendicionController');
const router = express.Router();

router.post(
  '/formulario-rendicion/:id',
  //verificarToken,
  rendicionController.createFormularioRendicion,
);

router.get('/obtener-rendicion/:id', rendicionController.obtenerRendicion);

module.exports = router;
