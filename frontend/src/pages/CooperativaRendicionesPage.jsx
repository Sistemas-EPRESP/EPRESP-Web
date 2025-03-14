import { useMemo, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import YearGrid from "../components/YearGrid";
import axios from "../config/AxiosConfig";

const CooperativaRendicionesPage = () => {
  const navigate = useNavigate();
  const { cooperativa } = useContext(AuthContext);
  const [rendiciones, setRendiciones] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/cooperativas/obtener-preformularios/${cooperativa.idCooperativa}`)
      .then((response) => setRendiciones(response.data))
      .catch((error) => console.error("Error fetching renditions:", error));
  }, [cooperativa.idCooperativa]);

  // Extraer los años únicos usando la propiedad 'periodo_anio'
  const years = useMemo(() => {
    if (!rendiciones.length) return [];
    const uniqueYears = [...new Set(rendiciones.map((r) => r.periodo_anio))];
    return uniqueYears.sort((a, b) => b - a);
  }, [rendiciones]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{cooperativa.nombre}</h1>
        <button
          onClick={() => navigate("/formulario/rendicion")}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Nueva Rendición
        </button>
      </div>

      {rendiciones.length > 0 ? (
        <div>
          {years.map((year) => (
            <YearGrid key={year} year={year} rendiciones={rendiciones} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">No hay rendiciones disponibles</p>
        </div>
      )}
    </>
  );
};
export default CooperativaRendicionesPage;
