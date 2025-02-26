import { useState, useEffect, useMemo, useRef } from "react";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";

export const TablaDemandas = ({
  demandas: initialDemandas,
  disabled = false,
}) => {
  // Estado de las demandas
  const [demandas, setDemandas] = useState(initialDemandas);

  // Actualiza el estado cuando initialDemandas cambie
  useEffect(() => {
    setDemandas(initialDemandas);
  }, [initialDemandas]);

  // Orden y etiquetas fijas de las demandas
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

  // Totales iniciales
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

  // Se recalculan totales cuando cambia el estado de demandas
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

  // Actualiza el valor de una celda en el estado
  const handleCellChange = (rowKey, field, newValue) => {
    setDemandas((prevDemandas) => ({
      ...prevDemandas,
      [rowKey]: {
        ...prevDemandas[rowKey],
        [field]: newValue,
      },
    }));
  };

  // Configuración de la grilla de referencias para celdas focusables:
  // Se omite la columna de tasaFiscalizacion (no editable).
  // Las columnas focusables son:
  //   0: Facturación, 1: Total Percibido, 2: Total Transferido, 3: Observaciones
  const totalRows = rowOrder.length;
  const totalCols = 4;
  const inputRefs = useRef(
    Array.from({ length: totalRows }, () => Array(totalCols).fill(null))
  );

  // Función auxiliar para calcular la tasa de fiscalización
  const calculateTasaFiscalizacion = (rowIndex) => {
    const rowKey = rowOrder[rowIndex].key;
    const factValue = parseFloat(demandas[rowKey]?.facturacion || "0");
    return (factValue * 0.01).toFixed(2);
  };

  // Función auxiliar para determinar la siguiente celda a enfocar
  const getNextCell = (rowIndex, colIndex) => {
    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (rowIndex < totalRows - 1) {
      // Si no es la última fila, se mueve a la siguiente fila en la misma columna
      nextRow = rowIndex + 1;
    } else if (colIndex < totalCols - 1) {
      // Si es la última fila pero no la última columna, se mueve a la primera fila de la siguiente columna
      nextRow = 0;
      nextCol = colIndex + 1;
    }
    // Si es la última celda, se mantiene el foco en la misma celda
    return { nextRow, nextCol };
  };

  // Función para manejar el evento Enter: calcula la tasa en "Facturación" y navega a la siguiente celda
  const handleEnter = (rowIndex, colIndex) => {
    // Si se presionó Enter en la celda "Facturación" (columna 0), calcular la tasa
    if (colIndex === 0) {
      const rowKey = rowOrder[rowIndex].key;
      const newTasaFiscalizacion = calculateTasaFiscalizacion(rowIndex);
      setDemandas((prevDemandas) => ({
        ...prevDemandas,
        [rowKey]: {
          ...prevDemandas[rowKey],
          tasaFiscalizacion: newTasaFiscalizacion,
        },
      }));
    }

    // Determinar la siguiente celda a la que se debe mover el foco
    const { nextRow, nextCol } = getNextCell(rowIndex, colIndex);
    inputRefs.current[nextRow][nextCol]?.focus();
  };

  // Renderiza celdas numéricas (focusables)
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
          {rowOrder.map((row, rowIndex) => {
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
                  {renderNumericCell(
                    row.key,
                    "facturacion",
                    data.facturacion,
                    rowIndex,
                    0
                  )}
                </td>
                <td className="px-4 py-2">
                  {/* Celda no editable y sin foco */}
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
              <span className="font-semibold">{totals.facturacion}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">{totals.tasaFiscalizacion}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">{totals.totalPercibido}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">{totals.totalTransferido}</span>
            </td>
            <td className="px-4 py-2">{totals.observaciones}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaDemandas;
