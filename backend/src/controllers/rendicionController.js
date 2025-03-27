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

const revision = async (req, res) => {
  try {
    const { id } = req.params;
    const { incumplimientos, aprobado, monto } = req.body.revision;
    await rendicionServices.agregarIncumplimientos(incumplimientos, id);

    if (monto > 0) {
      await rendicionServices.agregarPago(id, monto);
    }
    await rendicionServices.verificarEstado(id, aprobado);
    return res.status(201).json({ message: 'Revision agregada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createFormularioRendicion,
  updateFormularioRendicion,
  obtenerRendicion,
  aprobarRendicion,
  revision,
};
