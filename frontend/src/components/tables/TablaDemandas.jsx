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

  // 2. Valores base para cada fila (se almacenan como cadenas para evitar formateo automático)
  const getDefaultDemandas = () => {
    return rowOrder.reduce((acc, row) => {
      acc[row.key] = {
        facturacion: "",
        tasaFiscalizacion: "",
        totalPercibido: "",
        totalTransferido: "",
        observaciones: "",
      };
      return acc;
    }, {});
  };

  // 3. Fusionar datos recibidos con valores por defecto, convirtiendo los valores numéricos a cadena
  const mergeDemandas = (data) => {
    const defaults = getDefaultDemandas();
    if (!data) return defaults;
    Object.keys(data).forEach((key) => {
      if (defaults[key]) {
        defaults[key] = {
          facturacion: data[key].facturacion?.toString() || "",
          tasaFiscalizacion: data[key].tasaFiscalizacion?.toString() || "",
          totalPercibido: data[key].totalPercibido?.toString() || "",
          totalTransferido: data[key].totalTransferido?.toString() || "",
          observaciones: data[key].observaciones || "",
        };
      } else {
        defaults[key] = data[key];
      }
    });
    return defaults;
  };

  const mergedDemandas = useMemo(() => mergeDemandas(demandas), [demandas, rowOrder]);

  // 4. Calcular totales convirtiendo las cadenas a números
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
      facturacion: newTotals.facturacion,
      tasaFiscalizacion: newTotals.tasaFiscalizacion,
      totalPercibido: newTotals.totalPercibido,
      totalTransferido: newTotals.totalTransferido,
      observaciones: "",
    };
  }, [mergedDemandas, rowOrder]);

  // 5. Función para manejar el cambio de valor en cada celda
  const handleCellChange = (rowKey, field, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => {
      const prevRow = prev[rowKey] || { ...getDefaultDemandas()[rowKey] };
      const updatedRow = {
        ...prevRow,
        [field]: newValue,
      };
      if (field === "facturacion") {
        const parsed = parseFloat(newValue);
        updatedRow.tasaFiscalizacion = !isNaN(parsed) ? (parsed * 0.01).toFixed(2) : "";
      }
      return {
        ...prev,
        [rowKey]: updatedRow,
      };
    });
  };

  // 6. Función para manejar el evento onKeyDown en cada input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Selecciona todos los inputs de la tabla usando una clase común
      const inputs = document.querySelectorAll(".tabla-demandas-input");
      const index = Array.prototype.indexOf.call(inputs, e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  // 7. Renderizado de celdas numéricas: se pasa el valor sin formatear (cadena) para evitar el auto-formateo
  const renderNumericCell = (rowKey, field, value) => (
    <NumericInput
      className="tabla-demandas-input"
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const newVal = e.target ? e.target.value : e;
        handleCellChange(rowKey, field, newVal);
      }}
      onKeyDown={handleKeyDown}
    />
  );

  const handleChange =
    (categoria, fieldName) =>
    ({ target: { value } }) => {
      setDemandas((prev) => ({
        ...prev,
        [categoria]: {
          ...prev[categoria],
          [fieldName]: value,
        },
      }));
    };

  // 8. Nombres de meses para encabezados
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
                  <span className="font-medium">
                    {data.tasaFiscalizacion !== "" ? parseFloat(data.tasaFiscalizacion).toFixed(2) : ""}
                  </span>
                </td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalPercibido", data.totalPercibido)}</td>
                <td className="px-4 py-2">{renderNumericCell(row.key, "totalTransferido", data.totalTransferido)}</td>
                <td className="px-4 py-2">
                  <TextInput
                    name="observaciones"
                    disabled={disabled}
                    className="tabla-demandas-input"
                    value={data.observaciones}
                    onChange={handleChange(row.key, "observaciones")}
                    onKeyDown={handleKeyDown}
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
