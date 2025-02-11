import React, { useState } from 'react';

const TablaDemandas = () => {
  const [valores, setValores] = useState({
    residencial: { facturacion: 0, percibido: 0, transferido: 0 },
    comercial: { facturacion: 0, percibido: 0, transferido: 0 },
    industrial: { facturacion: 0, percibido: 0, transferido: 0 },
    grandesUsuarios: { facturacion: 0, percibido: 0, transferido: 0 },
    contratos: { facturacion: 0, percibido: 0, transferido: 0 },
    otros: { facturacion: 0, percibido: 0, transferido: 0 },
  });

  const handleChange = (categoria, campo, valor) => {
    setValores((prevValores) => ({
      ...prevValores,
      [categoria]: {
        ...prevValores[categoria],
        [campo]: Number(valor),
      },
    }));
  };

  const calcularTotal = (campo) => {
    return Object.values(valores).reduce((acc, curr) => acc + curr[campo], 0);
  };

  const calcularTasaFiscalizacion = (facturacion) => {
    return facturacion * 0.01;
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
        {Object.keys(valores).map((categoria) => (
          <tr key={categoria}>
            <td>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</td>
            <td>
              $ <input
                type="number"
                min={0}
                value={valores[categoria].facturacion}
                onChange={(e) => handleChange(categoria, 'facturacion', e.target.value)}
                required
              />
            </td>
            <td>
              $ {calcularTasaFiscalizacion(valores[categoria].facturacion).toFixed(2)}
            </td>
            <td>
              $ <input
                type="number"
                min={0}
                value={valores[categoria].percibido}
                onChange={(e) => handleChange(categoria, 'percibido', e.target.value)}
                required
              />
            </td>
            <td>
              $ <input
                type="number"
                min={0}
                value={valores[categoria].transferido}
                onChange={(e) => handleChange(categoria, 'transferido', e.target.value)}
                required
              />
            </td>
            <td><input type="text" /></td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td>$ {calcularTotal('facturacion').toFixed(2)}</td>
          <td>$ {calcularTotal('facturacion').toFixed(2)}</td>
          <td>$ {calcularTotal('percibido').toFixed(2)}</td>
          <td>$ {calcularTotal('transferido').toFixed(2)}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default TablaDemandas;
