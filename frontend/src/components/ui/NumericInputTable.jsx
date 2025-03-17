import { useState, useEffect, forwardRef } from "react";

const NumericInputTable = forwardRef(
  ({ name, value = 0, onChange, disabled = false, onKeyDown, className = "" }, ref) => {
    // Función auxiliar para formatear el valor a 2 decimales si es numérico
    const getFormattedValue = (val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) ? parsed.toFixed(2) : "";
    };

    const [internalValue, setInternalValue] = useState(getFormattedValue(value) || value);
    const [isFocused, setIsFocused] = useState(false);

    // Actualizamos el valor interno solo cuando el input no está enfocado
    useEffect(() => {
      if (!isFocused) {
        setInternalValue(getFormattedValue(value) || value);
      }
    }, [value, isFocused]);

    const triggerOnChange = (newVal) => {
      if (onChange) {
        const parsed = parseFloat(newVal);
        const valueToSend = isNaN(parsed) ? 0 : parsed;
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

    // Actualizamos el onFocus para seleccionar todo el contenido
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
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`w-full pl-2 pr-2 py-1 text-left rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className} ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
      />
    );
  }
);

NumericInputTable.displayName = "NumericInputTable";

export default NumericInputTable;
