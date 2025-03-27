import { Link, useLocation, useParams } from "react-router-dom";
import { useRendiciones } from "../context/RendicionesContext";
import { monthNames } from "../utils/dateUtils";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { id } = useParams();
  const { rendiciones } = useRendiciones();

  // Buscar la rendición en el contexto si existe un ID en la URL
  const rendicion = rendiciones.find((r) => r.id === Number(id));
  console.log("Rendición encontrada:", rendicion);

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Inicio
          </Link>
        </li>
        {pathnames.map((value, index) => {
          let label = decodeURIComponent(value);
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Caso especial para formularios de rendiciones
          if (
            id &&
            rendicion &&
            (location.pathname.includes("/rendiciones/") || location.pathname.includes("/administrador/rendiciones/"))
          ) {
            label = `Formulario ${monthNames[rendicion.periodo_mes - 1]} ${rendicion.periodo_anio}`;
          }

          return (
            <li key={to} className="flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-700">{label}</span>
              ) : (
                <Link to={to} className="text-blue-500 hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
