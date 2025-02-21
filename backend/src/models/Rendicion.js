const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Rendicion = sequelize.define(
  'Rendicion',
  {
    fecha_rendicion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_transferencia: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    periodo_mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periodo_anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tasa_fiscalizacion_letras: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tasa_fiscalizacion_numero: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    total_transferencia_letras: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total_transferencia_numero: {
      type: DataTypes.DECIMAL(10, 2), // Garantiza dos decimales
      allowNull: false,
    },
    codigo_seguimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    aprobado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes (agrega `deletedAt`)
    tableName: 'rendiciones',
  },
);

module.exports = Rendicion;
