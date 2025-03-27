const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Incumplimientos = sequelize.define(
  'Incumplimientos',
  {
    tipo: {
      type: DataTypes.ENUM('Omisión de Pago', 'Falta de presentación del FR'),
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
    periodo: {
      type: DataTypes.INTEGER,
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
