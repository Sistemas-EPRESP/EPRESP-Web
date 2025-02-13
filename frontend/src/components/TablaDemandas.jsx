const TablaDemandas = ({ demandas, handleDemandaChange }) => {
  const calcularTotal = (campo) => {
    return Object.values(demandas).reduce(
      (acc, curr) => acc + Number(curr[campo] || 0),
      0
    );
  };

  const calcularTasaFiscalizacion = (facturacion) => {
    return facturacion * 0.01;
  };

  // Función para redondear el valor a 2 decimales al perder el foco
  const handleBlur = (categoria, campo, e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const rounded = Number(value.toFixed(2));
      handleDemandaChange(categoria, campo, rounded);
    }
  };

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Demandas
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Facturación
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Tasa de Fiscalización y Control
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Percibido
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total Transferido
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Observaciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.keys(demandas).map((categoria) => (
            <tr key={categoria}>
              <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {categoria
                  .replace("_", " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={demandas[categoria].facturacion}
                    onChange={(e) =>
                      handleDemandaChange(
                        categoria,
                        "facturacion",
                        e.target.value
                      )
                    }
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handleBlur(categoria, "facturacion", e)}
                    className="block w-full pl-8 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                ${" "}
                {calcularTasaFiscalizacion(
                  demandas[categoria].facturacion
                ).toFixed(2)}
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={demandas[categoria].percibido}
                    onChange={(e) =>
                      handleDemandaChange(
                        categoria,
                        "percibido",
                        e.target.value
                      )
                    }
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handleBlur(categoria, "percibido", e)}
                    className="block w-full pl-8 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </td>
              <td className="px-6 py-2 whitespace-nowrap">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={demandas[categoria].transferido}
                    onChange={(e) =>
                      handleDemandaChange(
                        categoria,
                        "transferido",
                        e.target.value
                      )
                    }
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handleBlur(categoria, "transferido", e)}
                    className="block w-full pl-8 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </td>
              <td className="px-6 py-2">
                <input
                  type="text"
                  value={demandas[categoria].observaciones}
                  onChange={(e) =>
                    handleDemandaChange(
                      categoria,
                      "observaciones",
                      e.target.value
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-medium">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              $ {calcularTotal("facturacion").toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${" "}
              {Object.values(demandas)
                .reduce(
                  (acc, curr) =>
                    acc + calcularTasaFiscalizacion(curr.facturacion),
                  0
                )
                .toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              $ {calcularTotal("percibido").toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              $ {calcularTotal("transferido").toFixed(2)}
            </td>
            <td className="px-6 py-4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaDemandas;
