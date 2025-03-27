const xlsx = require('xlsx');
const path = require('path');

const obtenerDatosHoja = (nombreHoja) => {
  const excelFilePath = path.join(__dirname, '../../files/archivo.xlsx');
  const workbook = xlsx.readFile(excelFilePath);

  if (!workbook.Sheets[nombreHoja]) {
    throw new Error(`La hoja "${nombreHoja}" no existe.`);
  }

  return xlsx.utils.sheet_to_json(workbook.Sheets[nombreHoja], { header: 1 });
};

module.exports = { obtenerDatosHoja };
