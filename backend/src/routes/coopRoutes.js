const express = require('express');
const router = express.Router();
const {
  verificarToken,
  verificarAdmin,
} = require('../middlewares/authMiddlewares');

const coopController = require('../controllers/coopControllers');

// Ruta para obtener todas las cooperativas
router.get(
  '/obtener-cooperativas',
  //verificarToken,
  //verificarAdmin,
  coopController.obtenerCooperativas,
);

// Ruta para obtener datos previos a un formulario de una cooperativa por ID
router.get(
  '/obtener-preformularios/:id',
  //verificarToken,
  //verificarAdmin,
  coopController.obtenerPreFormularios,
);

module.exports = router;
