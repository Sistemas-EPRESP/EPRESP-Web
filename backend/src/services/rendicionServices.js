const { Rendicion, Demanda, Cooperativa } = require('../models');
const { Op } = require('sequelize');

const agregarFormulario = async (formulario, idCooperativa) => {
  const {
    fecha_rendicion,
    fecha_transferencia,
    periodo_mes,
    periodo_anio,
    tasa_fiscalizacion_letras,
    tasa_fiscalizacion_numero,
    total_transferencia_letras,
    total_transferencia_numero,
    demandas,
  } = formulario.rendicion;

  // 1. Generar codigoSeguimiento (p.ej. "202502")
  const codigoSeguimiento = `${periodo_anio}${String(periodo_mes).padStart(2, '0')}`;

  // 2. Verificar duplicado
  await verificarFormularioDuplicado(idCooperativa, codigoSeguimiento);

  // 3. Crear la rendición
  const nuevaRendicion = await Rendicion.create({
    cooperativaId: idCooperativa,
    fecha_rendicion,
    fecha_transferencia,
    periodo_mes,
    periodo_anio,
    tasa_fiscalizacion_letras,
    tasa_fiscalizacion_numero,
    total_transferencia_letras,
    total_transferencia_numero,
    codigo_seguimiento: codigoSeguimiento, // Guardamos el código
  });

  // 4. Crear las demandas asociadas
  if (demandas) {
    const arrayDemandas = Object.entries(demandas).map(([tipo, data]) => ({
      tipo,
      facturacion: data.facturacion,
      total_tasa_fiscalizacion: data.total_tasa_fiscalizacion,
      total_percibido: data.total_percibido,
      total_transferido: data.total_transferido,
      observaciones: data.observaciones,
      rendicionId: nuevaRendicion.id,
    }));

    await Demanda.bulkCreate(arrayDemandas);
  }

  return nuevaRendicion;
};

const modificarFormulario = async (formulario, id) => {
  const {
    fecha_rendicion,
    fecha_transferencia,
    periodo_mes,
    periodo_anio,
    tasa_fiscalizacion_letras,
    tasa_fiscalizacion_numero,
    total_transferencia_letras,
    total_transferencia_numero,
    demandas,
  } = formulario.rendicion;

  const codigoSeguimiento = `${periodo_anio}${String(periodo_mes).padStart(2, '0')}`;

  try {
    // Verificar que el formulario exista
    const formularioExistente = await verificarFormularioExistenteById(id);

    // Verificar que el nuevo periodo no exista en otro registro
    const rendicionDuplicada = await Rendicion.findOne({
      where: {
        cooperativaId: formularioExistente.cooperativaId,
        codigo_seguimiento: codigoSeguimiento,
        id: { [Op.ne]: id }, // Excluir el registro actual
      },
    });

    if (rendicionDuplicada) {
      throw new Error(
        `El período ${periodo_mes}/${periodo_anio} ya se encuentra declarado en otro registro.`,
      );
    }

    // Actualizar la rendición
    await Rendicion.update(
      {
        fecha_rendicion,
        fecha_transferencia,
        periodo_mes,
        periodo_anio,
        tasa_fiscalizacion_letras,
        tasa_fiscalizacion_numero,
        total_transferencia_letras,
        total_transferencia_numero,
        codigo_seguimiento: codigoSeguimiento,
      },
      {
        where: { id },
      },
    );

    // Actualizar las demandas asociadas
    if (demandas) {
      for (const [tipo, data] of Object.entries(demandas)) {
        const demandaExistente = await Demanda.findOne({
          where: { rendicionId: id, tipo },
        });

        if (demandaExistente) {
          // Actualizar demanda existente
          await Demanda.update(
            {
              facturacion: data.facturacion,
              total_tasa_fiscalizacion: data.total_tasa_fiscalizacion,
              total_percibido: data.total_percibido,
              total_transferido: data.total_transferido,
              observaciones: data.observaciones,
            },
            {
              where: { id: demandaExistente.id },
            },
          );
        } else {
          // Crear nueva demanda si no existe
          await Demanda.create({
            tipo,
            facturacion: data.facturacion,
            total_tasa_fiscalizacion: data.total_tasa_fiscalizacion,
            total_percibido: data.total_percibido,
            total_transferido: data.total_transferido,
            observaciones: data.observaciones,
            rendicionId: id,
          });
        }
      }
    }

    return await verificarFormularioExistenteById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

const verificarFormularioDuplicado = async (
  idCooperativa,
  codigoSeguimiento,
) => {
  const rendicionExistente = await Rendicion.findOne({
    where: {
      cooperativaId: idCooperativa,
      codigo_seguimiento: codigoSeguimiento,
    },
  });

  if (rendicionExistente) {
    throw new Error(
      `Este período ya se encuentra declarado. Código de seguimiento: ${codigoSeguimiento}`,
    );
  }
};

const obtenerPreRendiciones = async (id) => {
  try {
    const rendiciones = await Rendicion.findAll({
      where: { cooperativaId: id },
      attributes: ['id', 'periodo_mes', 'periodo_anio', 'aprobado'],
    });
    return rendiciones;
  } catch (error) {
    throw new Error(error.message);
  }
};

const obtenerRendicion = async (id) => {
  try {
    await verificarFormularioExistenteById(id);
    const rendicion = await Rendicion.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        {
          model: Demanda,
          as: 'Demandas',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
        { model: Cooperativa, attributes: ['nombre', 'cuit'] },
      ],
    });

    return rendicion;
  } catch (error) {
    throw new Error(error.message);
  }
};

const aprobarRendicion = async (id) => {
  try {
    await verificarFormularioExistenteById(id);
    await Rendicion.update({ aprobado: true }, { where: { id } });
  } catch (error) {
    throw new Error(error.message);
  }
};

const verificarFormularioExistenteById = async (id) => {
  const formularioExistente = await Rendicion.findByPk(id);
  if (!formularioExistente) {
    throw new Error(`El formulario con ID ${id} no existe.`);
  }
  return formularioExistente;
};

module.exports = {
  agregarFormulario,
  modificarFormulario,
  obtenerPreRendiciones,
  obtenerRendicion,
  aprobarRendicion,
};
