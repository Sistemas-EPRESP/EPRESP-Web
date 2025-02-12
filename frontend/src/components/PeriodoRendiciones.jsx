const PeriodoRendiciones = () => {
    return (
      <>
      <div>
        {/** Aclaraciones, lista ordenadas */}
        <h3>Aclaraciones</h3>
        <ol type="a">
          <li>El "Periodo de Rendicion" se corresponde con el mes de percepción de la factura, de acuerdo con el articulo 7° del Anexo de la Res.N°38/2024 - EPRESP.</li>
          <li>La "Facturación" considerada como base e imponible es la correspondiente al mes anterior al "Periodo de Rendición".</li>
          <li>El importe en columna "Total Transferido" puede ser mayor que el de la columna "Total Percibido" debido a cobros de deudores morosos.</li>
        </ol>
      </div>
      <table>
        <thead>
        <tr>
            <th>Período de Rendición</th>
            <th>Período de Facturación</th>
            <th>Período de Percepción de Facturación</th>
            <th>Período de Rendición y Pago</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>Enero</td>
            <td>1 a 31 de Diciembre</td>
            <td>1 a 31 de Enero</td>
            <td>1 a 10 de Febrero</td>
          </tr>
          <tr>
            <td>Febrero</td>
            <td>1 a 31 de Enero</td>
            <td>1 a 28 de Febrero</td>
            <td>1 a 10 de Marzo</td>
          </tr>
          <tr>
            <td>Marzo</td>
            <td>1 a 28 de Febrero</td>
            <td>1 a 31 de Marzo</td>
            <td>1 a 10 de Abril</td>
          </tr>
          <tr>
            <td>Abril</td>
            <td>1 a 31 de Marzo</td>
            <td>1 a 30 de Abril</td>
            <td>1 a 10 de Mayo</td>
          </tr>
          <tr>
            <td>Mayo</td>
            <td>1 a 30 de Abril</td>
            <td>1 a 31 de Mayo</td>
            <td>1 a 10 de Junio</td>
          </tr>
          <tr>
            <td>Junio</td>
            <td>1 a 31 de Mayo</td>
            <td>1 a 30 de Junio</td>
            <td>1 a 10 de Julio</td>
          </tr>
          <tr>
            <td>Julio</td>
            <td>1 a 30 de Junio</td>
            <td>1 a 31 de Julio</td>
            <td>1 a 10 de Agosto</td>
          </tr>
          <tr>
            <td>Agosto</td>
            <td>1 a 31 de Julio</td>
            <td>1 a 31 de Agosto</td>
            <td>1 a 10 de Septiembre</td>
          </tr>
          <tr>
            <td>Septiembre</td>
            <td>1 a 31 de Agosto</td>
            <td>1 a 30 de Septiembre</td>
            <td>1 a 10 de Octubre</td>
          </tr>
          <tr>
            <td>Octubre</td>
            <td>1 a 30 de Septiembre</td>
            <td>1 a 31 de Octubre</td>
            <td>1 a 10 de Noviembre</td>
          </tr>
          <tr>
            <td>Noviembre</td>
            <td>1 a 31 de Octubre</td>
            <td>1 a 30 de Noviembre</td>
            <td>1 a 10 de Diciembre</td>
          </tr>
          <tr>
            <td>Diciembre</td>
            <td>1 a 30 de Noviembre</td>
            <td>1 a 31 de Diciembre</td>
            <td>1 a 10 de Enero</td>
          </tr>
        </tbody>
      </table>
      </>
    );
}

export default PeriodoRendiciones;