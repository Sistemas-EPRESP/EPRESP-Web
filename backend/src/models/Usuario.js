const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define(
  'Usuario',
  {
    cuit: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [8, 20], // Mínimo 8 y máximo 15 dígitos
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('cooperativa', 'administrador'),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Permite suspender usuarios sin eliminarlos
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft deletes (agrega `deletedAt`)
    tableName: 'usuarios',
    hooks: {
      beforeCreate: async (usuario) => {
        usuario.password = await bcrypt.hash(usuario.password, 10);
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      },
    },
  },
);

module.exports = Usuario;
