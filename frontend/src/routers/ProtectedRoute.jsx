import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, cooperativa } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(cooperativa?.tipo)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
