const cron = require('node-cron');
//const { verificarFormulariosCooperativas } = require('./services/rendicionService');

/**
 * Programar la tarea para que corra todos los días a las 9:00 AM
 * Formato CRON: 0 9 * * *  => Minuto 0, Hora 9, Todos los días, Todos los meses, Todos los días de la semana
 */
cron.schedule('0 9 * * *', async () => {
  try {
    const hoy = new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    // Comprobar si hoy es el día en que debemos verificar
    if (esDiaHabil10(hoy)) {
      console.log('==> Ejecutando verificación de formularios...');
      //await verificarFormulariosCooperativas();
    } else {
      console.log('==> Hoy no corresponde la verificación de formularios');
    }
  } catch (error) {
    console.error('Error en el cron job:', error);
  }
});

/**
 * Función para verificar si es el "día hábil 10" del mes
 * - Si hoy es 10 y es día hábil (Lunes a Viernes), retorna true.
 * - Si el 10 cae sábado o domingo, retorna true el Lunes siguiente.
 */
const esDiaHabil10 = (fecha) => {
  const diaSemana = fecha.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
  const diaMes = fecha.getDate();

  // Si hoy es 10 y es día de semana (1-5)
  if (diaMes === 10 && diaSemana >= 1 && diaSemana <= 5) {
    return true;
  }

  // Si hoy es lunes (1) y el día del mes es 11 o 12,
  // y el 10 cayó sábado (6) o domingo (0), haz la verificación hoy
  if (diaSemana === 1 && (diaMes === 11 || diaMes === 12)) {
    // Revisar si el 10 fue sábado o domingo
    const dia10 = new Date(fecha.getFullYear(), fecha.getMonth(), 10);
    const diaSemana10 = dia10.getDay();
    if (diaSemana10 === 6 || diaSemana10 === 0) {
      return true;
    }
  }

  return false;
};

module.exports = {}; // Exporta si lo necesitas en otro lugar
