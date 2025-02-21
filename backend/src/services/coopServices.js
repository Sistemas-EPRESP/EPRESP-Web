// services/cooperativaService.js
const { Op, where } = require('sequelize');
const { Cooperativa } = require('../models');

/**
 * Crea una cooperativa nueva si no existe otra con el mismo CUIT o email
 * @param {string} nombre - Nombre de la cooperativa
 * @param {string|number} cuit - CUIT de la cooperativa
 * @param {string} email - Email de la cooperativa
 * @param {number} idUsuario - ID del usuario asociado
 * @returns {Promise<object>} - La cooperativa creada
 */
const createCooperativa = async (
  id,
  cuit,
  nombre,
  email,
  idUsuario,
  ciudad,
  numero_expediente,
  ref,
) => {
  const whereCondition = {
    [Op.or]: [{ cuit }],
  };

  if (email) {
    whereCondition[Op.or].push({ email });
  }

  // 2. Verificar si ya existe una cooperativa con el mismo CUIT o email
  const cooperativaExistente = await Cooperativa.findOne({
    where: whereCondition,
  });

  if (cooperativaExistente) {
    throw new Error('Ya existe una cooperativa con ese CUIT o email');
  }

  const nuevaCooperativa = await Cooperativa.create({
    id,
    nombre,
    cuit,
    email,
    usuarioId: idUsuario, // Clave foránea al usuario, si aplica
    ciudad,
    numero_expediente,
    ref,
  });

  return nuevaCooperativa;
};

const getAllCooperativas = async () => {
  try {
    const cooperativas = await Cooperativa.findAll({
      attributes: ['id', 'nombre'],
    });
    return cooperativas;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCooperativa,
  getAllCooperativas,
};
