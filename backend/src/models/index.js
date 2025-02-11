const sequelize = require('../config/database/db');
const Usuario = require('./Usuario');
const Cooperativa = require('./Cooperativa');
const Administrador = require('./Administrador');

// Importamos las asociaciones
require('./asociaciones');

module.exports = {
  sequelize,
  Usuario,
  Cooperativa,
  Administrador,
};
