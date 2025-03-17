import { useState, useEffect, forwardRef } from "react";

const NumericInput = forwardRef(({ name, value = 0, onChange, disabled = false }, ref) => {
  // Se formatea el valor a 2 decimales si es numérico
  const getFormattedValue = (val) => {
    const parsed = parseFloat(val);
    return !isNaN(parsed) ? parsed.toFixed(2) : "";
  };

  const [internalValue, setInternalValue] = useState(typeof value === "number" ? value.toFixed(2) : value);
  const [isFocused, setIsFocused] = useState(false);

  // Actualizamos el valor interno solo si el input no está enfocado
  useEffect(() => {
    if (!isFocused) {
      setInternalValue(typeof value === "number" ? value.toFixed(2) : value);
    }
  }, [value, isFocused]);

  // Propaga el cambio al componente padre
  const triggerOnChange = (newVal) => {
    if (onChange) {
      const num = parseFloat(newVal);
      const valueToSend = isNaN(num) ? 0 : num;
      onChange({ target: { name, value: valueToSend } });
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value.replace(/[^0-9.]/g, "");
    if (newValue.startsWith(".")) newValue = "0" + newValue;
    const parts = newValue.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      newValue = parts.join(".");
    }
    setInternalValue(newValue);
    triggerOnChange(newValue);
  };

  // Al recibir foco, se selecciona todo el contenido
  const handleFocus = (e) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    const formatted = getFormattedValue(internalValue);
    setInternalValue(formatted);
    triggerOnChange(formatted);
    setIsFocused(false);
  };

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      className={`w-full pl-2 pr-2 py-1 text-left rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
      }`}
    />
  );
});

NumericInput.displayName = "NumericInput";

export default NumericInput;
