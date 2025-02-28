import { useState, useEffect, useRef, forwardRef } from "react";

const NumericInput = forwardRef(({ name, value = "0.00", onChange, disabled = false, onEnter }, ref) => {
  const inputRef = useRef(null);

  // Combina la ref interna con la ref pasada por forwardRef.
  const setRefs = (el) => {
    inputRef.current = el;
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  // Estado interno para el valor del input.
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Función auxiliar para llamar a onChange.
  const triggerOnChange = (newValue) => {
    if (onChange) {
      if (name !== undefined) {
        onChange({ target: { name, value: newValue } });
      } else {
        onChange(newValue);
      }
    }
  };

  // Función para formatear el valor a 2 decimales.
  const formatValue = (val) => {
    const numberValue = parseFloat(val);
    return isNaN(numberValue) ? "0.00" : numberValue.toFixed(2);
  };

  // Maneja el cambio permitiendo solo números y punto, limitando a 2 decimales.
  const handleChange = (event) => {
    let newValue = event.target.value.replace(/[^0-9.]/g, "");
    if (newValue.startsWith(".")) newValue = "0" + newValue;

    const parts = newValue.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      newValue = parts.join(".");
    }

    setInternalValue(newValue);
    triggerOnChange(newValue);
  };

  // Al enfocar, se selecciona el contenido del input.
  const handleFocus = (event) => {
    event.target.select();
  };

  // Al perder el foco, se formatea el valor a 2 decimales.
  const handleBlur = () => {
    const formatted = formatValue(internalValue);
    setInternalValue(formatted);
    triggerOnChange(formatted);
  };

  // Al presionar Enter, se formatea el valor a 2 decimales y se llama onEnter.
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const formatted = formatValue(internalValue);
      setInternalValue(formatted);
      triggerOnChange(formatted);
      onEnter && onEnter();
    }
  };

  return (
    <input
      ref={setRefs}
      type="text"
      name={name}
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
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
