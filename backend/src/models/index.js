const sequelize = require('../config/database/db');
const Usuario = require('./Usuario');
const Cooperativa = require('./Cooperativa');
const Administrador = require('./Administrador');
const Rendicion = require('./Rendicion');
const Demanda = require('./Demanda');

// Importamos las asociaciones
require('./asociaciones');

module.exports = {
  sequelize,
  Usuario,
  Cooperativa,
  Administrador,
  Rendicion,
  Demanda,
};
