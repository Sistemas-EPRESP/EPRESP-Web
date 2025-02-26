import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/AxiosConfig";
import { monthNames } from "../../utils/dateUtils";
import { formatCUIT } from "../../utils/formatCUIT";

const FormularioRendicion = () => {
  const { cooperativa } = useContext(AuthContext);
  const { id } = useParams(); // Si hay "id", estamos en modo actualización
  const isEditMode = Boolean(id);

  // Estados para el modo update
  const [loading, setLoading] = useState(isEditMode);
  const [rendicionData, setRendicionData] = useState(null);

  // Configuración de años y estado para el año seleccionado
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 + 1 },
    (_, index) => 2019 + index
  );
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  // Estado para las demandas
  const [demandas, setDemandas] = useState({});

  // Estado para mostrar mensajes de éxito o error
  const [mensaje, setMensaje] = useState("");

  // Efecto para cargar datos existentes en modo actualización
  useEffect(() => {
    if (isEditMode) {
      axiosInstance
        .get(`/rendiciones/obtener-rendicion/${id}`)
        .then((response) => {
          const data = response.data;
          setRendicionData(data);
          // Se precargan algunos campos con los datos recibidos
          setSelectedYear(
            data.periodo_anio
              ? data.periodo_anio.toString()
              : currentYear.toString()
          );
          // Se asume que "Demandas" viene en el formato esperado (puedes adaptarlo si viene como array)
          setDemandas(data.Demandas || {});
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setMensaje("Error al cargar los datos de la rendición.");
          setLoading(false);
        });
    }
  }, [id, isEditMode, currentYear]);

  if (isEditMode && loading) {
    return <div>Cargando...</div>;
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cooperativa || !cooperativa.idCooperativa) {
      setMensaje("Error: No se encontró la cooperativa.");
      return;
    }

    const fechaActual = new Date().toISOString().split("T")[0];
    const formData = new FormData(event.target);

    // Preparar payload de demandas (se adapta el nombre de las claves para el backend)
    const demandasPayload = {};
    Object.keys(demandas).forEach((categoria) => {
      const key =
        categoria === "grandesUsuarios" ? "grandes_usuarios" : categoria;
      demandasPayload[key] = {
        facturacion: parseFloat(demandas[categoria].facturacion) || 0,
        total_tasa_fiscalizacion:
          (parseFloat(demandas[categoria].facturacion) || 0) * 0.01,
        total_percibido: parseFloat(demandas[categoria].totalPercibido) || 0,
        total_transferido:
          parseFloat(demandas[categoria].totalTransferido) || 0,
        observaciones: demandas[categoria].observaciones || "Ninguna",
      };
    });

    // Armado del objeto rendición
    const rendicion = {
      fecha_rendicion: fechaActual,
      fecha_transferencia: formData.get("fecha_transferencia"),
      periodo_mes: parseInt(formData.get("periodo_rendicion"), 10),
      periodo_anio: parseInt(selectedYear, 10),
      tasa_fiscalizacion_letras: formData.get("total_tasa_letras") || "",
      tasa_fiscalizacion_numero: parseFloat(formData.get("total_tasa")) || 0,
      total_transferencia_letras:
        formData.get("total_transferencia_letras") || "",
      total_transferencia_numero:
        parseFloat(formData.get("total_transferencia")) || 0,
      demandas: demandasPayload,
    };

    try {
      let response;
      if (isEditMode) {
        // Actualizar registro existente (PUT)
        response = await axiosInstance.put(
          `/rendiciones/formulario-rendicion/${id}`,
          { rendicion }
        );
      } else {
        // Crear un nuevo registro (POST)
        response = await axiosInstance.post(
          `/rendiciones/formulario-rendicion/${cooperativa.idCooperativa}`,
          { rendicion }
        );
      }
      if (response.status === 200 || response.status === 201) {
        setMensaje(
          isEditMode
            ? "Rendición actualizada correctamente."
            : "Formulario enviado correctamente."
        );
        // Opcional: redireccionar o resetear estados según convenga
      }
    } catch (error) {
      console.error(error);
      setMensaje(
        error.response?.data?.message || "Error al enviar la rendición."
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-2 border-b">
        Formulario de Rendición de la Tasa de Fiscalización y Control
      </h2>

      <div className="bg-gray-100 p-4 rounded-md mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Distribuidor</h3>
            <p className="text-lg font-semibold text-gray-900">
              {cooperativa.nombre}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">CUIT</h3>
            <p className="text-lg font-semibold text-gray-900">
              {formatCUIT(cooperativa.cuit)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha de Rendición y Fecha de Transferencia */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-not-allowed text-gray-500"
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
                defaultValue={
                  isEditMode && rendicionData
                    ? rendicionData.fecha_transferencia
                    : ""
                }
                className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Período de Rendición */}
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
              defaultValue={
                isEditMode && rendicionData
                  ? rendicionData.periodo_mes.toString().padStart(2, "0")
                  : "01"
              }
              className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {monthNames.map((nombre, index) => {
                const mesNumero = (index + 1).toString().padStart(2, "0");
                return (
                  <option key={mesNumero} value={mesNumero}>
                    {nombre}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="anio"
              className="block text-sm font-medium text-gray-700"
            >
              Período de Rendición Año
            </label>
            <select
              id="anio"
              name="anio"
              value={selectedYear}
              onChange={handleYearChange}
              required
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

        {/* Datos de la tasa de fiscalización */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="total_tasa_letras"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Tasa de Fiscalización y Control (Letras)
            </label>
            <TextInput
              name="total_tasa_letras"
              defaultValue={
                isEditMode && rendicionData
                  ? rendicionData.tasa_fiscalizacion_letras
                  : ""
              }
              onChange={() => {}}
            />
          </div>
          <div>
            <label
              htmlFor="total_tasa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto (Número)
            </label>
            <NumericInput
              name="total_tasa"
              defaultValue={
                isEditMode && rendicionData
                  ? rendicionData.tasa_fiscalizacion_numero
                  : ""
              }
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Datos de la transferencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="total_transferencia_letras"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Transferencia: Pesos (Letras)
            </label>
            <TextInput
              name="total_transferencia_letras"
              defaultValue={
                isEditMode && rendicionData
                  ? rendicionData.total_transferencia_letras
                  : ""
              }
              onChange={() => {}}
            />
          </div>
          <div>
            <label
              htmlFor="total_transferencia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto (Número)
            </label>
            <NumericInput
              name="total_transferencia"
              defaultValue={
                isEditMode && rendicionData
                  ? rendicionData.total_transferencia_numero
                  : ""
              }
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Integración de la Tabla de Demandas */}
        <TablaDemandas demandas={demandas} setDemandas={setDemandas} />

        {/* Sección de Precauciones */}
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            Precauciones
          </h3>
          <ul className="list-disc pl-5 text-yellow-800 text-sm">
            <li>
              El total transferido no puede ser menor que el total percibido.
              (Transferido:{" "}
              {Object.values(demandas)
                .reduce(
                  (acc, cur) => acc + (parseFloat(cur.totalTransferido) || 0),
                  0
                )
                .toFixed(2)}{" "}
              vs. Percibido:{" "}
              {Object.values(demandas)
                .reduce(
                  (acc, cur) => acc + (parseFloat(cur.totalPercibido) || 0),
                  0
                )
                .toFixed(2)}
              )
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditMode ? "Actualizar Rendición" : "Enviar Formulario"}
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
    </div>
  );
};

export default FormularioRendicion;
