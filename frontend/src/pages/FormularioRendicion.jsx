import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import PeriodoRendiciones from "../components/PeriodoRendiciones";
import TablaDemandas from "../components/TablaDemandas";

const FormularioRendicion = () => {
  const { cooperativa } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suponiendo que la información de la cooperativa se obtiene asíncronamente
    if (cooperativa !== null) {
      setLoading(false);
    }
  }, [cooperativa]);

  if (loading) {
    return <p>Cargando información...</p>;
  }

  if (!cooperativa) {
    return (
      <p>No se encontró la cooperativa asociada o no se ha iniciado sesión.</p>
    );
  }

  // Genera un array de años desde 2000 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, index) => 2000 + index
  );

  // Estado para el año seleccionado (por defecto el año actual)
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  // Estado para mostrar un mensaje de envío exitoso
  const [mensaje, setMensaje] = useState("");

  // Estado para los datos de demandas; se usa el mismo nombre de clave que en el ejemplo (grandes_usuarios)
  const [demandas, setDemandas] = useState({
    residencial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    comercial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    industrial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    grandes_usuarios: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    contratos: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    otros: { facturacion: 0, percibido: 0, transferido: 0, observaciones: "" },
  });

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Función para actualizar los datos de demandas
  const handleDemandaChange = (categoria, campo, valor) => {
    setDemandas((prev) => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        // Si el campo es observaciones, se guarda el texto; en otro caso se transforma a número
        [campo]: campo === "observaciones" ? valor : Number(valor),
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Obtener la fecha actual en formato YYYY-MM-DD
    const fechaActual = new Date().toISOString().split("T")[0];
    // Utilizar FormData para obtener los datos de los inputs controlados por el formulario
    const data = new FormData(event.target);

    // Construir el objeto de demandas, calculando la tasa de fiscalización (1% de la facturación)
    const demandasPayload = {};
    Object.keys(demandas).forEach((categoria) => {
      demandasPayload[categoria] = {
        facturacion: demandas[categoria].facturacion,
        total_tasa_fiscalizacion:
          Number(demandas[categoria].facturacion) * 0.01,
        total_percibido: demandas[categoria].percibido,
        total_transferido: demandas[categoria].transferido,
        observaciones: demandas[categoria].observaciones || "Ninguna",
      };
    });

    // Construir el objeto de rendición a enviar, incluyendo los datos de demandas
    const rendicion = {
      fecha_rendicion: fechaActual,
      fecha_transferencia: data.get("fecha_transferencia"),
      cooperativa: parseInt(cooperativa.id, 10),
      periodo_mes: parseInt(data.get("periodo_rendicion"), 10),
      periodo_anio: parseInt(selectedYear, 10),
      tasa_fiscalizacion_letras: data.get("total_tasa_letras"),
      tasa_fiscalizacion_numero: parseFloat(data.get("total_tasa")),
      total_transferencia_letras: data.get("total_transferencia_letras"),
      total_transferencia_numero: parseFloat(data.get("total_transferencia")),
      demandas: demandasPayload,
    };

    console.log("Datos del formulario:", rendicion);
    // Opcional: restablecer el formulario
    event.target.reset();
    setMensaje("Formulario enviado correctamente.");
  };

  return (
    <div>
      <h2>Formulario de rendición de la Tasa de Fiscalización y Control</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fecha_transferencia">Fecha de Transferencia: </label>
        <input
          type="date"
          id="fecha_transferencia"
          name="fecha_transferencia"
          required
        />
        <br />

        <label htmlFor="distribuidor">Distribuidor: {cooperativa.nombre}</label>
        <br />
        <label htmlFor="cuit">CUIT: {cooperativa.cuit}</label>
        <br />

        <label htmlFor="periodo_rendicion">
          Período de Rendición de la Tasa de Fiscalización y Control (1):
        </label>
        <select id="periodo_rendicion" name="periodo_rendicion" required>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
        <br />

        <label htmlFor="anio">Año: </label>
        <select
          id="anio"
          name="anio"
          value={selectedYear}
          onChange={handleYearChange}
          required
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="total_tasa_letras">
          Total Tasa de Fiscalización y Control: Pesos (en letras):
        </label>
        <input
          type="text"
          id="total_tasa_letras"
          name="total_tasa_letras"
          placeholder="Mil doscientos treinta y cuatro"
          required
        />
        <br />
        <label htmlFor="total_tasa">Total Tasa ($):</label>
        <input
          type="number"
          id="total_tasa"
          name="total_tasa"
          min={0}
          step={0.01}
          required
        />
        <br />

        <label htmlFor="total_transferencia_letras">
          Total Transferencia: Pesos (en letras):
        </label>
        <input
          type="text"
          id="total_transferencia_letras"
          name="total_transferencia_letras"
          placeholder="Mil doscientos treinta y cuatro"
          required
        />
        <br />
        <label htmlFor="total_transferencia">Total Transferencia ($):</label>
        <input
          type="number"
          id="total_transferencia"
          name="total_transferencia"
          value={0}
          min={0}
          step={0.01}
          required
        />
        <br />

        <TablaDemandas
          demandas={demandas}
          handleDemandaChange={handleDemandaChange}
        />

        <button type="submit">Enviar</button>
      </form>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      <small className="disclaimer">
        La información suministrada en este formulario tiene carácter de
        declaración jurada.
      </small>

      <PeriodoRendiciones />
    </div>
  );
};

export default FormularioRendicion;
