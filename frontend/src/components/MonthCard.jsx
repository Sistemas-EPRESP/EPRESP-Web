import { useNavigate } from "react-router-dom";
import { monthNames } from "../utils/dateUtils";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const MonthCard = ({ month, status, submitted, idRendicion }) => {
  const { cooperativa } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook para la navegación

  // Mapeo de status a etiquetas y estilos (badgeClass)
  const statusStyles = {
    Aprobado: { label: "Aprobado", badgeClass: "bg-green-100 text-green-700" },
    Pendiente: { label: "Pendiente", badgeClass: "bg-yellow-100 text-yellow-700" },
    Incumplimiento: { label: "Incumplimiento", badgeClass: "bg-red-100 text-red-700" },
    "Pendiente de Pago": { label: "Pendiente de Pago", badgeClass: "bg-gray-100 text-gray-700" },
    "Falta de Presentacion": { label: "Falta de Presentacion", badgeClass: "bg-gray-100 text-gray-700" },
  };

  // Se obtiene el estilo actual según el status recibido; se asigna un valor por defecto en caso de no existir
  const currentStatus = statusStyles[status] || { label: status, badgeClass: "bg-gray-100 text-gray-700" };

  const baseClasses =
    "p-3 sm:p-4 rounded-lg border border-gray-200 flex items-center justify-between transition-all w-full text-left";
  const contentClasses = submitted ? "" : "text-gray-400 line-through";
  const hoverClasses = submitted
    ? "hover:shadow-md hover:scale-105 hover:border-gray-300 cursor-pointer"
    : "cursor-default";

  // Función que maneja el clic en la tarjeta
  const handleCardClick = () => {
    if (!idRendicion) return;

    const path =
      cooperativa.tipo === "cooperativa" ? `/rendiciones/${idRendicion}` : `/administrador/rendiciones/${idRendicion}`;

    navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleCardClick}
      className={`${baseClasses} ${hoverClasses}`}
      // Atributo ARIA para describir la tarjeta
      aria-label={`Mes ${monthNames[month - 1]}, ${submitted ? currentStatus.label : "Sin rendición"}`}
    >
      <span className={`text-xs sm:text-sm font-medium ${contentClasses}`}>{monthNames[month - 1]}</span>
      {submitted && (
        <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${currentStatus.badgeClass}`}>
          {currentStatus.label}
        </span>
      )}
    </button>
  );
};

export default MonthCard;
