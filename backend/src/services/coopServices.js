// services/cooperativaService.js
const { Op, where } = require('sequelize');
const { Cooperativa, Rendicion } = require('../models');

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

/**
 * Verifica si cada cooperativa ha cargado su formulario de rendición
 * para el periodo correspondiente. Si no, envía un correo de aviso.
 */
const verificarFormulariosCooperativas = async () => {
  // 1. Determinar el periodo a verificar (por ejemplo, el mes y año actual o el anterior)
  //    Suponiendo que quieres verificar el mes actual:
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1; // Enero = 0, sumamos 1

  // 2. Obtener todas las cooperativas
  const cooperativas = await Cooperativa.findAll();

  // 3. Para cada cooperativa, revisar si existe una rendición
  for (const coop of cooperativas) {
    const rendicion = await Rendicion.findOne({
      where: {
        cooperativaId: coop.id,
        periodo_anio: anio,
        periodo_mes: mes,
      },
    });

    // 4. Si NO existe rendición => enviar correo
    if (!rendicion) {
      await enviarCorreoFaltaRendicion(coop);
    }
  }
};

/**
 * Envía el correo de aviso a la cooperativa
 */
const enviarCorreoFaltaRendicion = (cooperativa) => {
  const asunto = 'Aviso de Rendición no enviada';
  const mensaje = `Hola ${cooperativa.nombre}, le recordamos que no ha enviado la rendición correspondiente.`;

  // Llama a tu servicio de envío de correo
  //await enviarCorreo(cooperativa.email, asunto, mensaje);
};

module.exports = {
  createCooperativa,
  getAllCooperativas,
  verificarFormulariosCooperativas,
};
