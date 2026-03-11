export const SearchBar = ({
  value,
  onChange,
  results = [],
  loading = false,
  placeholder = "Buscar...",
  renderItem,         // cómo renderizar cada resultado
  onSelect,          // qué hacer al seleccionar
  keyExtractor,      // cómo obtener key única
}) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
      />

      {loading && <p className="text-sm text-gray-400 mt-1">Cargando...</p>}

      {results.length > 0 && (
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