import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  // Separamos los segmentos de la URL y eliminamos los vacíos
  let pathnames = location.pathname.split("/").filter((x) => x);

  // Si el primer segmento es "administrador", lo eliminamos de la visualización
  // pero lo guardamos en el prefijo para reconstruir el enlace completo
  let prefix = "";
  if (pathnames[0] === "administrador") {
    prefix = "/administrador";
    pathnames = pathnames.slice(1); // removemos el primer elemento
  }

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <ul className="flex space-x-2">
        {/* Enlace a la página de inicio */}
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Inicio
          </Link>
        </li>
        {pathnames.map((value, index) => {
          // Se reconstruye la ruta acumulada utilizando el prefijo si es necesario
          const to = prefix + "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          // Por defecto, se muestra el valor decodificado del segmento
          let displayValue = decodeURIComponent(value);

          // Si el segmento anterior es "rendiciones", se asume que el valor actual es un id
          // y se reemplaza por la palabra "Rendición"
          if (index > 0 && pathnames[index - 1].toLowerCase() === "rendiciones") {
            displayValue = "rendición";
          }

          return (
            <li key={to} className="flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-gray-700">{displayValue}</span>
              ) : (
                <Link to={to} className="text-blue-500 hover:underline">
                  {displayValue}
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
