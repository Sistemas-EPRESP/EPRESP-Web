import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const FormularioRendicionAdmin = () => {
  const cooperativa = useContext(AuthContext);
  const [rendicion] = useState({
    fecha_rendicion: "",
    fecha_transferencia: "",
    periodo_mes: "",
    periodo_anio: "",
    tasa_fiscalizacion_letras: "",
    tasa_fiscalizacion_numero: "",
    demandas: {
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
      otros: {
        facturacion: 0,
        percibido: 0,
        transferido: 0,
        observaciones: "",
      },
    },
  });

  //   useEffect(() => {
  //     axios
  //       .get(`/rendiciones/obtener-rendicion/${idRendicion}`)
  //       .then((response) => console.log(response.data))
  //       .catch((error) => console.error("Error fetching renditions:", error));
  //   }, [idRendicion]);

  const formatCUIT = (cuit) => {
    const cuitStr = cuit.toString();
    if (cuitStr.length === 11) {
      return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(
        10
      )}`;
    }
    return cuitStr;
  };

  return (
    <>
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
            <h3 className="text-sm font-medium text-gray-500">CUIT</h3>
            <p className="text-lg font-semibold text-gray-900">
              {formatCUIT(cooperativa.cuit)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Primer fila FECHAS */}
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
                value={rendicion.fecha_rendicion}
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
                value={rendicion.fecha_transferencia}
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioRendicionAdmin;
