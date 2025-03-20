import { useMemo } from "react";
import NumericInputTable from "../ui/NumericInputTable";
import TextInputTable from "../ui/TextInputTable";
import { formatPesos } from "../../utils/formatPesos";
import { getNombreMes, getNombreMesAnterior } from "../../utils/dateUtils";

const TablaDemandas = ({ demandas, setDemandas, disabled = false, selectedMonth }) => {
  // Filas fijas
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

  // Valores por defecto para cada fila
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

  // Fusionar datos recibidos con valores por defecto
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

  // Calcular totales de cada columna
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

  // Actualizar el valor de una celda
  const handleCellChange = (rowKey, field, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => {
      const prevRow = prev[rowKey] || { ...getDefaultDemandas()[rowKey] };
      const updatedRow = {
        ...prevRow,
        [field]: newValue,
      };
      // Actualizar la tasaFiscalizacion cuando se modifica la facturación
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

  // Actualizar observaciones
  const handleObservacionesChange = (rowKey, newValue) => {
    if (disabled || !setDemandas) return;
    setDemandas((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        observaciones: newValue,
      },
    }));
  };

  // Navegación entre inputs con Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = document.querySelectorAll(".tabla-demandas-input");
      const index = Array.prototype.indexOf.call(inputs, e.target);
      if (index > -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  };

  // Renderizar celda numérica usando NumericInputTable
  const renderNumericCell = (rowKey, field, value) => (
    <NumericInputTable
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

  // Nombres de meses para encabezados
  const facturacionMonthName = selectedMonth ? getNombreMesAnterior(selectedMonth) : "";
  const totalPercibidoMonthName = selectedMonth ? getNombreMes(selectedMonth) : "";

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tabla de Demandas</h2>
      <table className="w-full border-collapse">
        {/* Caption oculto para accesibilidad */}
        <caption className="sr-only">Tabla de Demandas</caption>
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Demandas
            </th>
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Facturación <span>{facturacionMonthName}</span>
            </th>
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Total de Tasa de Fiscalización y Control
            </th>
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Total Percibido <span>{totalPercibidoMonthName}</span>
            </th>
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Total Transferido
            </th>
            <th scope="col" className="px-4 py-2 text-left font-semibold text-gray-700">
              Observaciones
            </th>
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
                  <TextInputTable
                    name="observaciones"
                    disabled={disabled}
                    className="tabla-demandas-input"
                    value={data.observaciones}
                    onChange={(e) => handleObservacionesChange(row.key, e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td scope="row" className="px-4 py-2 font-semibold" title="Total">
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
        </tfoot>
      </table>
    </div>
  );
};

export default TablaDemandas;
