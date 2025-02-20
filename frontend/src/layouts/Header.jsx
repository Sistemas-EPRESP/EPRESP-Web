import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 w-full">
        {/* Logo */}
        <div className="flex-none">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Logo</span>
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Inicio
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1 focus:outline-none">
              <span>Formularios</span>
              {/* Icono eliminado */}
            </button>
            <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to="/formularios/rendiciones"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Rendiciones
              </Link>
              <Link
                to="/formularios/rendicion"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Rendición
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex flex-none items-center justify-end space-x-4">
          {/* Dropdown básico de Usuario */}
          <div className="relative group">
            <button className="h-8 w-8 rounded-full bg-gray-300 focus:outline-none">
              {/* Icono eliminado */}
              <span className="sr-only">Cuenta</span>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100">
                Perfil
              </Link>
              <Link
                to="/configuracion"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Configuración
              </Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="h-8 w-8 bg-gray-300 focus:outline-none">
              {/* Icono eliminado */}
              <span>Menú</span>
              <span className="sr-only">Toggle menu</span>
            </button>
            {/* Aquí podrías agregar la lógica para mostrar el menú móvil */}
          </div>
        </div>
      </div>
    </header>
  );
}
