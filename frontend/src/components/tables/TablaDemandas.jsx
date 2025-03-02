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

  // 2. Valores base para cada fila (almacenados como números)
  const getDefaultDemandas = () => {
    return rowOrder.reduce((acc, row) => {
      acc[row.key] = {
        facturacion: 0,
        tasaFiscalizacion: 0,
        totalPercibido: 0,
        totalTransferido: 0,
        observaciones: "",
      };
      return acc;
    }, {});
  };

  // 3. Fusionar datos recibidos con valores por defecto
  // Se convierte cada campo a número si es necesario
  const mergeDemandas = (data) => {
    const defaults = getDefaultDemandas();
    if (!data) return defaults;
    Object.keys(data).forEach((key) => {
      if (defaults[key]) {
        defaults[key] = {
          facturacion: parseFloat(data[key].facturacion) || defaults[key].facturacion,
          tasaFiscalizacion: parseFloat(data[key].tasaFiscalizacion) || defaults[key].tasaFiscalizacion,
          totalPercibido: parseFloat(data[key].totalPercibido) || defaults[key].totalPercibido,
          totalTransferido: parseFloat(data[key].totalTransferido) || defaults[key].totalTransferido,
          observaciones: data[key].observaciones || "",
        };
      } else {
        defaults[key] = data[key];
      }
    });
    return defaults;
  };

  const mergedDemandas = useMemo(() => mergeDemandas(demandas), [demandas, rowOrder]);

  // 4. Calcular totales usando directamente los valores numéricos
  const totals = useMemo(() => {
    const newTotals = {
      facturacion: 0,
      tasaFiscalizacion: 0,
      totalPercibido: 0,
      totalTransferido: 0,
    };

    rowOrder.forEach((row) => {
      const data = mergedDemandas[row.key] || {};
      newTotals.facturacion += data.facturacion || 0;
      newTotals.tasaFiscalizacion += data.tasaFiscalizacion || 0;
      newTotals.totalPercibido += data.totalPercibido || 0;
      newTotals.totalTransferido += data.totalTransferido || 0;
    });

    return {
      demandas: "Total",
      facturacion: newTotals.facturacion,
      tasaFiscalizacion: newTotals.tasaFiscalizacion,
      totalPercibido: newTotals.totalPercibido,
      totalTransferido: newTotals.totalTransferido,
      observaciones: "",
    };
  }, [mergedDemandas, rowOrder]);

  // 5. Actualizar celdas usando números y recalcular la tasa cuando cambie facturación
  const handleCellChange = (rowKey, field, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => {
      const prevRow = prev[rowKey] || { ...getDefaultDemandas()[rowKey] };
      const updatedRow = {
        ...prevRow,
        [field]: newValue,
      };
      if (field === "facturacion") {
        updatedRow.tasaFiscalizacion = parseFloat((newValue * 0.01).toFixed(2));
      }
      return {
        ...prev,
        [rowKey]: updatedRow,
      };
    });
  };

  // 6. Renderizado de celdas numéricas: se pasa el valor numérico directamente
  const renderNumericCell = (rowKey, field, value) => (
    <NumericInput
      value={value}
      disabled={disabled}
      onChange={(e) => {
        // Extraemos el valor numérico del evento
        const newVal = e.target ? e.target.value : e;
        handleCellChange(rowKey, field, newVal);
      }}
    />
  );

  const handleChange =
    (categoria, fieldName) =>
    ({ target: { value } }) => {
      setDemandas((prev) => ({
        ...prev,
        [categoria]: {
          ...prev[categoria],
          [fieldName]: value, // Para observaciones se mantiene como cadena
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
                  <span className="font-medium">{data.tasaFiscalizacion.toFixed(2)}</span>
                </td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalPercibido", data.totalPercibido)}</td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalTransferido", data.totalTransferido)}</td>
                <td className="px-4 py-2">
                  <TextInput
                    name="observaciones"
                    value={data.observaciones}
                    onChange={handleChange(row.key, "observaciones")}
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
