import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import ProtectedRoute from "./ProtectedRoute";
import RendicionPage from "../pages/RendicionPage";
import AdminPage from "../pages/AdminPage";
import ControlResolucionPage from "../pages/ControlResolucionPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/rendicion_admin" element={<AdminPage />} />
      <Route path="/control_resolucion" element={<ControlResolucionPage />} />
      <Route
        path="formulario/formulario_rendicion"
        element={
          <ProtectedRoute>
            <RendicionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
