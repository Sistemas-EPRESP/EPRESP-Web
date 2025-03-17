import { useState, useEffect } from "react";

const TextInputTable = ({ name, value, onChange, disabled = false, placeholder = "", className = "", ...rest }) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(newValue);
    }
  };

  // Agregamos onFocus para seleccionar todo el contenido
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
      } ${className}`}
      {...rest}
    />
  );
};

export default TextInputTable;
