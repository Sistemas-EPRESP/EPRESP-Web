const cron = require('node-cron');
const { verificarFormulariosCooperativas } = require('./rendicionServices');

/**
 * Programar la tarea para que corra todos los días a las 23:59
 */
// cron.schedule('59 23 * * *', async () => {
//   try {
//     const hoy = new Date();
//     hoy.setHours(hoy.getHours() - 3); // Ajustar a horario de Argentina

//     if (esDiaHabil10(hoy)) {
//       console.log('==> Ejecutando verificación de formularios...');
//       await verificarFormulariosCooperativas();
//     } else {
//       console.log('==> Hoy no corresponde la verificación de formularios.');
//     }
//   } catch (error) {
//     console.error('Error en el cron job:', error);
//   }
// });

// /**
//  * Función para verificar si hoy es el "día hábil 10" del mes o el lunes siguiente si el 10 cayó en fin de semana.
//  */
// const esDiaHabil10 = (fecha) => {
//   const diaSemana = fecha.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
//   const diaMes = fecha.getDate();

//   // Si hoy es 10 y es día hábil (lunes a viernes)
//   if (diaMes === 10 && diaSemana >= 1 && diaSemana <= 5) {
//     return true;
//   }

//   // Si hoy es lunes y el día del mes es 11 o 12, y el 10 fue fin de semana
//   if (diaSemana === 1 && (diaMes === 11 || diaMes === 12)) {
//     const dia10 = new Date(fecha.getFullYear(), fecha.getMonth(), 10);
//     const diaSemana10 = dia10.getDay();

//     if (diaSemana10 === 6 || diaSemana10 === 0) {
//       return true; // Si el 10 fue sábado o domingo, hoy (lunes) es el día de verificación
//     }
//   }

//   return false;
// };

/***************TEST****************/
/**
 * Para pruebas: cambiar a '* * * * *' para ejecutar cada minuto.
 * Para producción: '59 23 * * *' (23:59 todos los días).
 */
cron.schedule('* * * * *', async () => {
  try {
    const hoy = new Date('2025-04-10T23:59:00Z');
    //hoy.setHours(hoy.getHours() - 3); // Ajustar a horario de Argentina

    console.log(`📅 Verificando en fecha simulada: ${hoy.toISOString()}`);

    if (esDiaHabil10(hoy)) {
      console.log('✅ Hoy es el día de verificación. Ejecutando lógica...');
      const cooperativas = await verificarFormulariosCooperativas();
      await enviarMails(cooperativas);
    } else {
      console.log('❌ Hoy NO es el día de verificación.');
    }
  } catch (error) {
    console.error('⚠️ Error en el cron job:', error);
  }
});

/**
 * Función para verificar si hoy es el "día hábil 10" o el lunes siguiente si el 10 fue fin de semana.
 */
const esDiaHabil10 = (fecha) => {
  const diaSemana = fecha.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
  const diaMes = fecha.getDate();

  console.log(`📆 Día del mes: ${diaMes}, Día de la semana: ${diaSemana}`);

  if (diaMes === 10 && diaSemana >= 1 && diaSemana <= 5) {
    console.log('✅ Hoy es 10 y es día hábil.');
    return true;
  }

  if (diaSemana === 1 && (diaMes === 11 || diaMes === 12)) {
    const dia10 = new Date(fecha.getFullYear(), fecha.getMonth(), 10);
    const diaSemana10 = dia10.getDay();

    if (diaSemana10 === 6 || diaSemana10 === 0) {
      console.log(
        '✅ Hoy es lunes y el 10 fue fin de semana. Se ejecuta la verificación.',
      );
      return true;
    }
  }

  return false;
};

module.exports = {};
