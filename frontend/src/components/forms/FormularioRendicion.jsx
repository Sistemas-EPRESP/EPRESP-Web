import React from "react";

const FormularioRendicion = ({
  cooperativa,
  currentYear,
  years,
  selectedYear,
  handleYearChange,
  handleSubmit,
  mensaje,
}) => {
  const formatCUIT = (cuit) => {
    const cuitStr = cuit.toString(); // Convertir el número a string
    if (cuitStr.length === 11) {
      return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(
        10
      )}`;
    }
    return cuitStr; // Si no tiene el largo correcto, devolvemos el cuit tal cual está
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 pb-2 border-b">
        Formulario de Rendición de la Tasa de Fiscalización y Control
      </h2>

      <div className="bg-gray-100 p-4 rounded-md mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Distribuidor</h3>
            <p className="text-lg font-semibold text-gray-900">
              {cooperativa.nombre}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">CUIT</h3>
            <p className="text-lg font-semibold text-gray-900">
              {formatCUIT(cooperativa.cuit)} {/* Formateamos el CUIT aquí */}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Fecha de Rendición (actual y deshabilitada) */}
          <div className="space-y-2">
            <label
              htmlFor="fecha_rendicion"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Rendición
            </label>
            <div className="relative">
              <input
                type="date"
                id="fecha_rendicion"
                name="fecha_rendicion"
                value={new Date().toISOString().split("T")[0]}
                disabled
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="fecha_transferencia"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Transferencia
            </label>
            <div className="relative">
              <input
                type="date"
                id="fecha_transferencia"
                name="fecha_transferencia"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="periodo_rendicion"
              className="block text-sm font-medium text-gray-700"
            >
              Período de Rendición Mes
            </label>
            <select
              id="periodo_rendicion"
              name="periodo_rendicion"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
            >
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="anio"
              className="block text-sm font-medium text-gray-700"
            >
              Periodo de Rendición Año
            </label>
            <select
              id="anio"
              name="anio"
              value={selectedYear}
              onChange={handleYearChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resto del formulario... */}

        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enviar Formulario
          </button>
        </div>
      </form>

      {mensaje && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <p className="text-green-700">{mensaje}</p>
        </div>
      )}

      <p className="mt-6 text-sm text-gray-500 italic">
        La información suministrada en este formulario tiene carácter de
        declaración jurada.
      </p>
    </div>
  );
};

export default FormularioRendicion;
