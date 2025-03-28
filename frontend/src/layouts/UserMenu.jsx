import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, isAuthenticated, cooperativa } = useContext(AuthContext);
  const navigate = useNavigate();

  // Alterna el despliegue del menú
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // Nota: La dependencia cooperativa se removió porque no afecta el evento
  }, []);

  // Función que ejecuta el logout y redirige a /iniciar_sesion
  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/iniciar_sesion");
  };

  // Si el usuario no está autenticado, no renderizar nada
  if (!isAuthenticated) {
    return null;
  }

  // Determinar el texto a mostrar junto al icono, con fallback si ciudad no está definida
  const displayText = cooperativa?.tipo === "administrador" ? "Administrador" : cooperativa?.ciudad || "Usuario";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-white hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors duration-200 focus:outline-none"
        aria-label="Menu de usuario"
      >
        {displayText && <span className="mr-2 text-sm font-medium">{displayText}</span>}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-xl border border-gray-200 overflow-hidden transition-all duration-200 ease-in-out z-20">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
