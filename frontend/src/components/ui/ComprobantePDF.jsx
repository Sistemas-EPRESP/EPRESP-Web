const ComprobantePDF = () => {
  // Datos de prueba (puedes cambiar 'null' para simular la ausencia de archivo)
  const nombreArchivo = "Comprobante_INV-2023-001.pdf";
  const fechaSubida = "15/05/2023";
  const rutaArchivo = "/archivos/Comprobante_INV-2023-001.pdf"; // Ruta simulada del archivo

  // Simulación de ausencia de archivo (cambiar a 'null' para probar)
  const archivoDisponible = nombreArchivo && rutaArchivo;

  return (
    <div className="w-full">
      {/* Título */}
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Comprobante de pago</h2>

      {/* Contenedor del comprobante */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm w-full">
        {archivoDisponible ? (
          <>
            {/* Información del archivo */}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{nombreArchivo}</span>
              <span className="text-sm text-gray-500">PDF • Subido el {fechaSubida}</span>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <a
                href={rutaArchivo}
                target="_blank"
                rel="noopener noreferrer"
                className="border px-4 py-2 rounded-lg text-gray-900 hover:bg-gray-200 transition"
              >
                Visualizar
              </a>
              <a
                href={rutaArchivo}
                download
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Descargar
              </a>
            </div>
          </>
        ) : (
          <span className="text-gray-500">No hay comprobante de pago disponible.</span>
        )}
      </div>
    </div>
  );
};

export default ComprobantePDF;
