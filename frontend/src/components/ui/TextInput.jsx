import { useState, useRef, useEffect, forwardRef } from "react";

const TextInput = forwardRef(
  (
    {
      defaultValue = "",
      value: controlledValue,
      onChange,
      disabled = false,
      maxLength,
      placeholder = "",
      onEnter,
      ...rest
    },
    ref
  ) => {
    const localRef = useRef(null);
    const setRefs = (el) => {
      localRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const [internalValue, setInternalValue] = useState(defaultValue);
    const [showTooltip, setShowTooltip] = useState(false);

    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    useEffect(() => {
      if (localRef.current) {
        setShowTooltip(
          localRef.current.scrollWidth > localRef.current.clientWidth
        );
      }
    }, [value]);

    const handleChange = (e) => {
      if (onChange) {
        onChange(e.target.value);
      } else {
        setInternalValue(e.target.value);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (onEnter) onEnter();
      }
    };

    return (
      <input
        ref={setRefs}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={maxLength}
        title={showTooltip ? value : ""}
        className={`w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
        {...rest}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
