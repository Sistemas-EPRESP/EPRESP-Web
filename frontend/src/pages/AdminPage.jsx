import { useEffect, useState, useMemo } from "react";
import axios from "../config/AxiosConfig";
import YearGrid from "../components/YearGrid";

const AdminPage = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [selectedCooperativa, setSelectedCooperativa] = useState("");
  const [rendiciones, setRendiciones] = useState([]);

  useEffect(() => {
    // Obtener la lista de cooperativas del backend
    axios
      .get("api/cooperativas/obtener-cooperativas")
      .then((response) => setCooperativas(response.data))
      .catch((error) => console.error("Error fetching cooperatives:", error));
  }, []);

  const fetchRenditions = () => {
    if (selectedCooperativa) {
      axios
        .get(`api/cooperativas/obtener-preformularios/${selectedCooperativa}`)
        .then((response) => setRendiciones(response.data))
        .catch((error) => console.error("Error fetching renditions:", error));
    } else {
      setRendiciones([]);
    }
  };

  // Extraer los años únicos usando la propiedad 'periodo_anio'
  const years = useMemo(() => {
    if (!rendiciones.length) return [];
    const uniqueYears = [...new Set(rendiciones.map((r) => r.periodo_anio))];
    return uniqueYears.sort((a, b) => b - a);
  }, [rendiciones]);

  return (
    <section aria-labelledby="admin-page-title" className="py-6">
      <h1 id="admin-page-title" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Control de Rendiciones
      </h1>

      <div className="mb-6 sm:mb-8 flex items-center space-x-4">
        <select
          id="cooperative"
          value={selectedCooperativa}
          onChange={(e) => setSelectedCooperativa(e.target.value)}
          className="w-full max-w-md px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
        >
          <option value="">Seleccione una cooperativa</option>
          {cooperativas.map((coop) => (
            <option key={coop.id} value={coop.id}>
              {coop.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={fetchRenditions}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
        >
          Buscar
        </button>
      </div>

      {selectedCooperativa && rendiciones.length > 0 ? (
        <div>
          {years.map((year) => (
            <YearGrid key={year} year={year} rendiciones={rendiciones} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">Seleccione una cooperativa para ver sus rendiciones</p>
        </div>
      )}
    </section>
  );
};

export default AdminPage;
