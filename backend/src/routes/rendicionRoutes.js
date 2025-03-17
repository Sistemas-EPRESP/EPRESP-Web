const express = require('express');
const {
  verificarToken,
  verificarAdmin,
  verificarCooperativa,
} = require('../middlewares/authMiddlewares');
const rendicionController = require('../controllers/rendicionController');
const router = express.Router();

router.post(
  '/formulario-rendicion/:id',
  verificarCooperativa,
  rendicionController.createFormularioRendicion,
);

router.put(
  '/modificar-rendicion/:id',
  verificarToken,
  verificarCooperativa,
  rendicionController.updateFormularioRendicion,
);

router.get(
  '/obtener-rendicion/:id',
  verificarToken,
  verificarCooperativa,
  rendicionController.obtenerRendicion,
);
router.post(
  '/aprobar-rendicion/:id',
  verificarToken,
  verificarAdmin,
  rendicionController.aprobarRendicion,
);

module.exports = router;
