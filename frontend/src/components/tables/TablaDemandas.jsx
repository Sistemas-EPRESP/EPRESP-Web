import { useMemo, useRef } from "react";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { formatPesos } from "../../utils/formatPesos";

const TablaDemandas = ({
  demandas,
  setDemandas,
  disabled = false,
  previousMonthName,
}) => {
  // 1. Definir el orden y etiquetas fijas de las filas
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

  // 2. Función para obtener los valores base para cada fila
  const getDefaultDemandas = () => {
    return rowOrder.reduce((acc, row) => {
      acc[row.key] = {
        facturacion: "0.00",
        tasaFiscalizacion: "0.00",
        totalPercibido: "0.00",
        totalTransferido: "0.00",
        observaciones: "",
      };
      return acc;
    }, {});
  };

  // 3. Combinar la data recibida con los valores por defecto
  const mergeDemandas = (data) => {
    const defaults = getDefaultDemandas();
    if (!data) return defaults;
    Object.keys(data).forEach((key) => {
      if (defaults[key]) {
        defaults[key] = {
          ...defaults[key],
          ...data[key],
        };
      } else {
        defaults[key] = data[key];
      }
    });
    return defaults;
  };

  // 4. Calcular las demandas fusionadas (si el estado del padre cambia, se recalcula)
  const mergedDemandas = useMemo(
    () => mergeDemandas(demandas),
    [demandas, rowOrder]
  );

  // 5. Calcular los totales basados en las demandas fusionadas
  const totals = useMemo(() => {
    const newTotals = {
      facturacion: 0,
      tasaFiscalizacion: 0,
      totalPercibido: 0,
      totalTransferido: 0,
    };

    rowOrder.forEach((row) => {
      const data = mergedDemandas[row.key] || {};
      newTotals.facturacion += parseFloat(data.facturacion || "0");
      newTotals.tasaFiscalizacion += parseFloat(data.tasaFiscalizacion || "0");
      newTotals.totalPercibido += parseFloat(data.totalPercibido || "0");
      newTotals.totalTransferido += parseFloat(data.totalTransferido || "0");
    });

    return {
      demandas: "Total",
      facturacion: newTotals.facturacion.toFixed(2),
      tasaFiscalizacion: newTotals.tasaFiscalizacion.toFixed(2),
      totalPercibido: newTotals.totalPercibido.toFixed(2),
      totalTransferido: newTotals.totalTransferido.toFixed(2),
      observaciones: "",
    };
  }, [mergedDemandas, rowOrder]);

  // 6. Función para actualizar el valor de una celda vía setDemandas
  const handleCellChange = (rowKey, field, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => ({
      ...prev,
      [rowKey]: {
        ...getDefaultDemandas()[rowKey],
        ...prev[rowKey],
        [field]: newValue,
      },
    }));
  };

  // 7. Configuración de refs para celdas focusables
  const totalRows = rowOrder.length;
  const totalCols = 4;
  const inputRefs = useRef(
    Array.from({ length: totalRows }, () => Array(totalCols).fill(null))
  );

  // 8. Función auxiliar para calcular la tasa de fiscalización
  const calculateTasaFiscalizacion = (rowIndex) => {
    const rowKey = rowOrder[rowIndex].key;
    const factValue = parseFloat(mergedDemandas[rowKey]?.facturacion || "0");
    return (factValue * 0.01).toFixed(2);
  };

  // 9. Función auxiliar para determinar la siguiente celda a enfocar
  const getNextCell = (rowIndex, colIndex) => {
    let nextRow = rowIndex;
    let nextCol = colIndex;
    if (rowIndex < totalRows - 1) {
      nextRow = rowIndex + 1;
    } else if (colIndex < totalCols - 1) {
      nextRow = 0;
      nextCol = colIndex + 1;
    }
    return { nextRow, nextCol };
  };

  // 10. Manejo del evento Enter: se calcula la tasa si es la celda de "Facturación" y se mueve el foco
  const handleEnter = (rowIndex, colIndex) => {
    if (colIndex === 0) {
      const rowKey = rowOrder[rowIndex].key;
      const newTasaFiscalizacion = calculateTasaFiscalizacion(rowIndex);
      if (!disabled && setDemandas) {
        setDemandas((prev) => ({
          ...prev,
          [rowKey]: {
            ...prev[rowKey],
            tasaFiscalizacion: newTasaFiscalizacion,
          },
        }));
      }
    }
    const { nextRow, nextCol } = getNextCell(rowIndex, colIndex);
    inputRefs.current[nextRow][nextCol]?.focus();
  };

  // 11. Función para renderizar celdas numéricas (focusables)
  const renderNumericCell = (rowKey, field, value, rowIndex, colIndex) => (
    <NumericInput
      ref={(el) => {
        inputRefs.current[rowIndex][colIndex] = el;
      }}
      value={value}
      disabled={disabled}
      onChange={(newValue) => handleCellChange(rowKey, field, newValue)}
      onEnter={() => handleEnter(rowIndex, colIndex)}
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Demandas
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Facturación <span className="">{previousMonthName}</span>
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
          {rowOrder.map((row, rowIndex) => {
            const data =
              mergedDemandas[row.key] || getDefaultDemandas()[row.key];
            return (
              <tr key={row.key} className="border-b border-gray-100">
                <td className="px-4 py-2 font-medium" title={row.label}>
                  {row.label}
                </td>
                <td className="px-4 py-2">
                  {renderNumericCell(
                    row.key,
                    "facturacion",
                    data.facturacion,
                    rowIndex,
                    0
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className="font-medium">{data.tasaFiscalizacion}</span>
                </td>
                <td className="px-4 py-2">
                  {renderNumericCell(
                    row.key,
                    "totalPercibido",
                    data.totalPercibido,
                    rowIndex,
                    1
                  )}
                </td>
                <td className="px-4 py-2">
                  {renderNumericCell(
                    row.key,
                    "totalTransferido",
                    data.totalTransferido,
                    rowIndex,
                    2
                  )}
                </td>
                <td className="px-4 py-2">
                  <TextInput
                    ref={(el) => {
                      inputRefs.current[rowIndex][3] = el;
                    }}
                    value={data.observaciones}
                    onChange={(newValue) =>
                      handleCellChange(row.key, "observaciones", newValue)
                    }
                    onEnter={() => handleEnter(rowIndex, 3)}
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
              <span className="font-semibold">
                $ {formatPesos(totals.facturacion)}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">
                $ {formatPesos(totals.tasaFiscalizacion)}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">
                $ {formatPesos(totals.totalPercibido)}
              </span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">
                $ {formatPesos(totals.totalTransferido)}
              </span>
            </td>
            <td className="px-4 py-2">{totals.observaciones}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaDemandas;
