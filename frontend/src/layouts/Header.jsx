import { Link } from "react-router-dom";
import Logo from "../assets/chubut.svg";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función que ejecuta el logout y redirige a /iniciar_sesion
  const handleLogout = async () => {
    await logout();
    navigate("/iniciar_sesion");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-8" /> {/* Ajusta el tamaño según sea necesario */}
          </Link>
        </div>

        {/* Botón de cerrar sesión (visible solo si el usuario está autenticado) */}
        {isAuthenticated && (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
}
