const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Demanda = sequelize.define(
  'Demanda',
  {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false, // residencial, comercial, etc.
    },
    facturacion: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    total_tasa_fiscalizacion: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    total_percibido: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    total_transferido: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes (agrega `deletedAt`)
    tableName: 'demandas',
  },
);

module.exports = Demanda;
