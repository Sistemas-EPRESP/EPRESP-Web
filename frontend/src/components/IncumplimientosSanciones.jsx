import { useState, useEffect } from "react";
import nonComplianceData from "../data/nonComplianceData";

const IncumplimientosSanciones = ({ incumplimientos }) => {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (incumplimientos) {
      const initialSelected = {};

      incumplimientos.forEach((inc) => {
        // Se busca el ítem en la data estática según su tipo, normalizando la comparación
        const complianceItem = nonComplianceData.find(
          (item) => item.tipo.trim().toLowerCase() === inc.tipo.trim().toLowerCase()
        );
        if (complianceItem) {
          // Se inicializa con el valor 'aprobado' recibido del backend
          initialSelected[complianceItem.tipo] = inc.aprobado;
        }
      });

      setSelected(initialSelected);
    }
  }, [incumplimientos]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Incumplimientos</h2>
      <div className="space-y-4">
        {nonComplianceData.map((item) => {
          const isSelected = !!selected[item.tipo];
          return (
            <div key={item.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => setSelected((prev) => ({ ...prev, [item.tipo]: !prev[item.tipo] }))}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={item.id} className="font-medium text-gray-700">
                  {item.label}
                </label>
                {isSelected && (
                  <ul className="mt-2 ml-5 list-disc text-gray-600">
                    {item.sanctions.map((sanction) => (
                      <li key={sanction.id}>{sanction.label}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncumplimientosSanciones;
