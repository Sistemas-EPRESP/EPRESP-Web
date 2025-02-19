import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cooperatives } from "../data/mockData";
import YearGrid from "../components/YearGrid";

const CooperativaRendicionesPage = () => {
  const navigate = useNavigate();
  // Por ahora usamos la primera cooperativa como ejemplo
  const cooperative = cooperatives[0];

  const years = useMemo(() => {
    const uniqueYears = [...new Set(cooperative.renditions.map((r) => r.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [cooperative]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {cooperative.name}
        </h1>
        <button
          onClick={() => navigate("/cooperative/rendition")}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
        >
          Nueva Rendición
        </button>
      </div>

      <div>
        {years.map((year) => (
          <YearGrid
            key={year}
            year={year}
            renditions={cooperative.renditions}
          />
        ))}
      </div>

      {years.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            No hay rendiciones disponibles
          </p>
        </div>
      )}
    </>
  );
};
export default CooperativaRendicionesPage;
