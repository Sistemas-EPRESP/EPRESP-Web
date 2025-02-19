import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/AxiosConfig";
import FormularioRendicion from "../components/forms/FormularioRendicion";
import PeriodoRendiciones from "../components/PeriodoRendiciones";

const RendicionPage = () => {
  const { cooperativa } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 + 1 },
    (_, index) => 2019 + index
  );

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [mensaje, setMensaje] = useState("");
  const [demandas, setDemandas] = useState({
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleDemandaChange = (categoria, campo, valor) => {
    setDemandas((prev) => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: campo === "observaciones" ? valor : Number(valor),
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cooperativa || !cooperativa.idCooperativa) {
      setMensaje("Error: No se encontró la cooperativa.");
      return;
    }

    const fechaActual = new Date().toISOString().split("T")[0];
    const data = new FormData(event.target);

    const demandasPayload = {};
    Object.keys(demandas).forEach((categoria) => {
      demandasPayload[categoria] = {
        facturacion: demandas[categoria].facturacion,
        total_tasa_fiscalizacion:
          Number(demandas[categoria].facturacion) * 0.01,
        total_percibido: demandas[categoria].percibido,
        total_transferido: demandas[categoria].transferido,
        observaciones: demandas[categoria].observaciones || "Ninguna",
      };
    });

    const rendicion = {
      fecha_rendicion: fechaActual,
      fecha_transferencia: data.get("fecha_transferencia"),
      periodo_mes: parseInt(data.get("periodo_rendicion"), 10),
      periodo_anio: parseInt(selectedYear, 10),
      tasa_fiscalizacion_letras: data.get("total_tasa_letras") || "",
      tasa_fiscalizacion_numero: parseFloat(data.get("total_tasa")) || 0,
      total_transferencia_letras: data.get("total_transferencia_letras") || "",
      total_transferencia_numero:
        parseFloat(data.get("total_transferencia")) || 0,
      demandas: demandasPayload,
    };

    try {
      const response = await axiosInstance.post(
        `/formulario-rendicion/${cooperativa.idCooperativa}`,
        { rendicion }
      );

      if (response.status === 201 || response.status === 200) {
        setMensaje("Formulario enviado correctamente.");
        event.target.reset();
      }
    } catch (error) {
      console.log(error);

      setMensaje(
        error.response?.data?.message || "Error al enviar la rendición."
      );
    }
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
          <PeriodoRendiciones />
        </>
      )}
    </div>
  );
};

export default RendicionPage;
