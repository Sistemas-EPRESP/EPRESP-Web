import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/AdminPage";

const AdminRoutes = () => (
  <Routes>
    <Route path="rendiciones" element={<AdminPage />} />
    {/* <Route path="dashboard" element={<Dashboard />} />
    <Route path="usuarios" element={<UserManagement />} />
    <Route path="configuracion" element={<Settings />} />
    <Route path="*" element={<NotFound />} /> */}
  </Routes>
);

export default AdminRoutes;
