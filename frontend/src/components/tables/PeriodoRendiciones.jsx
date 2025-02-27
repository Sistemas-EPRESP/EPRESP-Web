const PeriodoRendiciones = ({ selectedMonth }) => {
  const rows = [
    ["Enero", "1 a 31 de Diciembre", "1 a 31 de Enero", "1 a 10 de Febrero"],
    ["Febrero", "1 a 31 de Enero", "1 a 28 de Febrero", "1 a 10 de Marzo"],
    ["Marzo", "1 a 28 de Febrero", "1 a 31 de Marzo", "1 a 10 de Abril"],
    ["Abril", "1 a 31 de Marzo", "1 a 30 de Abril", "1 a 10 de Mayo"],
    ["Mayo", "1 a 30 de Abril", "1 a 31 de Mayo", "1 a 10 de Junio"],
    ["Junio", "1 a 31 de Mayo", "1 a 30 de Junio", "1 a 10 de Julio"],
    ["Julio", "1 a 30 de Junio", "1 a 31 de Julio", "1 a 10 de Agosto"],
    ["Agosto", "1 a 31 de Julio", "1 a 31 de Agosto", "1 a 10 de Septiembre"],
    [
      "Septiembre",
      "1 a 31 de Agosto",
      "1 a 30 de Septiembre",
      "1 a 10 de Octubre",
    ],
    [
      "Octubre",
      "1 a 30 de Septiembre",
      "1 a 31 de Octubre",
      "1 a 10 de Noviembre",
    ],
    [
      "Noviembre",
      "1 a 31 de Octubre",
      "1 a 30 de Noviembre",
      "1 a 10 de Diciembre",
    ],
    [
      "Diciembre",
      "1 a 30 de Noviembre",
      "1 a 31 de Diciembre",
      "1 a 10 de Enero",
    ],
  ];

  return (
    <div className="mt-12 space-y-8">
      {/* Aclaraciones u otra info */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aclaraciones
        </h3>
        <ol className="list-[lower-alpha] pl-5 space-y-3 text-gray-700">
          <li>
            El "Periodo de Rendición" se corresponde con el mes de percepción de
            la factura, de acuerdo con el articulo 7° del Anexo de la
            Res.N°38/2024 - EPRESP.
          </li>
          <li>
            La "Facturación" considerada como base e imponible es la
            correspondiente al mes anterior al "Periodo de Rendición".
          </li>
          <li>
            El importe en columna "Total Transferido" puede ser mayor que el de
            la columna "Total Percibido" debido a cobros de deudores morosos.
          </li>
        </ol>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período de Rendición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período de Facturación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período de Percepción de Facturación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período de Rendición y Pago
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => {
              // Convertimos el índice + 1 a formato "01", "02", etc.
              const mesFila = (index + 1).toString().padStart(2, "0");
              const isSelected = mesFila === selectedMonth;
              return (
                <tr
                  key={index}
                  className={
                    isSelected
                      ? "bg-blue-100"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[2]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[3]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodoRendiciones;
