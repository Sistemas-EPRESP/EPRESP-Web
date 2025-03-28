import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/AxiosConfig";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { getNombreMes } from "../../utils/dateUtils";
import { formatCUIT } from "../../utils/formatCUIT";
import useRendicionData from "../../hooks/useRendicionData";
import { transformarDemandas } from "../../utils/transformarDemandas";
import IncumplimientosSanciones from "../IncumplimientosSanciones";
import NotificationMessage from "../ui/NotificationMessage"; // Ajustar la ruta según la estructura de tu proyecto

const FormularioRendicionAdmin = () => {
  const { id } = useParams();
  const { rendicionData, loading, error } = useRendicionData(id);
  const [incumplimientos, setIncumplimientos] = useState([]);

  // Estados para aprobación
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [approvalValue, setApprovalValue] = useState("");

  // Estados para mensajes
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState(""); // "success" o "error"

  useEffect(() => {
    if (rendicionData && rendicionData.incumplimientos) {
      // Inicializa el estado con los incumplimientos recibidos
      setIncumplimientos(rendicionData.incumplimientos);
    }
  }, [rendicionData]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  // Extraemos el campo actualizable
  const {
    Cooperativa,
    fecha_rendicion,
    fecha_transferencia,
    periodo_anio,
    periodo_mes,
    tasa_fiscalizacion_letras,
    tasa_fiscalizacion_numero,
    total_transferencia_letras,
    total_transferencia_numero,
    Demandas,
    actualizable, // <-- nuevo campo
  } = rendicionData;

  // Variable para determinar si se debe deshabilitar la edición
  const isActualizable = actualizable;

  const demandasTransformadas = transformarDemandas(Demandas);

  // Función para enviar los datos, incluyendo aprobación y monto numérico
  const handleSubmit = () => {
    // No se envían datos si la rendición está en periodo de actualización
    if (isActualizable) return;

    const revision = {
      incumplimientos,
      aprobado: approvalChecked,
      monto: approvalChecked ? approvalValue : 0,
    };
    axiosInstance
      .post(`/api/rendiciones/revision/${id}`, { revision })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setMensaje("Formulario enviado correctamente.");
          setMensajeTipo("success");
        } else {
          setMensaje("Ocurrió un error al enviar los datos.");
          setMensajeTipo("error");
        }
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.message || "Error al enviar datos.";
        setMensaje(errorMsg);
        setMensajeTipo("error");
      });
  };

  return (
    <article className="bg-white rounded-lg shadow-sm p-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Vista Administrador: Rendición</h1>
      </header>

      {/* Mensaje de actualización si la rendición está en periodo de actualización */}
      {isActualizable && (
        <NotificationMessage
          message="La cooperativa todavia está en periodo de actualización de la rendición"
          type="error" // Se muestra como error
        />
      )}

      {/* Sección de información de la Cooperativa */}
      <section className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8" aria-labelledby="cooperativa-info">
        <header>
          <h2 id="cooperativa-info" className="sr-only">
            Información de la Cooperativa
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Cooperativa</h3>
            <p className="text-lg font-semibold text-gray-900">{Cooperativa.nombre}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">CUIT</h3>
            <p className="text-lg font-semibold text-gray-900">{formatCUIT(Cooperativa.cuit)}</p>
          </div>
        </div>
      </section>

      {/* Formulario de datos de rendición */}
      <section className="space-y-10">
        <form className="space-y-10">
          {/* Grupo de Fechas */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Fechas de Rendición y Transferencia</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fechaRendicion" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Rendición
                </label>
                <input
                  type="date"
                  id="fechaRendicion"
                  value={fecha_rendicion}
                  disabled
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="fechaTransferencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Transferencia
                </label>
                <input
                  type="date"
                  id="fechaTransferencia"
                  value={fecha_transferencia}
                  disabled
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Grupo de Período de Rendición */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Período de Rendición</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="periodoMes" className="block text-sm font-medium text-gray-700 mb-1">
                  Período de Rendición Mes
                </label>
                <input
                  type="text"
                  id="periodoMes"
                  value={getNombreMes(periodo_mes)}
                  disabled
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="periodoAnio" className="block text-sm font-medium text-gray-700 mb-1">
                  Período de Rendición Año
                </label>
                <input
                  type="text"
                  id="periodoAnio"
                  value={periodo_anio}
                  disabled
                  className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed text-gray-500"
                />
              </div>
            </div>
          </fieldset>

          {/* Grupo de Datos de Tasa y Transferencia */}
          <fieldset className="space-y-4">
            <legend className="sr-only">Datos de Tasa y Transferencia</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tasaLetras" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Tasa de Fiscalización y Control (Letras)
                </label>
                <TextInput value={tasa_fiscalizacion_letras} disabled onChange={() => {}} />
              </div>
              <div>
                <label htmlFor="tasaNumero" className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (Número)
                </label>
                <NumericInput value={tasa_fiscalizacion_numero} disabled onChange={() => {}} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="transferenciaLetras" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Transferencia: Pesos (Letras)
                </label>
                <TextInput value={total_transferencia_letras} disabled onChange={() => {}} />
              </div>
              <div>
                <label htmlFor="transferenciaNumero" className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (Número)
                </label>
                <NumericInput value={total_transferencia_numero} disabled onChange={() => {}} />
              </div>
            </div>
          </fieldset>
        </form>

        {/* Sección de Tabla de Demandas */}
        <section className="mt-10" aria-labelledby="tabla-demandas-title">
          <TablaDemandas demandas={demandasTransformadas} selectedMonth={periodo_mes} disabled />
        </section>

        {/* Sección de Incumplimientos y Sanciones */}
        <section className="mt-10">
          <IncumplimientosSanciones
            incumplimientos={incumplimientos}
            setIncumplimientos={setIncumplimientos}
            disabled={isActualizable} // Se deshabilita en periodo de actualización
          />
        </section>

        {/* Sección de Aprobación */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aprobación</h2>
          <div className="flex items-center space-x-2">
            {/* Checkbox para aprobar */}
            <input
              type="checkbox"
              checked={approvalChecked}
              onChange={() => setApprovalChecked(!approvalChecked)}
              disabled={isActualizable}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">Aprobar</label>
          </div>
          {approvalChecked && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingrese el monto numérico</label>
              <NumericInput
                value={approvalValue}
                onChange={(e) => setApprovalValue(e.target.value)}
                disabled={isActualizable}
              />
            </div>
          )}
        </section>
      </section>

      {/* Área de acción: Botón de revisión */}
      <footer className="pt-6 border-t flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isActualizable}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Revisar
        </button>
      </footer>

      {/* Uso del componente NotificationMessage para mostrar el mensaje */}
      {mensaje && <NotificationMessage message={mensaje} type={mensajeTipo} />}
    </article>
  );
};

export default FormularioRendicionAdmin;
