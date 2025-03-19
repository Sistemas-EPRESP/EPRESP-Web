import nonComplianceData from "../data/nonComplianceData";

const SancionesIncumplimientos = ({ incumplimientos }) => {
  if (!incumplimientos || incumplimientos.length === 0) return null;

  // Filtrar los incumplimientos aprobados
  const aprobados = incumplimientos.filter((inc) => inc.aprobado);

  if (aprobados.length === 0) return null;

  // Mapear cada incumplimiento aprobado al objeto correspondiente de nonComplianceData
  const sancionesData = aprobados
    .map((inc) => nonComplianceData.find((item) => item.tipo.trim().toLowerCase() === inc.tipo.trim().toLowerCase()))
    .filter((item) => item !== undefined);

  if (sancionesData.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400">
      <h3 className="text-sm font-semibold text-red-800 mb-2">Sanciones</h3>
      {/* Lista principal con viñetas */}
      <ul className="list-disc pl-5 text-red-800 text-sm">
        {sancionesData.map((item) => (
          <li key={item.id} className="mb-2">
            <span className="font-medium">{item.label}:</span>
            {/* Lista anidada con letras */}
            <ul style={{ listStyleType: "lower-alpha" }} className="pl-4">
              {item.sanctions.map((sanction) => (
                <li key={sanction.id}>{sanction.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SancionesIncumplimientos;
