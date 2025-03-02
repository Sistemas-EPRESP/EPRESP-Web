import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/AxiosConfig";
import FormularioRendicion from "../components/forms/FormularioRendicion";

const ControlResolucionPage = () => {
  const { cooperativa } = useContext(AuthContext);

  const [demandas] = useState({
    residencial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    comercial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    industrial: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    grandes_usuarios: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    contratos: {
      facturacion: 0,
      percibido: 0,
      transferido: 0,
      observaciones: "",
    },
    otros: { facturacion: 0, percibido: 0, transferido: 0, observaciones: "" },
  });

  const demandasPayload = {};
  Object.keys(demandas).forEach((categoria) => {
    demandasPayload[categoria] = {
      facturacion: demandas[categoria].facturacion,
      total_tasa_fiscalizacion: Number(demandas[categoria].facturacion) * 0.01,
      total_percibido: demandas[categoria].percibido,
      total_transferido: demandas[categoria].transferido,
      observaciones: demandas[categoria].observaciones || "Ninguna",
    };
  });

  const rendicion = {
    fecha_rendicion: "20/20/2020",
    fecha_transferencia: "20/20/2020",
    periodo_mes: 5,
    periodo_anio: 2025,
    tasa_fiscalizacion_letras: "hola",
    tasa_fiscalizacion_numero: 10.25,
    total_transferencia_letras: "mundo",
    total_transferencia_numero: 10.25,
    demandas: demandasPayload,
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 mb-8">
      {!cooperativa ? (
        <p>
          No se encontró la cooperativa asociada o no se ha iniciado sesión.
        </p>
      ) : (
        <>
          <FormularioRendicion
            cooperativa={cooperativa}
            currentYear={currentYear}
            years={years}
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            handleSubmit={handleSubmit}
            mensaje={mensaje}
            demandas={demandas}
            handleDemandaChange={handleDemandaChange}
          />
        </>
      )}
    </div>
  );
};

export default ControlResolucionPage;
