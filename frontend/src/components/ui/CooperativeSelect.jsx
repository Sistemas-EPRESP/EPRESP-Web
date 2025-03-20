// Componente reutilizable para seleccionar una cooperativa
const CooperativeSelect = ({
  cooperatives, // Arreglo de cooperativas
  selectedCooperative, // Valor seleccionado actualmente
  onChange, // Función para manejar el cambio de selección
  label = "Seleccionar Cooperativa", // Texto del label (puede ser personalizado)
  id = "cooperative", // Id para asociar el label al select
}) => {
  return (
    <div className="flex flex-col">
      {/* Etiqueta para el select */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {/* Select de cooperativas */}
      <select
        id={id}
        value={selectedCooperative}
        onChange={onChange}
        className="w-full max-w-lg px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
      >
        <option value="">Seleccione una cooperativa</option>
        {cooperatives.map((coop) => (
          <option key={coop.id} value={coop.id}>
            {coop.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CooperativeSelect;
