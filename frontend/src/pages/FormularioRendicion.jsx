import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PeriodoRendiciones from "../components/PeriodoRendiciones";
import TablaDemandas from "../components/TablaDemandas";

const FormularioRendicion = () => {
  const { cooperativa } = useContext(AuthContext);

  // Todos los hooks se llaman siempre, sin condiciones.
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, index) => 2000 + index
  );

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [mensaje, setMensaje] = useState("");
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

  const handleDemandaChange = (categoria, campo, valor) => {
    setDemandas((prev) => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: campo === "observaciones" ? valor : Number(valor),
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Se obtiene la fecha actual para rendición
    const fechaActual = new Date().toISOString().split("T")[0];
    const data = new FormData(event.target);

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

    const rendicion = {
      fecha_rendicion: fechaActual,
      fecha_transferencia: data.get("fecha_transferencia"),
      cooperativa: cooperativa ? parseInt(cooperativa.id, 10) : null,
      periodo_mes: parseInt(data.get("periodo_rendicion"), 10),
      periodo_anio: parseInt(selectedYear, 10),
      tasa_fiscalizacion_letras: data.get("total_tasa_letras"),
      tasa_fiscalizacion_numero: parseFloat(data.get("total_tasa")),
      total_transferencia_letras: data.get("total_transferencia_letras"),
      total_transferencia_numero: parseFloat(data.get("total_transferencia")),
      demandas: demandasPayload,
    };

    console.log("Datos del formulario:", rendicion);
    event.target.reset();
    setMensaje("Formulario enviado correctamente.");
  };

  // Renderizamos condicionalmente según si se tiene cooperativa.
  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8">
      {!cooperativa ? (
        <p>
          No se encontró la cooperativa asociada o no se ha iniciado sesión.
        </p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-2 border-b">
            Formulario de Rendición de la Tasa de Fiscalización y Control
          </h2>

          <div className="bg-gray-100 p-4 rounded-md mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Distribuidor
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {cooperativa.nombre}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">CUIT</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {cooperativa.cuit}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Campo de Fecha de Rendición: se asigna la fecha actual y se deshabilita */}
              <div className="space-y-2">
                <label
                  htmlFor="fecha_rendicion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de Rendición
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="fecha_rendicion"
                    name="fecha_rendicion"
                    value={new Date().toISOString().split("T")[0]}
                    disabled
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="fecha_transferencia"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de Transferencia
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="fecha_transferencia"
                    name="fecha_transferencia"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="periodo_rendicion"
                  className="block text-sm font-medium text-gray-700"
                >
                  Período de Rendición Mes
                </label>
                <select
                  id="periodo_rendicion"
                  name="periodo_rendicion"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                >
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
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="anio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Periodo de Rendición Año
                </label>
                <select
                  id="anio"
                  name="anio"
                  value={selectedYear}
                  onChange={handleYearChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="total_tasa_letras"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Tasa de Fiscalización y Control (en letras)
                  </label>
                  <input
                    type="text"
                    id="total_tasa_letras"
                    name="total_tasa_letras"
                    defaultValue="Dos millones cuarenta y cinco mil"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="total_tasa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Tasa ($)
                  </label>
                  <input
                    type="number"
                    id="total_tasa"
                    name="total_tasa"
                    defaultValue={2045000}
                    min={0}
                    step={0.01}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="total_transferencia_letras"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Transferencia (en letras)
                  </label>
                  <input
                    type="text"
                    id="total_transferencia_letras"
                    name="total_transferencia_letras"
                    defaultValue="Un millón novecientos noventa mil"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="total_transferencia"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total Transferencia ($)
                  </label>
                  <input
                    type="number"
                    id="total_transferencia"
                    name="total_transferencia"
                    defaultValue={1990000}
                    min={0}
                    step={0.01}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <TablaDemandas
              demandas={demandas}
              handleDemandaChange={handleDemandaChange}
            />

            <div className="pt-6 border-t">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enviar Formulario
              </button>
            </div>
          </form>

          {mensaje && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <p className="text-green-700">{mensaje}</p>
            </div>
          )}

          <p className="mt-6 text-sm text-gray-500 italic">
            La información suministrada en este formulario tiene carácter de
            declaración jurada.
          </p>

          <PeriodoRendiciones />
        </>
      )}
    </div>
  );
};

export default FormularioRendicion;
