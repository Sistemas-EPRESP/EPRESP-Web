import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import axios from "../../config/AxiosConfig";

const FormularioRendicionAdmin = () => {
  const { id } = useParams();
  const [rendicionData, setRendicionData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`/rendiciones/obtener-rendicion/${id}`)
        .then((response) => {
          console.log(response.data);
          setRendicionData(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  if (!rendicionData) {
    return <div>Cargando...</div>;
  }

  // Desestructuramos la respuesta de la API
  const {
    Cooperativa,
    fecha_rendicion,
    fecha_transferencia,
    periodo_anio,
    periodo_mes,
    tasa_fiscalizacion_letras,
    tasa_fiscalizacion_numero,
    Demandas, // Es un array
  } = rendicionData;

  // Función para transformar el array de demandas en el formato que espera TablaDemandas
  const transformarDemandas = (demandasArray) => {
    // Mapeo para convertir el "tipo" de la API a la clave esperada en la tabla
    const mapeoTipos = {
      residencial: "residencial",
      comercial: "comercial",
      industrial: "industrial",
      grandes_usuarios: "grandesUsuarios", // Convierte "grandes_usuarios" a "grandesUsuarios"
      contratos: "contratos",
      otros: "otros",
    };

    return demandasArray.reduce((acc, item) => {
      const key = mapeoTipos[item.tipo] || item.tipo;
      acc[key] = {
        facturacion: item.facturacion || "0.00",
        // Renombramos las propiedades para que coincidan con lo que usa TablaDemandas
        tasaFiscalizacion: item.total_tasa_fiscalizacion || "0.00",
        totalPercibido: item.total_percibido || "0.00",
        totalTransferido: item.total_transferido || "0.00",
        observaciones: item.observaciones || "",
        id: item.id,
      };
      return acc;
    }, {});
  };

  // Transformamos el array de Demandas
  const demandasTransformadas = transformarDemandas(Demandas);

  // Función para convertir el número del mes en su nombre correspondiente
  const getNombreMes = (mesNumero) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    // Restamos 1 ya que el array comienza en índice 0
    return meses[mesNumero - 1] || "";
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Vista Administrador: Rendición
        </h1>

        {/* Información de la cooperativa */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Cooperativa</h2>
              <p className="text-lg font-semibold text-gray-900">
                {Cooperativa.nombre}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">CUIT</h2>
              <p className="text-lg font-semibold text-gray-900">
                {Cooperativa.cuit}
              </p>
            </div>
          </div>
        </div>

        {/* Datos de rendición en modo solo lectura */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fechaRendicion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de Rendición
              </label>
              <input
                type="date"
                id="fechaRendicion"
                value={fecha_rendicion}
                disabled
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="fechaTransferencia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha de Transferencia
              </label>
              <input
                type="date"
                id="fechaTransferencia"
                value={fecha_transferencia}
                disabled
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="periodoAnio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Período de Rendición Año
              </label>
              <input
                type="text"
                id="periodoAnio"
                value={periodo_anio}
                disabled
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="periodoMes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Período de Rendición Mes
              </label>
              <input
                type="text"
                id="periodoMes"
                value={getNombreMes(periodo_mes)}
                disabled
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tasaLetras"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Total Tasa de Fiscalización y Control (Letras)
              </label>
              <input
                type="text"
                id="tasaLetras"
                value={tasa_fiscalizacion_letras}
                disabled
                className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md shadow-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="tasaNumero"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Monto (Número)
              </label>
              {/* Se reemplaza el input de texto por NumericInput */}
              <NumericInput
                value={tasa_fiscalizacion_numero}
                disabled={true}
                onChange={() => {}} // Como es de solo lectura, se puede pasar una función vacía
              />
            </div>
          </div>

          {/* Sección para la tabla de demandas */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tabla de Demandas
            </h2>
            <TablaDemandas demandas={demandasTransformadas} disabled={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioRendicionAdmin;
