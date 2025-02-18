import { Routes, Route } from "react-router-dom";
import CooperativaRendicionesPage from "../pages/CooperativaRendicionesPage";
import { useEffect } from "react";

const CooperativaRoutes = () => {
  useEffect(() => {
    console.log("Entró en CooperativaRoutes");
  }, []);

  return (
    <Routes>
      <Route path="rendiciones" element={<CooperativaRendicionesPage />} />
      {/* <Route path="perfil" element={<Profile />} /> */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default CooperativaRoutes;
