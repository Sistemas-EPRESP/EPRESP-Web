import { useNavigate } from "react-router-dom";
import { monthNames } from "../utils/dateUtils"; // Ajusta la ruta según tu estructura
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const MonthCard = ({ month, approved, submitted, idRendicion }) => {
  const { cooperativa } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para la navegación

  const baseClasses =
    "p-3 sm:p-4 rounded-lg border border-gray-200 flex items-center justify-between transition-all";
  const contentClasses = submitted ? "" : "text-gray-400 line-through";
  const hoverClasses = submitted
    ? "hover:shadow-md hover:scale-105 hover:border-gray-300 cursor-pointer"
    : "";

  const handleCardClick = () => {
    if (!idRendicion) return;

    const path =
      cooperativa.tipo === "cooperativa"
        ? `/rendiciones/${idRendicion}`
        : `/administrador/rendiciones/${idRendicion}`;

    navigate(path);
  };

  return (
    <div className={`${baseClasses} ${hoverClasses}`} onClick={handleCardClick}>
      <span className={`text-xs sm:text-sm font-medium ${contentClasses}`}>
        {monthNames[month - 1]}
      </span>
      {submitted && (
        <span
          className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
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
