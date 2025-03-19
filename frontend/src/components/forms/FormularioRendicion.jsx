import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { AuthContext } from "../../context/AuthContext";
import MonthSelect from "../ui/MonthSelect";
import { formatCUIT } from "../../utils/formatCUIT";
import { transformarDemandas } from "../../utils/transformarDemandas";
import SancionesIncumplimientos from "../SancionesIncumplimientos";
import useRendicionData from "../../hooks/useRendicionData";
import { toast } from "react-toastify";
import axios from "../../config/AxiosConfig";
import { formatPesos } from "../../utils/formatPesos";

const FormularioRendicion = ({ setMes }) => {
  const { cooperativa } = useContext(AuthContext);
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, index) => 2019 + index);

  // Estado para valores del formulario
  const [formValues, setFormValues] = useState({
    fecha_transferencia: "",
    periodo_mes: 1,
    total_tasa_letras: "",
    total_tasa: 0.0,
    total_transferencia_letras: "",
    total_transferencia: 0.0,
    periodo_anio: currentYear,
  });
  const [demandas, setDemandas] = useState({});
  const [mensaje, setMensaje] = useState("");

  const { rendicionData, loading, error } = useRendicionData(isEditMode ? id : null);

  useEffect(() => {
    if (rendicionData) {
      setFormValues({
        fecha_transferencia: rendicionData.fecha_transferencia || "",
        periodo_mes: rendicionData.periodo_mes ? parseInt(rendicionData.periodo_mes, 10) : 1,
        total_tasa_letras: rendicionData.tasa_fiscalizacion_letras || "",
        total_tasa: parseFloat(rendicionData.tasa_fiscalizacion_numero) || 0.0,
        total_transferencia_letras: rendicionData.total_transferencia_letras || "",
        total_transferencia: parseFloat(rendicionData.total_transferencia_numero) || 0.0,
        periodo_anio: rendicionData.periodo_anio ? parseInt(rendicionData.periodo_anio, 10) : currentYear,
      });
      setDemandas(transformarDemandas(rendicionData.Demandas));
    }
  }, [rendicionData, currentYear]);

  // Sincronización del mes seleccionado con el componente padre
  useEffect(() => {
    setMes(formValues.periodo_mes);
  }, [setMes, formValues.periodo_mes]);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    // Se reciben eventos nativos o bien objetos { name, value }
    const { name, value } = e.target ? e.target : e;
    setFormValues((prev) => ({ ...prev, [name]: value }));
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
      demandasPayload[categoria] = {
        facturacion: parseFloat(demandas[categoria].facturacion) || 0.0,
        total_tasa_fiscalizacion: parseFloat(demandas[categoria].tasaFiscalizacion) || 0.0,
        total_percibido: parseFloat(demandas[categoria].totalPercibido) || 0.0,
        total_transferido: parseFloat(demandas[categoria].totalTransferido) || 0.0,
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
      tasa_fiscalizacion_numero: parseFloat(formValues.total_tasa) || 0.0,
      total_transferencia_letras: formValues.total_transferencia_letras,
      total_transferencia_numero: parseFloat(formValues.total_transferencia) || 0.0,
      demandas: demandasPayload,
    };

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(`api/rendiciones/modificar-rendicion/${id}`, { rendicion });
      } else {
        response = await axios.post(`api/rendiciones/formulario-rendicion/${cooperativa.idCooperativa}`, {
          rendicion,
        });
      }
      if (response.status === 200 || response.status === 201) {
        setMensaje(isEditMode ? "Rendición actualizada correctamente." : "Formulario enviado correctamente.");
      }
      console.log(rendicion);
      toast.success(isEditMode ? "Rendición actualizada correctamente." : "Formulario enviado correctamente.");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error al enviar la rendición.";
      setMensaje(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Manejo de navegación entre inputs al presionar Enter en el formulario
  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Se obtienen todos los elementos focusables dentro del formulario
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

  // Cálculos para precauciones
  const totalPercibido = Object.values(demandas).reduce((acc, cur) => acc + (parseFloat(cur.totalPercibido) || 0), 0);
  const totalTransferido = Object.values(demandas).reduce(
    (acc, cur) => acc + (parseFloat(cur.totalTransferido) || 0),
    0
  );
  const shouldShowPrecauciones = totalTransferido < totalPercibido;

  if (isEditMode && loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

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
            {/* Fecha de rendición (deshabilitada) */}
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
                  onChange={(e) => handleInputChange({ name: e.target.name, value: e.target.value })}
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
              <MonthSelect
                value={formValues.periodo_mes}
                onChange={(newMonth) => setFormValues((prev) => ({ ...prev, periodo_mes: newMonth }))}
              />
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
              returnEvent
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
              returnEvent
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

        {/* Tabla de Demandas */}
        <TablaDemandas demandas={demandas} setDemandas={setDemandas} selectedMonth={formValues.periodo_mes} />

        {/* Precauciones si el total transferido es menor que el total percibido */}
        {shouldShowPrecauciones && (
          <div role="alert" className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Advertencia</h3>
            <p className="text-yellow-800 text-sm">
              El monto transferido <strong>${formatPesos(totalTransferido)}</strong> es menor que el monto percibido{" "}
              <strong>${formatPesos(totalPercibido)}</strong>. Por favor, verifica que los valores ingresados sean
              correctos.
            </p>
          </div>
        )}

        {isEditMode && rendicionData.Incumplimientos && rendicionData.Incumplimientos.length > 0 && (
          <SancionesIncumplimientos incumplimientos={rendicionData.Incumplimientos} />
        )}

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
