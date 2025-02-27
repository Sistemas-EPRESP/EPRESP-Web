import { useState, useEffect, useRef, forwardRef } from "react";
import { formatPesos } from "../../utils/formatPesos";

const NumericInput = forwardRef(({ name, value = "0.00", onChange, disabled = false, onEnter }, ref) => {
  const inputRef = useRef(null);

  // Combina la ref interna con la ref pasada por forwardRef
  const setRefs = (el) => {
    inputRef.current = el;
    if (typeof ref === "function") {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  // Estado interno del valor
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Función auxiliar para llamar a onChange de forma compatible
  const triggerOnChange = (newValue) => {
    if (onChange) {
      if (name !== undefined) {
        onChange({ target: { name, value: newValue } });
      } else {
        onChange(newValue);
      }
    }
  };

  // Maneja el cambio mientras se escribe, permitiendo solo números y punto.
  const handleChange = (event) => {
    let newValue = event.target.value.replace(/[^0-9.]/g, ""); // Permite solo números y punto
    if (newValue.startsWith(".")) newValue = "0" + newValue; // Corrige ".5" a "0.5"

    // Limitar a 2 decimales si existe un punto
    const parts = newValue.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      newValue = parts.join(".");
    }

    setInternalValue(newValue);
    triggerOnChange(newValue);
  };

  // Al enfocar, si el valor está formateado (contiene "$") se convierte al valor plano para facilitar la edición.
  const handleFocus = (event) => {
    if (internalValue.includes("$")) {
      const plain = internalValue.replace("$", "").replace(/\./g, "").replace(",", ".");
      setInternalValue(plain);
    }
    event.target.select();
  };

  // Al perder el foco, se formatea el número a pesos argentinos usando la función util.
  const handleBlur = () => {
    const numberValue = parseFloat(internalValue);
    if (!isNaN(numberValue)) {
      const formatted = formatPesos(numberValue);
      setInternalValue(formatted);
      triggerOnChange(formatted);
    }
  };

  // Al presionar Enter se valida el valor y se formatea
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      let newVal = internalValue;
      if (!newVal.includes(".")) {
        newVal = newVal + ".00";
        setInternalValue(newVal);
        triggerOnChange(newVal);
      }
      onEnter && onEnter();

      const numberValue = parseFloat(newVal);
      if (!isNaN(numberValue)) {
        const formatted = formatPesos(numberValue);
        setInternalValue(formatted);
        triggerOnChange(formatted);
      }
    }
  };

  return (
    <div className="relative w-full">
      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
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
        className={`w-full pl-5 pr-2 py-1 text-left rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
      />
    </div>
  );
});

NumericInput.displayName = "NumericInput";

export default NumericInput;
