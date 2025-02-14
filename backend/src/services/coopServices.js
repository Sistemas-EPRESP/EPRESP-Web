// services/cooperativaService.js
const { Op } = require('sequelize');
const { Cooperativa } = require('../models');

/**
 * Crea una cooperativa nueva si no existe otra con el mismo CUIT o email
 * @param {string} nombre - Nombre de la cooperativa
 * @param {string|number} cuit - CUIT de la cooperativa
 * @param {string} email - Email de la cooperativa
 * @param {number} idUsuario - ID del usuario asociado
 * @returns {Promise<object>} - La cooperativa creada
 */
async function createCooperativa(nombre, cuit, email, idUsuario) {
  // 1. Verificar si ya existe una cooperativa con el mismo CUIT o email
  const cooperativaExistente = await Cooperativa.findOne({
    where: {
      [Op.or]: [{ cuit }, { email }],
    },
  });

  if (cooperativaExistente) {
    throw new Error('Ya existe una cooperativa con ese CUIT o email');
  }

  // 2. Crear la cooperativa
  const nuevaCooperativa = await Cooperativa.create({
    nombre,
    cuit,
    email,
    usuarioId: idUsuario, // Clave foránea al usuario, si aplica
  });

  return nuevaCooperativa;
}

module.exports = {
  createCooperativa,
};
