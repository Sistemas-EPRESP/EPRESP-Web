const xlsx = require('xlsx');
const path = require('path');

const modificarExcel = async (cooperativa) => {
  try {
    const hoja = await obtenerHojaExcel(cooperativa.id);
    // Convertir la hoja a JSON para inspeccionar su contenido
    //const datos = xlsx.utils.sheet_to_json(hoja);

    // Obtener la fecha actual
    const fechaActual = new Date();
    const mesActual = String(fechaActual.getMonth() + 1).padStart(4, '0'); // Formato "0001" para enero
    const anioActual = fechaActual.getFullYear();

    // Modificar las celdas específicas
    const celdaIdCooperativa = 'C8'; // Fila 8, Columna C
    const celdaMes = 'D9'; // Fila 8, Columna D
    const celdaAnio = 'E10'; // Fila 8, Columna E

    hoja[celdaIdCooperativa] = { v: cooperativa.id }; // ID de la cooperativa
    hoja[celdaMes] = { v: mesActual }; // Mes en formato "0001"
    hoja[celdaAnio] = { v: anioActual }; // Año actual

    // Asegurarse de que las celdas modificadas estén marcadas como parte del rango de la hoja
    if (!hoja['!ref']) {
      hoja['!ref'] = 'A1:Z100'; // Ajustar el rango según el tamaño de la hoja
    }

    // Ruta del archivo Excel
    const excelFilePath = path.join(
      __dirname,
      '../../files/Notificación de Incumplimiento - Art. 27 Anexo Res. 38-2024 - EPRESP.xlsx',
    );

    // Escribir los cambios en el archivo Excel
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, hoja, 'Hoja Modificada');
    xlsx.writeFile(workbook, excelFilePath);

    console.log(
      `Hoja modificada correctamente para la cooperativa con ID ${cooperativa.id}`,
    );
  } catch (error) {
    console.error(
      `Error al modificar la hoja para la cooperativa con ID ${cooperativa.id}:`,
      error.message,
    );
    throw error;
  }
};

const obtenerHojaExcel = (idCooperativa) => {
  try {
    // Ruta del archivo Excel
    const excelFilePath = path.join(
      __dirname,
      '../../files/Notificación de Incumplimiento - Art. 27 Anexo Res. 38-2024 - EPRESP.xlsx',
    );

    // Leer el archivo Excel
    const workbook = xlsx.readFile(excelFilePath);

    // Formatear el ID de la cooperativa para que tenga dos dígitos (ej: "01", "02", etc.)
    const idFormateado = String(idCooperativa).padStart(2, '0');

    // Buscar la hoja cuyo nombre comienza con el ID formateado
    const nombreHoja = workbook.SheetNames.find((sheetName) =>
      sheetName.startsWith(idFormateado),
    );

    if (!nombreHoja) {
      throw new Error(
        `No se encontró una hoja para la cooperativa con ID ${idCooperativa}`,
      );
    }

    // Obtener la hoja correspondiente
    const hoja = workbook.Sheets[nombreHoja];
    return hoja;
  } catch (error) {
    console.error(
      `Error al obtener la hoja para la cooperativa con ID ${idCooperativa}:`,
      error.message,
    );
    throw error;
  }
};

const notificar = async (cooperativas) => {
  //console.log('Coops', cooperativas);

  await modificarExcel(cooperativas[0]);
  for (const cooperativa of cooperativas) {
    if (cooperativa.email !== null && cooperativa.id !== 6) {
      //No existe la hoja 06
      //console.log(cooperativa);

      const excel = await modificarExcel(cooperativa);
      //await enviarCorreo(cooperativa.email, pdfPath);
    }
  }
};

module.exports = { notificar };
