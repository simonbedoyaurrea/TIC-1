import { useState } from "react";

export const SearchBar = ({
  value,
  onChange,
  results = [],
  loading = false,
  placeholder = "Buscar...",
  renderItem,
  onSelect,
  keyExtractor,
}) => {

  const [isFocused, setIsFocused] = useState(false);

  const showResults = isFocused && value.trim() !== "" && results.length > 0;

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
      />

      {loading && isFocused && (
        <p className="text-sm text-gray-400 mt-1">Cargando...</p>
      )}

      {showResults && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow mt-1 max-h-48 overflow-y-auto">
          {results.map((item) => (
            <li
              key={keyExtractor(item)}
              onClick={() => onSelect(item)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};