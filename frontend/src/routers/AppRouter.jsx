import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import FormularioRendicion from '../pages/FormularioRendicion';
import LogIn from '../pages/LogIn';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<LogIn />} />
      <Route path="/formulario_rendicion" element={
        <ProtectedRoute>
          <FormularioRendicion />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouter;
