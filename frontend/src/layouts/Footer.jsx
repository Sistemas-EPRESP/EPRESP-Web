export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p className="flex items-center">P0800-555-0000</p>
              <p className="flex items-center">contacto@admin.gob.ar</p>
              <p className="flex items-center">Av. Principal 1234, Capital Federal</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
            <p>Lunes a Viernes</p>
            <p>8:00 - 16:00</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-300">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 Administración Nacional de Servicios Sociales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
