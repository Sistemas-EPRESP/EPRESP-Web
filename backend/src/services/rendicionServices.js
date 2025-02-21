const { Rendicion, Demanda } = require('../models');

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

  // 4. (Opcional) Crear las demandas asociadas
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

module.exports = { agregarFormulario };

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

//CONTROLAR EL PERIODO JUNTO CON LA COOPERATIVA

module.exports = { agregarFormulario, obtenerPreRendiciones };
