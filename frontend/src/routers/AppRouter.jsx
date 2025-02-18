import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import AdminRoutes from "./AdminRoutes";
import CooperativaRoutes from "./CooperativaRoutes";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LogIn />} />

      {/* Ruta protegida para administradores */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["administrador"]}
          >
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Ruta protegida para cooperativas */}
      <Route
        path="/cooperativa/*"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["cooperativa"]}
          >
            <CooperativaRoutes />
          </ProtectedRoute>
        }
      />

      {/* Ruta para la página de inicio */}
      <Route path="/" element={<Home />} />

      {/* Ruta para manejar rutas no encontradas */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRouter;
