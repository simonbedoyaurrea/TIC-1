import { useState } from "react";

export default function ProfesorInput() {
  const [value, setValue] = useState("Cesar Augusto Vargas");

  const clearInput = () => {
    setValue("");
  };

  return (
    <div className="w-full max-w-md">
      {/* Label */}
      <label className="block text-lg font-semibold mb-2">
        Profesor
      </label>

      {/* Input container */}
      <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
        
        {/* Icono usuario */}
        <div className="mr-3 text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700"
        />x

        {/* Botón limpiar */}
        {value && (
          <button
            onClick={clearInput}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}