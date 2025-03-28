import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { AuthContext } from "../../context/AuthContext";
import MonthSelect from "../ui/MonthSelect";
import { formatCUIT } from "../../utils/formatCUIT";
import SancionesIncumplimientos from "../SancionesIncumplimientos";
import useRendicionData from "../../hooks/useRendicionData";
import { toast } from "react-toastify";
import axios from "../../config/AxiosConfig";
import { formatPesos } from "../../utils/formatPesos";
import NotificationMessage from "../ui/NotificationMessage";
import { getDefaultDemandas, transformDemandasPayload } from "../../utils/demandUtils";

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
  // Inicializar demandas con valores por defecto
  const [demandas, setDemandas] = useState(getDefaultDemandas());
  // Estados para mensaje y su tipo ("success" o "error")
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState("");

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
      // Se asume que la data de Demandas se adapta a la estructura que espera TablaDemandas
      setDemandas(rendicionData.Demandas ? rendicionData.Demandas : getDefaultDemandas());
    }
  }, [rendicionData, currentYear]);

  // Sincronización del mes seleccionado con el componente padre
  useEffect(() => {
    setMes(formValues.periodo_mes);
  }, [setMes, formValues.periodo_mes]);

  // Manejo de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target ? e.target : e;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo del envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cooperativa || !cooperativa.idCooperativa) {
      setMensaje("Error: No se encontró la cooperativa.");
      setMensajeTipo("error");
      return;
    }

    // Si no es editable, no se envía nada
    if (!isEditable) return;

    const fechaActual = new Date().toISOString().split("T")[0];
    const demandasPayload = transformDemandasPayload(demandas);

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
        response = await axios.post(`api/rendiciones/formulario-rendicion/${cooperativa.idCooperativa}`, { rendicion });
      }
      if (response.status === 200 || response.status === 201) {
        setMensaje(isEditMode ? "Rendición actualizada correctamente." : "Formulario enviado correctamente.");
        setMensajeTipo("success");
        toast.success(isEditMode ? "Rendición actualizada correctamente." : "Formulario enviado correctamente.");
      }
      console.log(rendicion);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Error al enviar la rendición.";
      setMensaje(errorMsg);
      setMensajeTipo("error");
      toast.error(errorMsg);
    }
  };

  // Manejo de navegación entre inputs al presionar Enter en el formulario
  const handleFormKeyDown = (e) => {
    if (e.key === "Enter") {
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

  // Extraemos el valor del campo "actualizable" de la rendición (en modo edición)
  const isEditable = rendicionData?.actualizable;

  return (
    <article className="space-y-10">
      <header className="pb-2 border-b">
        <h2 className="text-2xl font-semibold text-gray-900">
          Formulario de Rendición de la Tasa de Fiscalización y Control
        </h2>
      </header>

      {/* Mensaje indicando que el plazo de actualización se venció y la rendición está en revisión */}
      {rendicionData && isEditable === false && (
        <NotificationMessage
          message="El período de actualización ha finalizado y la rendición está en proceso de revisión."
          type="error"
        />
      )}

      {/* Sección de información del distribuidor */}
      <section aria-labelledby="distribuidor-info" className="bg-gray-100 p-4 rounded-md mb-6">
        <header>
          <h3 id="distribuidor-info" className="sr-only">
            Información del Distribuidor
          </h3>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Distribuidor</p>
            <p className="text-lg font-semibold text-gray-900">{cooperativa.nombre}</p>
          </div>
          <div className="sm:border-l sm:pl-4">
            <p className="text-sm font-medium text-gray-700">CUIT</p>
            <p className="text-lg font-semibold text-gray-900">{formatCUIT(cooperativa.cuit)}</p>
          </div>
        </div>
      </section>

      {/* Sección del formulario */}
      <section>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-10">
          <fieldset>
            <legend className="sr-only">Datos de Rendición y Transferencia</legend>

            {/* Fila 1: Fechas (Rendición y Transferencia) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
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
                    onChange={(e) =>
                      handleInputChange({
                        name: e.target.name,
                        value: e.target.value,
                      })
                    }
                    disabled={!isEditable}
                    className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Fila 2: Período de Rendición (Mes y Año) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Mes */}
              <div className="space-y-2">
                <label htmlFor="periodo_rendicion" className="block text-sm font-medium text-gray-700">
                  Período de Rendición Mes
                </label>
                <div className="relative">
                  <MonthSelect
                    value={formValues.periodo_mes}
                    onChange={(newMonth) => setFormValues((prev) => ({ ...prev, periodo_mes: newMonth }))}
                    disabled={!isEditable}
                  />
                </div>
              </div>
              {/* Año */}
              <div className="space-y-2">
                <label htmlFor="anio" className="block text-sm font-medium text-gray-700">
                  Período de Rendición Año
                </label>
                <div className="relative">
                  <select
                    id="anio"
                    name="periodo_anio"
                    required
                    value={formValues.periodo_anio}
                    onChange={handleInputChange}
                    disabled={!isEditable}
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

            {/* Fila 3: Tasa de Fiscalización (Letra y Número) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Tasa en letras */}
              <div className="space-y-2">
                <label htmlFor="total_tasa_letras" className="block text-sm font-medium text-gray-700">
                  Total Tasa de Fiscalización y Control (Letras)
                </label>
                <TextInput
                  name="total_tasa_letras"
                  returnEvent
                  value={formValues.total_tasa_letras}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Ej: Cien mil pesos"
                  disabled={!isEditable}
                />
              </div>
              {/* Tasa en número */}
              <div className="space-y-2">
                <label htmlFor="total_tasa" className="block text-sm font-medium text-gray-700">
                  Monto (Número)
                </label>
                <NumericInput
                  name="total_tasa"
                  value={formValues.total_tasa}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>

            {/* Fila 4: Total Transferencia (Letra y Número) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Transferencia en letras */}
              <div className="space-y-2">
                <label htmlFor="total_transferencia_letras" className="block text-sm font-medium text-gray-700">
                  Total Transferencia: Pesos (Letras)
                </label>
                <TextInput
                  name="total_transferencia_letras"
                  returnEvent
                  value={formValues.total_transferencia_letras}
                  onChange={handleInputChange}
                  maxLength={100}
                  placeholder="Ej: Cien mil pesos"
                  disabled={!isEditable}
                />
              </div>
              {/* Transferencia en número */}
              <div className="space-y-2">
                <label htmlFor="total_transferencia" className="block text-sm font-medium text-gray-700">
                  Monto (Número)
                </label>
                <NumericInput
                  name="total_transferencia"
                  value={formValues.total_transferencia}
                  onChange={handleInputChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </fieldset>

          {/* Tabla de Demandas */}
          <TablaDemandas
            demandas={demandas}
            setDemandas={setDemandas}
            selectedMonth={formValues.periodo_mes}
            disabled={!isEditable} // Se deshabilita la edición de la tabla
          />

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

          {/* Sección de sanciones/incumplimientos (si aplica) */}
          {isEditMode && rendicionData.incumplimientos && rendicionData.incumplimientos.length > 0 && (
            <SancionesIncumplimientos incumplimientos={rendicionData.incumplimientos} />
          )}

          {/* Botón de envío */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={!isEditable}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isEditMode ? "Actualizar Rendición" : "Enviar Formulario"}
            </button>
          </div>
        </form>
      </section>

      {/* Uso del componente NotificationMessage para mostrar el mensaje */}
      {mensaje && <NotificationMessage message={mensaje} type={mensajeTipo} />}

      <footer>
        <p className="mt-6 text-sm text-gray-500 italic">
          La información suministrada en este formulario tiene carácter de declaración jurada.
        </p>
      </footer>
    </article>
  );
};

export default FormularioRendicion;
