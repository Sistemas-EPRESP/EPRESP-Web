const coopServices = require('../services/coopServices');
const rendicionServices = require('../services/rendicionServices');

const obtenerCooperativas = async (req, res) => {
  try {
    const cooperativas = await coopServices.getAllCooperativas();
    res.json(cooperativas);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const obtenerPreFormularios = async (req, res) => {
  try {
    const { id } = req.params;
    const preRendiciones = await rendicionServices.obtenerPreRendiciones(id);
    res.status(200).json(preRendiciones);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = { obtenerCooperativas, obtenerPreFormularios };
