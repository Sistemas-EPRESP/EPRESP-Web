import { useState } from "react";
import FormularioRendicion from "../components/forms/FormularioRendicion";
import PeriodoRendiciones from "../components/tables/PeriodoRendiciones";

const RendicionPage = () => {
  const [mes, setMes] = useState();

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 mb-8">
      <FormularioRendicion setMes={setMes} />
      <PeriodoRendiciones selectedMonth={mes} />
    </div>
  );
};

export default RendicionPage;
