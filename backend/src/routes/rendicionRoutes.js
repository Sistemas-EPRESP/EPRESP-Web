const express = require('express');
const {
  verificarToken,
  verificarAdmin,
  verificarCooperativa,
} = require('../middlewares/authMiddlewares');
const rendicionController = require('../controllers/rendicionController');
const router = express.Router();

// Ruta que crea un formulario de rendición
router.post(
  '/formulario-rendicion/:id',
  verificarToken,
  verificarCooperativa,
  rendicionController.createFormularioRendicion,
);

// Ruta que modifica un formulario de rendición
router.put(
  '/modificar-rendicion/:id',
  verificarToken,
  verificarCooperativa,
  rendicionController.updateFormularioRendicion,
);

// Ruta que devuelve un formulario de rendición
router.get(
  '/obtener-rendicion/:id',
  //verificarToken,
  rendicionController.obtenerRendicion,
);

// Ruta que aprueba una rendición por el administrador
router.post(
  '/aprobar-rendicion/:id',
  verificarToken,
  verificarAdmin,
  rendicionController.aprobarRendicion,
);

router.post(
  '/agregar-incumplimientos/:id',
  //verificarToken,
  //verificarAdmin,
  rendicionController.agregarIncumplimientos,
);
module.exports = router;
