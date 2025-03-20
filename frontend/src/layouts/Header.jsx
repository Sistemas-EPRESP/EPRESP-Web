import { Link } from "react-router-dom";
import Logo from "../assets/chubut.svg";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { logout, isAuthenticated, cooperativa } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
  }, [cooperativa]);

  // Función que ejecuta el logout y redirige a /iniciar_sesion
  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/iniciar_sesion");
  };

  // Define la letra del avatar según el tipo de cooperativa:
  // Si es "administrador" muestra "A", de lo contrario muestra "C"
  const avatarLetter = cooperativa && cooperativa.tipo === "administrador" ? "A" : "C";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-8" />
          </Link>
        </div>

        {/* Avatar y menú desplegable (solo si el usuario está autenticado) */}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-xl font-bold"
            >
              {avatarLetter}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
