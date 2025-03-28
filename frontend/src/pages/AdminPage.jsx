import { useEffect, useState, useMemo } from "react";
import axios from "../config/AxiosConfig";
import YearGrid from "../components/YearGrid";

const AdminPage = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [selectedCooperativa, setSelectedCooperativa] = useState(localStorage.getItem("selectedCooperativa") || "");
  const [rendiciones, setRendiciones] = useState(() => {
    // Recuperar rendiciones guardadas (opcional)
    const savedRendiciones = localStorage.getItem("rendiciones");
    return savedRendiciones ? JSON.parse(savedRendiciones) : [];
  });
  const [searched, setSearched] = useState(false); // Indica si se realizó la búsqueda
  const [lastSearched, setLastSearched] = useState(""); // Guarda la última cooperativa buscada

  useEffect(() => {
    // Obtener la lista de cooperativas desde el backend
    axios
      .get("api/cooperativas/obtener-cooperativas")
      .then((response) => setCooperativas(response.data))
      .catch((error) => console.error("Error fetching cooperatives:", error));
  }, []);

  useEffect(() => {
    // Guardar la cooperativa seleccionada en localStorage
    if (selectedCooperativa) {
      localStorage.setItem("selectedCooperativa", selectedCooperativa);
    } else {
      localStorage.removeItem("selectedCooperativa");
      setSearched(false); // Resetear búsqueda si se deselecciona
    }
  }, [selectedCooperativa]);

  // Persistencia opcional de las rendiciones en localStorage
  useEffect(() => {
    if (rendiciones.length > 0) {
      localStorage.setItem("rendiciones", JSON.stringify(rendiciones));
    } else {
      localStorage.removeItem("rendiciones");
    }
  }, [rendiciones]);

  const fetchRenditions = () => {
    // Evitar buscar si la cooperativa seleccionada es la misma que la última búsqueda
    if (selectedCooperativa === lastSearched) return;

    if (selectedCooperativa) {
      axios
        .get(`api/cooperativas/obtener-preformularios/${selectedCooperativa}`)
        .then((response) => {
          setRendiciones(response.data);
          setSearched(true);
          setLastSearched(selectedCooperativa); // Actualizar la última búsqueda
        })
        .catch((error) => {
          console.error("Error fetching renditions:", error);
          setRendiciones([]);
          setSearched(true);
        });
    } else {
      setRendiciones([]);
      setSearched(false);
    }
  };

  // Extraer años únicos de las rendiciones usando la propiedad 'periodo_anio'
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
          onChange={(e) => {
            setSelectedCooperativa(e.target.value);
            // Reiniciamos el estado de búsqueda al cambiar de cooperativa
            setSearched(false);
            setRendiciones([]);
          }}
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
          // Deshabilitar botón si ya se buscó la misma cooperativa
          disabled={selectedCooperativa === lastSearched && searched}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base ${
            selectedCooperativa === lastSearched && searched
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Buscar
        </button>
      </div>

      {selectedCooperativa && rendiciones.length > 0 ? (
        // Mostrar rendiciones agrupadas por año
        <div>
          {years.map((year) => (
            <YearGrid key={year} year={year} rendiciones={rendiciones} />
          ))}
        </div>
      ) : selectedCooperativa && searched ? (
        // Mensaje cuando no se encontraron rendiciones
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">No se encontraron rendiciones</p>
        </div>
      ) : (
        // Mensaje inicial
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            Seleccione una cooperativa y presione &quot;Buscar&quot; para ver sus rendiciones
          </p>
        </div>
      )}
    </section>
  );
};

export default AdminPage;
