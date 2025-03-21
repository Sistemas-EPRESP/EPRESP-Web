import { useState, useEffect } from "react";

const TextInput = ({ name, value, onChange, disabled = false, placeholder = "" }) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      // Se envía el objeto { name, value } para mantener consistencia
      onChange({ name, value: newValue });
    } else {
      setInternalValue(newValue);
    }
  };

  // Al recibir foco, se selecciona todo el contenido
  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <input
      type="text"
      name={name}
      value={value !== undefined ? value : internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
      }`}
    />
  );
};

export default TextInput;
