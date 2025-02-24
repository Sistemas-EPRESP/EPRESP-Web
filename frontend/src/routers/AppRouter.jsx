import { Routes, Route } from "react-router-dom";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import AdminPage from "../pages/AdminPage";
import CooperativaRendicionesPage from "../pages/CooperativaRendicionesPage";
import ProtectedRoute from "./ProtectedRoute";
import RendicionPage from "../pages/RendicionPage";
import FormularioRendicionAdmin from "../components/forms/FormularioRendicionAdmin";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/" element={<Home />} />

      {/* Rutas para cooperativa */}
      <Route element={<ProtectedRoute allowedRoles={["cooperativa"]} />}>
        <Route path="/rendiciones" element={<CooperativaRendicionesPage />} />
        <Route path="/formulario/rendicion" element={<RendicionPage />} />
      </Route>

      {/* Rutas para administrador */}
      <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
        <Route path="/administrador/rendiciones" element={<AdminPage />} />
        <Route
          path="/administrador/rendiciones/:id"
          element={<FormularioRendicionAdmin />}
        />
      </Route>

      {/* Ruta por defecto para manejar rutas no encontradas */}
      {/* <Route path="*" element={<NoAutorizado />} /> */}
    </Routes>
  );
};

export default AppRouter;
