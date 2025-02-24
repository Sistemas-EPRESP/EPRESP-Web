import { useState, useEffect, useMemo } from "react";
import NumericInput from "./ui/NumericInput";
import TextInput from "./ui/TextInput";

export const TablaDemandas = ({
  demandas: initialDemandas,
  disabled = false,
}) => {
  // Estado de las demandas
  const [demandas, setDemandas] = useState(initialDemandas);

  // Datos para el orden y etiquetas fijas de las demandas
  const rowOrder = useMemo(
    () => [
      { key: "residencial", label: "Residencial" },
      { key: "comercial", label: "Comercial" },
      { key: "industrial", label: "Industrial" },
      { key: "grandesUsuarios", label: "Grandes Usuarios" },
      { key: "contratos", label: "Contratos" },
      { key: "otros", label: "Otros" },
    ],
    []
  );

  // Total inicial
  const initialTotals = {
    facturacion: "0.00",
    tasaFiscalizacion: "0.00",
    totalPercibido: "0.00",
    totalTransferido: "0.00",
  };

  const [totals, setTotals] = useState({
    demandas: "Total",
    ...initialTotals,
    observaciones: "",
  });

  // Se calcula el total a partir de las demandas recibidas por prop
  useEffect(() => {
    const newTotals = {
      facturacion: 0,
      tasaFiscalizacion: 0,
      totalPercibido: 0,
      totalTransferido: 0,
    };

    rowOrder.forEach((row) => {
      const data = demandas[row.key] || {};
      newTotals.facturacion += parseFloat(data.facturacion || "0");
      newTotals.tasaFiscalizacion += parseFloat(data.tasaFiscalizacion || "0");
      newTotals.totalPercibido += parseFloat(data.totalPercibido || "0");
      newTotals.totalTransferido += parseFloat(data.totalTransferido || "0");
    });

    setTotals({
      demandas: "Total",
      facturacion: newTotals.facturacion.toFixed(2),
      tasaFiscalizacion: newTotals.tasaFiscalizacion.toFixed(2),
      totalPercibido: newTotals.totalPercibido.toFixed(2),
      totalTransferido: newTotals.totalTransferido.toFixed(2),
      observaciones: "",
    });
  }, [demandas, rowOrder]);

  // Función para manejar el cambio en los valores de la celda
  const handleCellChange = (rowKey, field, newValue) => {
    setDemandas((prevDemandas) => ({
      ...prevDemandas,
      [rowKey]: {
        ...prevDemandas[rowKey],
        [field]: newValue,
      },
    }));
  };

  const renderCell = (
    rowKey,
    field,
    value,
    rowIndex,
    colIndex,
    isTotal = false
  ) => {
    if (isTotal) {
      return <td className="px-4 py-2 font-semibold">{value}</td>;
    }

    return (
      <td className="px-4 py-2">
        <NumericInput
          value={value}
          disabled={isTotal || disabled}
          onChange={(newValue) => handleCellChange(rowKey, field, newValue)}
        />
      </td>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Demandas
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Facturación
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Total de Tasa de Fiscalización y Control
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Total Percibido
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Total Transferido
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Observaciones
            </th>
          </tr>
        </thead>
        <tbody>
          {rowOrder.map((row) => {
            const data = demandas[row.key] || {
              facturacion: "0.00",
              tasaFiscalizacion: "0.00",
              totalPercibido: "0.00",
              totalTransferido: "0.00",
              observaciones: "",
            };
            return (
              <tr key={row.key} className="border-b border-gray-100">
                <td className="px-4 py-2 font-medium" title={row.label}>
                  {row.label}
                </td>
                <td className="px-4 py-2">
                  {renderCell(
                    row.key,
                    "facturacion",
                    data.facturacion,
                    row.key,
                    "facturacion",
                    false
                  )}
                </td>
                <td className="px-4 py-2">
                  {renderCell(
                    row.key,
                    "tasaFiscalizacion",
                    data.tasaFiscalizacion,
                    row.key,
                    "tasaFiscalizacion",
                    false
                  )}
                </td>
                <td className="px-4 py-2">
                  {renderCell(
                    row.key,
                    "totalPercibido",
                    data.totalPercibido,
                    row.key,
                    "totalPercibido",
                    false
                  )}
                </td>
                <td className="px-4 py-2">
                  {renderCell(
                    row.key,
                    "totalTransferido",
                    data.totalTransferido,
                    row.key,
                    "totalTransferido",
                    false
                  )}
                </td>
                <td className="px-4 py-2">
                  <TextInput
                    value={data.observaciones}
                    onChange={(newValue) =>
                      handleCellChange(row.key, "observaciones", newValue)
                    }
                    disabled={disabled}
                  />
                </td>
              </tr>
            );
          })}
          <tr className="bg-gray-50">
            <td className="px-4 py-2 font-semibold" title="Total">
              Total
            </td>
            <td className="px-4 py-2">
              {renderCell(
                "Total",
                "facturacion",
                totals.facturacion,
                null,
                null,
                true
              )}
            </td>
            <td className="px-4 py-2">
              {renderCell(
                "Total",
                "tasaFiscalizacion",
                totals.tasaFiscalizacion,
                null,
                null,
                true
              )}
            </td>
            <td className="px-4 py-2">
              {renderCell(
                "Total",
                "totalPercibido",
                totals.totalPercibido,
                null,
                null,
                true
              )}
            </td>
            <td className="px-4 py-2">
              {renderCell(
                "Total",
                "totalTransferido",
                totals.totalTransferido,
                null,
                null,
                true
              )}
            </td>
            <td className="px-4 py-2">{totals.observaciones}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaDemandas;
