const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Incumplimientos = sequelize.define(
  'Incumplimientos',
  {
    tipo: {
      type: DataTypes.ENUM('Omisión de pago', 'Falta de presentacion del FR'),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aprobado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: 'incumplimientos',
  },
);

module.exports = Incumplimientos;
