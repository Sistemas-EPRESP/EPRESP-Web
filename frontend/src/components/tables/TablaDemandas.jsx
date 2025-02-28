import { useMemo } from "react";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { formatPesos } from "../../utils/formatPesos";
import { getNombreMes, getNombreMesAnterior } from "../../utils/dateUtils";

const TablaDemandas = ({ demandas, setDemandas, disabled = false, selectedMonth }) => {
  // 1. Definir filas fijas
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

  // 2. Valores base para cada fila
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

  // 3. Fusionar datos recibidos con valores por defecto
  const mergeDemandas = (data) => {
    const defaults = getDefaultDemandas();
    if (!data) return defaults;
    Object.keys(data).forEach((key) => {
      if (defaults[key]) {
        defaults[key] = { ...defaults[key], ...data[key] };
      } else {
        defaults[key] = data[key];
      }
    });
    return defaults;
  };

  const mergedDemandas = useMemo(() => mergeDemandas(demandas), [demandas, rowOrder]);

  // 4. Calcular totales usando parseFloat
  const totals = useMemo(() => {
    const newTotals = {
      facturacion: 0,
      tasaFiscalizacion: 0,
      totalPercibido: 0,
      totalTransferido: 0,
    };

    rowOrder.forEach((row) => {
      const data = mergedDemandas[row.key] || {};
      newTotals.facturacion += parseFloat(data.facturacion) || 0;
      newTotals.tasaFiscalizacion += parseFloat(data.tasaFiscalizacion) || 0;
      newTotals.totalPercibido += parseFloat(data.totalPercibido) || 0;
      newTotals.totalTransferido += parseFloat(data.totalTransferido) || 0;
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

  // 5. Actualizar celdas (se mantiene el cálculo de tasa al modificar facturación)
  const handleCellChange = (rowKey, field, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => {
      const updatedRow = {
        ...getDefaultDemandas()[rowKey],
        ...prev[rowKey],
        [field]: newValue,
      };
      if (field === "facturacion") {
        updatedRow.tasaFiscalizacion = (parseFloat(newValue) * 0.01).toFixed(2);
      }
      return {
        ...prev,
        [rowKey]: updatedRow,
      };
    });
  };

  // 6. Renderizado de celdas numéricas (ya sin manejo de foco)
  const renderNumericCell = (rowKey, field, value) => (
    <NumericInput
      value={value}
      disabled={disabled}
      onChange={(newValue) => handleCellChange(rowKey, field, newValue)}
    />
  );

  const handleChange =
    (categoria, fieldName) =>
    ({ name, value }) => {
      setDemandas((prev) => ({
        ...prev,
        [categoria]: {
          ...prev[categoria],
          [fieldName]: value, // Ahora asignamos correctamente el valor
        },
      }));
    };

  // 7. Nombres de meses para encabezados
  const facturacionMonthName = selectedMonth ? getNombreMesAnterior(selectedMonth) : "";
  const totalPercibidoMonthName = selectedMonth ? getNombreMes(selectedMonth) : "";

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Demandas</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Demandas</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Facturación <span>{facturacionMonthName}</span>
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Total de Tasa de Fiscalización y Control
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Total Percibido <span>{totalPercibidoMonthName}</span>
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Total Transferido</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {rowOrder.map((row) => {
            const data = mergedDemandas[row.key] || getDefaultDemandas()[row.key];
            return (
              <tr key={row.key} className="border-b border-gray-100">
                <td className="px-4 py-2 font-medium" title={row.label}>
                  {row.label}
                </td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "facturacion", data.facturacion)}</td>
                <td className="px-4 py-2">
                  <span className="font-medium">{data.tasaFiscalizacion}</span>
                </td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalPercibido", data.totalPercibido)}</td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalTransferido", data.totalTransferido)}</td>
                <td className="px-4 py-2">
                  <TextInput
                    name="observaciones"
                    value={demandas.observaciones}
                    onChange={handleChange("observaciones")}
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
              <span className="font-semibold">$ {formatPesos(totals.facturacion)}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">$ {formatPesos(totals.tasaFiscalizacion)}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">$ {formatPesos(totals.totalPercibido)}</span>
            </td>
            <td className="px-4 py-2">
              <span className="font-semibold">$ {formatPesos(totals.totalTransferido)}</span>
            </td>
            <td className="px-4 py-2">{totals.observaciones}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaDemandas;
