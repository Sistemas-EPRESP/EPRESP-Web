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
    <table>
      <thead>
        <tr>
          <th>Demandas</th>
          <th>Facturación</th>
          <th>Total Tasa de Fiscalización y Control (1% de Facturación)</th>
          <th>Total Percibido</th>
          <th>Total Transferido</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(demandas).map((categoria) => (
          <tr key={categoria}>
            <td>
              {categoria
                .replace('_', ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </td>
            <td>
              ${" "}
              <input
                type="number"
                min={0}
                step={0.01}
                value={demandas[categoria].facturacion}
                onChange={(e) =>
                  handleDemandaChange(categoria, "facturacion", e.target.value)
                }
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handleBlur(categoria, "facturacion", e)}
                required
              />
            </td>
            <td>
              $ {calcularTasaFiscalizacion(demandas[categoria].facturacion).toFixed(2)}
            </td>
            <td>
              ${" "}
              <input
                type="number"
                min={0}
                step={0.01}
                value={demandas[categoria].percibido}
                onChange={(e) =>
                  handleDemandaChange(categoria, "percibido", e.target.value)
                }
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handleBlur(categoria, "percibido", e)}
                required
              />
            </td>
            <td>
              ${" "}
              <input
                type="number"
                min={0}
                step={0.01}
                value={demandas[categoria].transferido}
                onChange={(e) =>
                  handleDemandaChange(categoria, "transferido", e.target.value)
                }
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handleBlur(categoria, "transferido", e)}
                required
              />
            </td>
            <td>
              <input
                type="text"
                value={demandas[categoria].observaciones}
                onChange={(e) =>
                  handleDemandaChange(categoria, "observaciones", e.target.value)
                }
              />
            </td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td>$ {calcularTotal("facturacion").toFixed(2)}</td>
          <td>
            ${" "}
            {Object.values(demandas)
              .reduce(
                (acc, curr) =>
                  acc + calcularTasaFiscalizacion(curr.facturacion),
                0
              )
              .toFixed(2)}
          </td>
          <td>$ {calcularTotal("percibido").toFixed(2)}</td>
          <td>$ {calcularTotal("transferido").toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablaDemandas;
