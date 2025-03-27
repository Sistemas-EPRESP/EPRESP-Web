const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

const generarPDF = (nombreHoja, datos) => {
  return new Promise((resolve, reject) => {
    const pdfPath = path.join(
      __dirname,
      '../../files/generated_pdfs',
      `${nombreHoja}.pdf`,
    );
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc
      .fontSize(18)
      .text(`Informe de Incumplimiento - ${nombreHoja}`, { align: 'center' });
    doc.moveDown();

    datos.forEach((fila, index) => {
      doc.fontSize(12).text(`${index + 1}. ${fila.join(' | ')}`);
    });

    doc.end();

    stream.on('finish', () => resolve(pdfPath));
    stream.on('error', reject);
  });
};

module.exports = { generarPDF };
