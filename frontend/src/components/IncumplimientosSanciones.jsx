import nonComplianceData from "../data/nonComplianceData";

const IncumplimientosSanciones = ({ incumplimientos, setIncumplimientos, disabled }) => {
  // Normalizamos la lista de incumplimientos, asegurando que todos los de `nonComplianceData` estén presentes.
  const normalizedIncumplimientos = nonComplianceData.map((item) => {
    // Buscamos si el incumplimiento ya está en la lista del backend
    const existing = incumplimientos.find((inc) => inc.tipo.trim().toLowerCase() === item.tipo.trim().toLowerCase());
    // Si existe, lo usamos, si no, creamos uno nuevo con `aprobado: false`
    return existing || { tipo: item.tipo, aprobado: false };
  });

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de Incumplimientos</h2>
      <div className="space-y-4">
        {nonComplianceData.map((item) => {
          // Obtener el incumplimiento normalizado
          const compliance = normalizedIncumplimientos.find(
            (inc) => inc.tipo.trim().toLowerCase() === item.tipo.trim().toLowerCase()
          );
          const isSelected = compliance.aprobado;

          return (
            <div key={item.id} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => {
                    // Si está deshabilitado no se permite cambiar el valor
                    if (disabled) return;
                    setIncumplimientos((prev) =>
                      prev.some((inc) => inc.tipo === compliance.tipo)
                        ? prev.map((inc) => (inc.tipo === compliance.tipo ? { ...inc, aprobado: !inc.aprobado } : inc))
                        : [...prev, { tipo: compliance.tipo, aprobado: true }]
                    );
                  }}
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
