const rendicionServices = require('../services/rendicionServices');

const createFormularioRendicion = async (req, res) => {
  try {
    const { id } = req.params;
    const formulario = req.body;
    console.log(formulario);

    await rendicionServices.agregarFormulario(formulario, id);

    return res.status(201).json({ message: 'Formulario creado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFormularioRendicion = async (req, res) => {
  try {
    const { id } = req.params;
    const formulario = req.body;

    await rendicionServices.modificarFormulario(formulario, id);

    return res
      .status(200)
      .json({ message: 'Formulario modificado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const obtenerRendicion = async (req, res) => {
  try {
    const { id } = req.params;

    const rendicion = await rendicionServices.obtenerRendicion(id);

    return res.status(200).json(rendicion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const aprobarRendicion = async (req, res) => {
  try {
    const { id } = req.params;

    await rendicionServices.aprobarRendicion(id);

    return res
      .status(200)
      .json({ message: 'Rendición aprobada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createFormularioRendicion,
  updateFormularioRendicion,
  obtenerRendicion,
  aprobarRendicion,
};
