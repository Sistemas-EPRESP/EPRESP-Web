import { useState, useMemo } from "react";
import MonthCard from "./MonthCard";

const YearGrid = ({ year, renditions }) => {
  const [isHidden, setIsHidden] = useState(true); // Estado para controlar la visibilidad

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const stats = useMemo(() => {
    const yearRenditions = renditions.filter((r) => r.year === year);
    const submitted = yearRenditions.filter((r) => r.submitted).length;
    const approved = yearRenditions.filter((r) => r.approved).length;
    return { submitted, approved };
  }, [renditions, year]);

  const toggleVisibility = () => {
    setIsHidden((prevState) => !prevState); // Alterna el estado de visibilidad
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold">{year}</h3>
        <div className="text-xs sm:text-sm text-gray-600">
          <span className="font-medium text-green-600">{stats.approved}</span>
          <span className="">/</span>
          <span className="font-medium">{stats.submitted}</span>
          <span className="ml-1">rendiciones aprobadas</span>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 mt-2 sm:mt-0"
        >
          {isHidden ? "Mostrar meses" : "Ocultar meses"}
        </button>
      </div>

      {/* Contenido de los meses */}
      {!isHidden && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-4">
          {months.map((month) => {
            const rendition = renditions.find(
              (r) => r.month === month && r.year === year
            );
            return (
              <MonthCard
                key={month}
                month={month}
                approved={rendition?.approved}
                submitted={rendition?.submitted}
              />
            );
          })}
        </div>
      )}
      {/* Si está oculto, asegúrate de que no haya margen inferior en la primera fila */}
      {isHidden && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-0">
          {/* Aquí puedes incluir contenido de la primera fila o dejarlo vacío si no es necesario */}
        </div>
      )}
    </div>
  );
};

export default YearGrid;
