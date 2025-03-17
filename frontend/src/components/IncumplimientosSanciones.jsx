import { useState } from "react";

const IncumplimientosSanciones = () => {
  // Estado para controlar los checkbox seleccionados
  const [selected, setSelected] = useState({});

  // Datos de ejemplo: cada incumplimiento tiene una lista de sanciones asociadas
  const incumplimientos = [
    {
      id: "omision-pago",
      label: "Omisión de pago",
      sanciones: [
        {
          id: "intereses-resarcitorios",
          label: "Intereses resarcitorios (art. 21° Anexo Res. N° 38/2024 - EPRESP)",
        },
        {
          id: "multa-omision",
          label: "Multa por omisión de pago (art. 25° y 26° Anexo Res. N° 38/2024 - EPRESP)",
        },
      ],
    },
    // Se pueden agregar más incumplimientos aquí
  ];

  // Función para manejar el cambio de estado de cada checkbox
  const handleCheckboxChange = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Detalles de Incumplimientos</h2>
      <div className="space-y-4">
        {incumplimientos.map((item) => (
          <div key={item.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={item.id}
                type="checkbox"
                checked={!!selected[item.id]}
                onChange={() => handleCheckboxChange(item.id)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={item.id} className="font-medium text-gray-700">
                {item.label}
              </label>
              {/* Mostrar sanciones si el checkbox está seleccionado */}
              {selected[item.id] && (
                <ul className="mt-2 ml-5 list-disc text-gray-600">
                  {item.sanciones.map((sancion) => (
                    <li key={sancion.id}>{sancion.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncumplimientosSanciones;
