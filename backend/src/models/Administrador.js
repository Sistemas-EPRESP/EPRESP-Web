const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Administrador = sequelize.define(
  'Administrador',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    cuit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [8, 15], // Mínimo 8 y máximo 15 dígitos
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
