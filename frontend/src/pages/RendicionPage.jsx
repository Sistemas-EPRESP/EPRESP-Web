import { useState } from "react";
import FormularioRendicion from "../components/forms/FormularioRendicion";
import PeriodoRendiciones from "../components/tables/PeriodoRendiciones";

const RendicionPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("01");

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 mb-8">
      <FormularioRendicion setSelectedMonth={setSelectedMonth} />
      <PeriodoRendiciones selectedMonth={selectedMonth} />
    </div>
  );
};

export default RendicionPage;
