import { useParams } from "react-router-dom";
import TablaDemandas from "../tables/TablaDemandas";
import NumericInput from "../ui/NumericInput";
import TextInput from "../ui/TextInput";
import { getNombreMes } from "../../utils/dateUtils";
import { formatCUIT } from "../../utils/formatCUIT";
import useRendicionData from "../../hooks/useRendicionData";
import { transformarDemandas } from "../../utils/transformarDemandas";
import IncumplimientosSanciones from "../IncumplimientosSanciones";
import ComprobantePDF from "../ui/ComprobantePDF";

const FormularioRendicionAdmin = () => {
  const { id } = useParams();
  const { rendicionData, loading, error } = useRendicionData(id);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

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
  } = rendicionData;

  const demandasTransformadas = transformarDemandas(Demandas);

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Vista Administrador: Rendición</h1>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Cooperativa</h2>
              <p className="text-lg font-semibold text-gray-900">{Cooperativa.nombre}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">CUIT</h2>
              <p className="text-lg font-semibold text-gray-900">{formatCUIT(Cooperativa.cuit)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
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
          </div>

          <TablaDemandas demandas={demandasTransformadas} selectedMonth={periodo_mes} disabled />

          {/* Comprobante PDF */}
          {/* <ComprobantePDF /> */}

          <IncumplimientosSanciones incumplimientos={rendicionData.Incumplimientos} />

          {/* Contenedor del botón alineado a la derecha */}
          <div className="pt-6 border-t flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Revisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioRendicionAdmin;
