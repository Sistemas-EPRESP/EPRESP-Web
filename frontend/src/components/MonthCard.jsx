import { useNavigate } from "react-router-dom";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MonthCard = ({ month, approved, submitted }) => {
  const navigate = useNavigate(); // Hook para la navegación

  const baseClasses =
    "p-3 sm:p-4 rounded-lg border border-gray-200 flex items-center justify-between transition-all";
  const contentClasses = submitted ? "" : "text-gray-400 line-through";
  const hoverClasses = submitted
    ? "hover:shadow-md hover:scale-105 hover:border-gray-300 cursor-pointer"
    : "";

  const handleCardClick = () => {
    // Redirige a la página de ControlResolucionPage
    navigate(`/administrador/rendiciones/${1}`);
  };

  return (
    <div
      className={`${baseClasses} ${hoverClasses}`}
      onClick={handleCardClick} // Agrega el manejador de clics
    >
      <span className={`text-xs sm:text-sm font-medium ${contentClasses}`}>
        {monthNames[month - 1]}
      </span>
      {submitted && (
        <span
          className={`text-[10px] sm:text-xs px-2 py-1 rounded-full
          ${
            approved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {approved ? "Aprobado" : "Pendiente"}
        </span>
      )}
    </div>
  );
};

export default MonthCard;
