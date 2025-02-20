import { useEffect, useState, useMemo } from "react";
import axios from "../config/AxiosConfig";
import YearGrid from "../components/YearGrid";

const AdminPage = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [selectedCooperativa, setSelectedCooperativa] = useState("");

  useEffect(() => {
    // Obtener la lista de cooperativas del backend
    axios
      .get("/cooperativas/obtener-cooperativas")
      .then((response) => setCooperativas(response.data))
      .catch((error) => console.error("Error fetching cooperatives:", error));
  }, []);

  useEffect(() => {
    if (selectedCooperativa) {
      // Obtener las rendiciones de la cooperativa seleccionada
      axios
        .get(`/cooperatives/${selectedCooperativa}/renditions`)
        .then((response) => setRenditions(response.data))
        .catch((error) => console.error("Error fetching renditions:", error));
    } else {
      setRenditions([]);
    }
  }, [selectedCooperative]);

  const years = useMemo(() => {
    if (!selectedCooperative) return [];
    const cooperative = cooperatives.find((c) => c.id === selectedCooperative);
    if (!cooperative) return [];

    const uniqueYears = [...new Set(cooperative.renditions.map((r) => r.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [selectedCooperative]);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Control de Rendiciones
      </h1>

      <div className="mb-6 sm:mb-8">
        <label
          htmlFor="cooperative"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Seleccionar Cooperativa
        </label>
        <select
          id="cooperative"
          value={selectedCooperative}
          onChange={(e) => setSelectedCooperative(e.target.value)}
          className="w-full max-w-md px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
        >
          <option value="">Seleccione una cooperativa</option>
          {cooperatives.map((coop) => (
            <option key={coop.id} value={coop.id}>
              {coop.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCooperative ? (
        <div>
          {years.map((year) => (
            <YearGrid
              key={year}
              year={year}
              renditions={
                cooperatives.find((c) => c.id === selectedCooperative)
                  ?.renditions || []
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            Seleccione una cooperativa para ver sus rendiciones
          </p>
        </div>
      )}
    </>
  );
};

export default AdminPage;
