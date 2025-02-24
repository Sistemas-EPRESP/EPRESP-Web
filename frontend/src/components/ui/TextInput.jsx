const TextInput = ({ value = "", onChange, disabled = false }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
    />
  );
};

export default TextInput;
