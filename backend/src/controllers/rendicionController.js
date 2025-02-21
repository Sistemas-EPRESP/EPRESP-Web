const rendicionServices = require('../services/rendicionServices');

const createFormularioRendicion = async (req, res) => {
  try {
    const { id } = req.params;
    const formulario = req.body;

    await rendicionServices.agregarFormulario(formulario, id);

    return res.status(201).json({ message: 'Formulario creado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createFormularioRendicion };
