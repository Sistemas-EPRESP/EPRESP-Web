import { useState, useEffect, forwardRef } from "react";

const NumericInput = forwardRef(({ name, value = "0.00", onChange, disabled = false }, ref) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const triggerOnChange = (newValue) => {
    if (onChange) {
      if (name !== undefined) {
        onChange({ target: { name, value: newValue } });
      } else {
        onChange(newValue);
      }
    }
  };

  // Formatea el valor a 2 decimales
  const formatValue = (val) => {
    const numberValue = parseFloat(val);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(2);
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

  const handleBlur = () => {
    const formatted = formatValue(internalValue);
    setInternalValue(formatted);
    triggerOnChange(formatted);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const formatted = formatValue(internalValue);
      setInternalValue(formatted);
      triggerOnChange(formatted);
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`w-full pl-2 pr-2 py-1 text-left rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
      }`}
    />
  );
});

NumericInput.displayName = "NumericInput";

export default NumericInput;
