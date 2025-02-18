// RendicionesRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminPage from "../pages/AdminPage";
import CooperativaRendicionesPage from "../pages/CooperativaRendicionesPage";

const RendicionesRoute = () => {
  const { cooperativa } = useContext(AuthContext);

  // Si por alguna razón no existe la información del usuario, podrías mostrar un loader o redirigir
  if (!cooperativa) return null;

  return cooperativa.tipo === "administrador" ? (
    <AdminPage />
  ) : (
    <CooperativaRendicionesPage />
  );
};

export default RendicionesRoute;
