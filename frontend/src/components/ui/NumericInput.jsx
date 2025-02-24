import { useState, useEffect, useRef } from "react";

const NumericInput = ({
  value = "0.00",
  onChange,
  disabled = false,
  onEnter,
}) => {
  const inputRef = useRef(null);
  const [internalValue, setInternalValue] = useState(formatValue(value));

  useEffect(() => {
    setInternalValue(formatValue(value));
  }, [value]);

  function formatValue(val) {
    if (val === "" || isNaN(val)) return "0.00";
    const num = parseFloat(val);
    return num % 1 === 0 ? `${num}.00` : num.toFixed(2);
  }

  function handleChange(event) {
    let newValue = event.target.value.replace(/[^0-9.]/g, ""); // Solo números y punto
    if (newValue.startsWith(".")) newValue = "0" + newValue; // Corrige ".5" a "0.5"
    if (newValue.split(".").length > 2) return; // Evita múltiples puntos decimales
    setInternalValue(newValue);
    onChange && onChange(newValue); // Notifica el cambio
  }

  function handleFocus(event) {
    event.target.select(); // Selecciona todo el contenido al hacer clic
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Evita el salto de línea en inputs
      onEnter && onEnter(); // Llama la función para moverse a la siguiente celda
    }
  }

  return (
    <div className="relative w-full">
      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
        $
      </span>
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full pl-5 pr-2 py-1 text-left rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
      />
    </div>
  );
};

export default NumericInput;
