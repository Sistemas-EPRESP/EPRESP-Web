import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, cooperativa, loading } = useContext(AuthContext);

  // Muestra un indicador de carga mientras se valida la sesión
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario no está autenticado, se redirige a iniciar_sesion
  if (!isAuthenticated) {
    return <Navigate to="/iniciar_sesion" replace />;
  }

  // Si el rol del usuario no se encuentra en los permitidos, se redirige a una página de no autorizado
  if (!allowedRoles.includes(cooperativa?.tipo)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // ProtectedRoute.jsx (fragmento de depuración)
  console.log("isAuthenticated:", isAuthenticated);

  return <Outlet />;
};

export default ProtectedRoute;
