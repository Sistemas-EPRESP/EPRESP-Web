import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// Componentes y utilidades
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import FileUpload from "../ui/FileUpload";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/AxiosConfig";
import { monthNames } from "../../utils/dateUtils";
import { parsePesos } from "../../utils/formatPesos";
import { formatCUIT } from "../../utils/formatCUIT";

const FormularioRendicion = ({ setMes }) => {
  // Contexto y parámetros de URL
  const { cooperativa } = useContext(AuthContext);
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // Variables de tiempo y opciones de año
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, index) => 2019 + index);

  // Estados del componente
  const [pdfFile, setPdfFile] = useState(null);
  const [formValues, setFormValues] = useState({
    fecha_transferencia: "",
    periodo_mes: 1,
    total_tasa_letras: "",
    total_tasa: "",
    total_transferencia_letras: "",
    total_transferencia: "",
    periodo_anio: currentYear,
  });
  const [demandas, setDemandas] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [mensaje, setMensaje] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                           Funciones Auxiliares                             */
  /* -------------------------------------------------------------------------- */

  // Transforma el array de demandas en un objeto con claves definidas
  const transformarDemandas = (demandasArray) => {
    const mapeoTipos = {
      residencial: "residencial",
      comercial: "comercial",
      industrial: "industrial",
      grandes_usuarios: "grandesUsuarios",
      contratos: "contratos",
      otros: "otros",
    };

    if (Array.isArray(demandasArray)) {
      return demandasArray.reduce((acc, item) => {
        const key = mapeoTipos[item.tipo] || item.tipo;
        acc[key] = {
          facturacion: item.facturacion || "0.00",
          tasaFiscalizacion: item.total_tasa_fiscalizacion || "0.00",
          totalPercibido: item.total_percibido || "0.00",
          totalTransferido: item.total_transferido || "0.00",
          observaciones: item.observaciones || "",
          id: item.id,
        };
        return acc;
      }, {});
    }
    return demandasArray || {};
  };

  /* -------------------------------------------------------------------------- */
  /*                           Efectos (useEffect)                              */
  /* -------------------------------------------------------------------------- */

  // Carga de datos en modo edición
  useEffect(() => {
    if (isEditMode) {
      axiosInstance
        .get(`/rendiciones/obtener-rendicion/${id}`)
        .then((response) => {
          const data = response.data;
          setFormValues({
            fecha_transferencia: data.fecha_transferencia || "",
            periodo_mes: data.periodo_mes ? parseInt(data.periodo_mes, 10) : 1,
            total_tasa_letras: data.tasa_fiscalizacion_letras || "",
            total_tasa: data.tasa_fiscalizacion_numero || "",
            total_transferencia_letras: data.total_transferencia_letras || "",
            total_transferencia: data.total_transferencia_numero || "",
            periodo_anio: data.periodo_anio ? parseInt(data.periodo_anio, 10) : currentYear,
          });
          setDemandas(transformarDemandas(data.Demandas));
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setMensaje("Error al cargar los datos de la rendición.");
          setLoading(false);
        });
    }
  }, [id, isEditMode, currentYear]);

  // Sincroniza el mes seleccionado con el componente padre
  useEffect(() => {
    setMes(formValues.periodo_mes);
  }, [setMes, formValues.periodo_mes]);

  /* -------------------------------------------------------------------------- */
  /*                       Handlers y Funciones de Eventos                     */
  /* -------------------------------------------------------------------------- */

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "periodo_mes") {
      const numericValue = parseInt(value, 10);
      setFormValues({ ...formValues, [name]: numericValue });
      setMes(numericValue);
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cooperativa || !cooperativa.idCooperativa) {
      setMensaje("Error: No se encontró la cooperativa.");
      return;
    }

    const fechaActual = new Date().toISOString().split("T")[0];

    // Preparar payload de demandas
    const demandasPayload = {};
    Object.keys(demandas).forEach((categoria) => {
      const key = categoria === "grandesUsuarios" ? "grandes_usuarios" : categoria;
      demandasPayload[key] = {
        facturacion: parsePesos(demandas[categoria].facturacion) || 0,
        total_percibido: parsePesos(demandas[categoria].totalPercibido) || 0,
        total_transferido: parsePesos(demandas[categoria].totalTransferido) || 0,
        observaciones: demandas[categoria].observaciones || "",
      };
    });

    // Preparar objeto rendición
    const rendicion = {
      fecha_rendicion: fechaActual,
      fecha_transferencia: formValues.fecha_transferencia,
      periodo_mes: parseInt(formValues.periodo_mes, 10),
      periodo_anio: parseInt(formValues.periodo_anio, 10),
      tasa_fiscalizacion_letras: formValues.total_tasa_letras,
      tasa_fiscalizacion_numero: parsePesos(formValues.total_tasa) || 0,
      total_transferencia_letras: formValues.total_transferencia_letras,
      total_transferencia_numero: parsePesos(formValues.total_transferencia) || 0,
      demandas: demandasPayload,
      // Por ahora no se envía el archivo, solo se visualiza
      // archivo: pdfFile
    };

    try {
      // Aquí se podría enviar la rendición según el modo edición/creación
      // let response;
      // if (isEditMode) {
      //   response = await axiosInstance.put(`/rendiciones/formulario-rendicion/${id}`, { rendicion });
      // } else {
      //   response = await axiosInstance.post(`/rendiciones/formulario-rendicion/${cooperativa.idCooperativa}`, { rendicion });
      // }
      // if (response.status === 200 || response.status === 201) {
      //   setMensaje(isEditMode ? "Rendición actualizada correctamente." : "Formulario enviado correctamente.");
      // }
      console.log(rendicion);
    } catch (error) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error al enviar la rendición.");
    }
  };

  // Manejo de navegación entre inputs al presionar la tecla Enter
  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.closest("table")) return;
      e.preventDefault();
      const form = e.target.form;
      const focusable = form.querySelectorAll(
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
      );
      const index = Array.prototype.indexOf.call(focusable, e.target);
      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                        Cálculos Derivados y Condiciones                    */
  /* -------------------------------------------------------------------------- */

  const totalPercibido = Object.values(demandas).reduce((acc, cur) => acc + (parseFloat(cur.totalPercibido) || 0), 0);
  const totalTransferido = Object.values(demandas).reduce(
    (acc, cur) => acc + (parseFloat(cur.totalTransferido) || 0),
    0
  );
  const shouldShowPrecauciones = totalTransferido < totalPercibido;

  // Muestra "Cargando..." en modo edición mientras se obtienen los datos
  if (isEditMode && loading) {
    return <div>Cargando...</div>;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Renderizado                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-2 border-b">
        Formulario de Rendición de la Tasa de Fiscalización y Control
      </h2>

      {/* Información del distribuidor */}
      <div className="bg-gray-100 p-4 rounded-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Distribuidor</h3>
            <p className="text-lg font-semibold text-gray-900">{cooperativa.nombre}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">CUIT</h3>
            <p className="text-lg font-semibold text-gray-900">{formatCUIT(cooperativa.cuit)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-10">
        {/* Sección de fechas y período */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Fecha de rendición (deshabilitado) */}
            <div className="space-y-2">
              <label htmlFor="fecha_rendicion" className="block text-sm font-medium text-gray-700">
                Fecha de Rendición
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="fecha_rendicion"
                  name="fecha_rendicion"
                  value={new Date().toISOString().split("T")[0]}
                  disabled
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>
            </div>
            {/* Fecha de transferencia */}
            <div className="space-y-2">
              <label htmlFor="fecha_transferencia" className="block text-sm font-medium text-gray-700">
                Fecha de Transferencia
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="fecha_transferencia"
                  name="fecha_transferencia"
                  required
                  value={formValues.fecha_transferencia}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Selección de mes y año */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="periodo_rendicion" className="block text-sm font-medium text-gray-700">
                Período de Rendición Mes
              </label>
              <select
                id="periodo_rendicion"
                name="periodo_mes"
                required
                value={formValues.periodo_mes}
                onChange={handleInputChange}
                className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {monthNames.map((nombre, index) => {
                  const mesNumero = index + 1;
                  return (
                    <option key={mesNumero} value={mesNumero}>
                      {nombre}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
                Período de Rendición Año
              </label>
              <select
                id="anio"
                name="periodo_anio"
                required
                value={formValues.periodo_anio}
                onChange={handleInputChange}
                className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Datos de la tasa de fiscalización */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="total_tasa_letras" className="block text-sm font-medium text-gray-700 mb-1">
              Total Tasa de Fiscalización y Control (Letras)
            </label>
            <TextInput
              name="total_tasa_letras"
              value={formValues.total_tasa_letras}
              onChange={handleInputChange}
              maxLength={100}
              placeholder="Ej: Cien mil pesos"
            />
          </div>
          <div>
            <label htmlFor="total_tasa" className="block text-sm font-medium text-gray-700 mb-1">
              Monto (Número)
            </label>
            <NumericInput name="total_tasa" value={formValues.total_tasa} onChange={handleInputChange} />
          </div>
        </div>

        {/* Datos de la transferencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="total_transferencia_letras" className="block text-sm font-medium text-gray-700 mb-1">
              Total Transferencia: Pesos (Letras)
            </label>
            <TextInput
              name="total_transferencia_letras"
              value={formValues.total_transferencia_letras}
              onChange={handleInputChange}
              maxLength={100}
              placeholder="Ej: Cien mil pesos"
            />
          </div>
          <div>
            <label htmlFor="total_transferencia" className="block text-sm font-medium text-gray-700 mb-1">
              Monto (Número)
            </label>
            <NumericInput
              name="total_transferencia"
              value={formValues.total_transferencia}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Integración de la Tabla de Demandas */}
        <TablaDemandas demandas={demandas} setDemandas={setDemandas} selectedMonth={formValues.periodo_mes} />

        {/* Precauciones si el total transferido es menor que el total percibido */}
        {shouldShowPrecauciones && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Precauciones</h3>
            <ul className="list-disc pl-5 text-yellow-800 text-sm">
              <li>
                El total transferido no puede ser menor que el total percibido. (Transferido:{" "}
                {totalTransferido.toFixed(2)} vs. Percibido: {totalPercibido.toFixed(2)})
              </li>
            </ul>
          </div>
        )}

        {/* Opción para subir comprobante de pago */}
        <div className="mt-6">
          <FileUpload onChange={(file) => setPdfFile(file)} />
        </div>

        {/* Botón de envío */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditMode ? "Actualizar Rendición" : "Enviar Formulario"}
          </button>
        </div>
      </form>

      {/* Mensajes de respuesta */}
      {mensaje && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <p className="text-green-700">{mensaje}</p>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500 italic">
        La información suministrada en este formulario tiene carácter de declaración jurada.
      </p>
    </div>
  );
};

export default FormularioRendicion;
