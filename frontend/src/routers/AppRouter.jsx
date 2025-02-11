import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import FormularioRendicion from '../pages/FormularioRendicion';
import LogIn from '../pages/LogIn';

const AppRouter = () => {
  const cooperativa = { distribuidor: 'Cooperativa de Trelew', cuit: '30-12345678-9' };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn/>} />
      <Route path="/formulario_rendicion" element={<FormularioRendicion {...cooperativa} />} />
    </Routes>
  );
};

export default AppRouter;
