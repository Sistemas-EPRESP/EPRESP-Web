import { useState, useRef, useEffect } from "react";

const TextInput = ({ value = "", onChange, disabled = false }) => {
  const inputRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (inputRef.current) {
        setShowTooltip(
          inputRef.current.scrollWidth > inputRef.current.clientWidth
        );
      }
    };

    checkOverflow();
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      title={showTooltip ? value : ""} // Agrega el tooltip solo si el contenido es más grande que el input
      className={`w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
    />
  );
};

export default TextInput;
