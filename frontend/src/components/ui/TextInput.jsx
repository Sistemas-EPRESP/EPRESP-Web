import { useState } from "react";

const TextInput = ({ name, value, onChange, disabled = false, placeholder = "" }) => {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = e.target.value;

    if (onChange) {
      onChange({ name, value: newValue }); // Ahora enviamos un objeto { name, value }
    } else {
      setInternalValue(newValue); // Si no hay onChange, usa su propio estado
    }
  };

  return (
    <input
      type="text"
      name={name}
      value={value !== undefined ? value : internalValue} // Permite ser controlado o no
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
      }`}
    />
  );
};

export default TextInput;
