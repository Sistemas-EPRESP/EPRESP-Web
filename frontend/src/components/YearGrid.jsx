import { useMemo, useState } from "react";
import MonthCard from "./MonthCard";

const YearGrid = ({ year, rendiciones = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const stats = useMemo(() => {
    // Filtrar las rendiciones que correspondan al año indicado usando 'periodo_anio'
    const yearRendiciones = rendiciones.filter((r) => r.periodo_anio === year);
    // Se asume que cada registro indica que la rendición fue enviada
    const submitted = yearRendiciones.length;
    const approved = yearRendiciones.filter((r) => r.aprobado).length;
    return { submitted, approved };
  }, [rendiciones, year]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        <h3 className="text-lg sm:text-xl font-semibold">{year}</h3>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium text-green-600">{stats.approved}</span>
            <span className="mx-1">/</span>
            <span className="font-medium">{stats.submitted}</span>
            <span className="ml-1">rendiciones aprobadas</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
          {months.map((month) => {
            // Buscar la rendición correspondiente para ese mes y año
            const rendition = rendiciones.find(
              (r) => r.periodo_mes === month && r.periodo_anio === year
            );
            return (
              <MonthCard
                key={month}
                month={month}
                approved={rendition?.aprobado || false}
                submitted={!!rendition}
                idRendicion={rendition?.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YearGrid;
