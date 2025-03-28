const {
  Rendicion,
  Demanda,
  Cooperativa,
  Incumplimientos,
} = require('../models');

const Pago = require('../models/Pago');
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
    await verificarFormularioFueraDeTermino(nuevaRendicion);

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
      attributes: ['id', 'periodo_mes', 'periodo_anio', 'estado'],
    });
    return rendiciones;
  } catch (error) {
    throw new Error(error.message);
  }
};

const obtenerRendicion = async (id) => {
  try {
    // Verificar que el formulario exista
    const formulario = await verificarFormularioExistenteById(id);

    // Buscar la rendición con el ID proporcionado
    const rendicion = await Rendicion.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      include: [
        {
          model: Demanda,
          as: 'Demandas',
          attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        },
        {
          model: Cooperativa,
          attributes: ['nombre', 'cuit'],
        },
      ],
    });

    if (!rendicion) {
      throw new Error(`No se encontró una rendición con el ID ${id}.`);
    }

    // Buscar los incumplimientos asociados a la cooperativa y el periodo
    const incumplimientos = await Incumplimientos.findAll({
      where: {
        cooperativaId: formulario.cooperativaId,
        periodo: formulario.codigo_seguimiento, // Usar el código de seguimiento como periodo
      },
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    });

    // Agregar los incumplimientos al objeto rendición
    rendicion.dataValues.incumplimientos = incumplimientos;

    // Determinar si la rendición es actualizable
    rendicion.dataValues.actualizable = verificarActualizable(
      rendicion.fecha_rendicion,
    );

    return rendicion;
  } catch (error) {
    throw new Error(error.message);
  }
};

const verificarEstado = async (id, aprobado) => {
  try {
    // Verificar que el formulario exista
    const formulario = await verificarFormularioExistenteById(id);
    // Obtener los incumplimientos asociados al formulario
    const incumplimientos = await Incumplimientos.findAll({
      where: {
        cooperativaId: formulario.cooperativaId,
        periodo: formulario.codigo_seguimiento, // Usar el código de seguimiento como periodo
        aprobado: true, // Solo incumplimientos aprobados
      },
    });
    // Inicializar variables para verificar los estados
    let tieneFaltaDePresentacion = false;
    let tieneOmisionDePago = false;
    let tieneOtrosIncumplimientos = false;

    // Verificar los tipos de incumplimientos
    for (const incumplimiento of incumplimientos) {
      if (incumplimiento.tipo === 'Falta de presentación del FR') {
        tieneFaltaDePresentacion = true;
      } else if (incumplimiento.tipo === 'Omisión de Pago') {
        tieneOmisionDePago = true;
      } else {
        tieneOtrosIncumplimientos = true;
      }
    }

    // Determinar el estado de la rendición
    let estado;

    if (!aprobado) {
      if (tieneFaltaDePresentacion && tieneOmisionDePago) {
        estado = 'Incumplimientos';
      } else if (tieneFaltaDePresentacion) {
        estado = 'Falta de presentación del FR';
      } else if (tieneOmisionDePago) {
        estado = 'Omisión de Pago';
      } else if (tieneOtrosIncumplimientos) {
        estado = 'Incumplimientos';
      } else {
        estado = 'Pendiente';
      }
    } else {
      estado = 'Aprobado';
    }

    // Actualizar el estado de la rendición
    await Rendicion.update(
      { estado },
      {
        where: { id },
      },
    );

    return { message: `Estado actualizado a: ${estado}` };
  } catch (error) {
    throw new Error(error.message);
  }
};

const agregarPago = async (id, monto) => {
  try {
    await verificarFormularioExistenteById(id);

    await Pago.create({
      monto,
      fecha: new Date(),
      rendicionId: id,
    });
  } catch (error) {
    console.error('Error al agregar pago:', error);
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

const agregarIncumplimientos = async (incumplimientos, id) => {
  try {
    const formulario = await verificarFormularioExistenteById(id);

    // Mapear los incumplimientos y agregar los campos adicionales
    for (const incumplimiento of incumplimientos) {
      const { tipo, aprobado } = incumplimiento;

      // Verificar si ya existe un incumplimiento del mismo tipo, periodo y cooperativa
      const incumplimientoExistente = await Incumplimientos.findOne({
        where: {
          tipo,
          periodo: formulario.codigo_seguimiento, // Código de seguimiento del formulario
          cooperativaId: formulario.cooperativaId, // ID de la cooperativa asociada
        },
      });

      if (incumplimientoExistente) {
        // Si existe, actualizar el valor de "aprobado"
        await Incumplimientos.update(
          { aprobado },
          {
            where: {
              id: incumplimientoExistente.id,
            },
          },
        );
      } else {
        // Si no existe, crear un nuevo incumplimiento
        await Incumplimientos.create({
          ...incumplimiento,
          periodo: formulario.codigo_seguimiento,
          cooperativaId: formulario.cooperativaId,
        });
      }
    }
    return { message: 'Incumplimientos procesados exitosamente' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const verificarFormulariosCooperativas = async () => {
  try {
    const hoy = new Date();
    const mesAnterior = hoy.getMonth() === 0 ? 12 : hoy.getMonth();
    const anioAnterior =
      hoy.getMonth() === 0 ? hoy.getFullYear() - 1 : hoy.getFullYear();

    // Obtener todas las cooperativas
    const cooperativas = await Cooperativa.findAll({
      attributes: ['id', 'email'], // Incluir el correo electrónico
    });

    let cooperativasSinRendicion = [];

    for (const cooperativa of cooperativas) {
      const rendicion = await Rendicion.findOne({
        where: {
          cooperativaId: cooperativa.id,
          periodo_mes: mesAnterior,
          periodo_anio: anioAnterior,
        },
      });

      if (!rendicion) {
        cooperativasSinRendicion.push(cooperativa.dataValues); // Agregar el correo de la cooperativa
      }
    }
    return cooperativasSinRendicion; // Devolver los correos de las cooperativas sin rendición
  } catch (error) {
    console.error('Error al verificar formularios de cooperativas:', error);
    throw new Error(
      `Error al verificar formularios de cooperativas: ${error.message}`,
    );
  }
};

const verificarActualizable = (fecha_rendicion) => {
  const fechaRendicion = new Date(fecha_rendicion); // Fecha en la que se creó el formulario
  const fechaActual = new Date(); // Fecha actual

  // Calcular la fecha límite (día 10 del mes siguiente o del mismo mes)
  let fechaLimite;
  if (fechaRendicion.getDate() <= 10) {
    // Si la fecha de rendición es antes o el mismo día 10, la fecha límite es el día 10 del mismo mes
    fechaLimite = new Date(
      fechaRendicion.getFullYear(),
      fechaRendicion.getMonth(),
      10,
    );
  } else {
    // Si la fecha de rendición es después del día 10, la fecha límite es el día 10 del mes siguiente
    fechaLimite = new Date(
      fechaRendicion.getFullYear(),
      fechaRendicion.getMonth() + 1,
      10,
    );
  }

  // Comparar la fecha actual con la fecha límite
  return fechaActual <= fechaLimite; // Devuelve true si la fecha actual está dentro del rango permitido
};

const verificarFormularioFueraDeTermino = async (formularioCreado) => {
  try {
    const { periodo_mes, periodo_anio } = formularioCreado;

    // Obtener el mes y año actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript son 0-11
    const anioActual = fechaActual.getFullYear();

    // Calcular el mes y año anterior
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;

    // Verificar si el formulario no corresponde al mes anterior
    const esFueraDeTermino =
      periodo_anio !== anioAnterior || periodo_mes !== mesAnterior;

    if (esFueraDeTermino) {
      // Crear los incumplimientos por declaración fuera de término
      const incumplimientos = [
        {
          tipo: 'Falta de presentación del FR',
          aprobado: true,
        },
        {
          tipo: 'Omisión de Pago',
          aprobado: true,
        },
      ];

      // Llamar a la función agregarIncumplimientos con el ID del formulario creado
      await agregarIncumplimientos(incumplimientos, formularioCreado.id);
      await verificarEstado(formularioCreado.id, false);
    }
    return esFueraDeTermino;
  } catch (error) {
    throw new Error(
      `Error al verificar formulario fuera de término: ${error.message}`,
    );
  }
};

module.exports = {
  agregarFormulario,
  modificarFormulario,
  obtenerPreRendiciones,
  obtenerRendicion,
  agregarPago,
  verificarEstado,
  agregarIncumplimientos,
  verificarFormulariosCooperativas,
};
