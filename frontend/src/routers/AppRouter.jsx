import { Routes, Route } from "react-router-dom";
import LogIn from "../pages/LogIn";
import Home from "../pages/Home";
import AdminPage from "../pages/AdminPage";
import CooperativaRendicionesPage from "../pages/CooperativaRendicionesPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LogIn />} />
      <Route path="/" element={<Home />} />

      {/* Rutas para cooperativa */}
      <Route element={<ProtectedRoute allowedRoles={["cooperativa"]} />}>
        <Route path="/rendiciones" element={<CooperativaRendicionesPage />} />
      </Route>

      {/* Rutas para administrador */}
      <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
        <Route path="/administrador/rendiciones" element={<AdminPage />} />
      </Route>

      {/* Ruta por defecto para manejar rutas no encontradas */}
      {/* <Route path="*" element={<NoAutorizado />} /> */}
    </Routes>
  );
};

export default AppRouter;
