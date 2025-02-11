const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Administrador = sequelize.define(
  'Administrador',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes (eliminación lógica)
    tableName: 'administradores',
  },
);

module.exports = Administrador;
