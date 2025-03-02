import { monthNames } from "../../utils/dateUtils";

const MonthSelect = ({ value, onChange, ...props }) => {
  const handleChange = (e) => {
    const selectedMonth = parseInt(e.target.value, 10);
    onChange && onChange(selectedMonth);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full px-2 py-1 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      {...props}
    >
      {monthNames.map((month, index) => {
        const monthValue = index + 1;
        return (
          <option key={monthValue} value={monthValue}>
            {month}
          </option>
        );
      })}
    </select>
  );
};

export default MonthSelect;
