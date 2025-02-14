import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Mientras se verifica la sesión, muestra un loader
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
