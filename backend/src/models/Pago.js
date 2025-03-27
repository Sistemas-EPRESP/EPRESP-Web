const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Pago = sequelize.define(
  'Pago',
  {
    monto: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes (eliminación lógica)
    tableName: 'pagos',
  },
);

module.exports = Pago;
