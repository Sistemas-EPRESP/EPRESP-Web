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
      .then((response) => {
        console.log("Fetched renditions:", response.data);
        setRendiciones(response.data);
      })
      .catch((error) => console.error("Error fetching renditions:", error));
  }, [cooperativa.idCooperativa, cooperativa]);

  // Extraer los años únicos usando la propiedad 'periodo_anio'
  const years = useMemo(() => {
    if (!rendiciones.length) return [];
    const uniqueYears = [...new Set(rendiciones.map((r) => r.periodo_anio))];
    return uniqueYears.sort((a, b) => b - a);
  }, [rendiciones]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{cooperativa.nombre}</h1>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/formulario/rendicion")}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 min-w-[200px] text-center"
            >
              Nueva Rendición
            </button>
          </div>
        </div>
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
