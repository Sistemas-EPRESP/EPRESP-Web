import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import ProtectedRoute from "./ProtectedRoute";
import RendicionPage from "../pages/RendicionPage";
import ControlResolucionPage from "../pages/ControlResolucionPage";
import RendicionesRoute from "./RendicionesRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/control_resolucion" element={<ControlResolucionPage />} />

      {/* Ruta única para rendiciones, donde se decide qué componente mostrar */}
      <Route
        path="/rendiciones"
        element={
          <ProtectedRoute>
            <RendicionesRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/formulario/formulario_rendicion"
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
