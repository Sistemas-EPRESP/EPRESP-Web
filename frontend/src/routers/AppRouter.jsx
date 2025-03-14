import { Routes, Route } from "react-router-dom";
import LogIn from "../pages/LogIn";
import AdminPage from "../pages/AdminPage";
import CooperativaRendicionesPage from "../pages/CooperativaRendicionesPage";
import ProtectedRoute from "./ProtectedRoute";
import RendicionPage from "../pages/RendicionPage";
import FormularioRendicionAdmin from "../components/forms/FormularioRendicionAdmin";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path="/iniciar_sesion" element={<LogIn />} />

      {/* Rutas protegidas para cooperativa */}
      <Route element={<ProtectedRoute allowedRoles={["cooperativa"]} />}>
        <Route path="/rendiciones" element={<CooperativaRendicionesPage />} />
        <Route path="/formulario/rendicion" element={<RendicionPage />} />
        <Route path="/rendiciones/:id" element={<RendicionPage />} />
      </Route>

      {/* Rutas protegidas para administrador */}
      <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
        <Route path="/administrador/rendiciones" element={<AdminPage />} />
        <Route path="/administrador/rendiciones/:id" element={<FormularioRendicionAdmin />} />
      </Route>

      {/* Ruta comodín para manejar rutas inexistentes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
