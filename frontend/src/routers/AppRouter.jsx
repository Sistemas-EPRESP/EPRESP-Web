import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import ProtectedRoute from "./ProtectedRoute";
import RendicionPage from "../pages/RendicionPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
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
