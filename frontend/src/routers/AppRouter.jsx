import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus páginas desde la carpeta pages
import Home from '../pages/Home';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Home />} />
        {/* Ruta de ejemplo para otra página */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
