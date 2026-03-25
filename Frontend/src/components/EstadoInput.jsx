import { useState, useRef, useEffect } from "react";

const estados = [
  "PROPUESTO",
  "VALIDADO",
  "APROBADO",
  "CANCELADO",
];

export function EstadoInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (estado) => {
    onChange(estado);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        readOnly
        value={value || ""}
        placeholder="Seleccionar estado"
        onClick={() => setOpen(!open)}
        className="w-full border rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {open && (
        <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
          {estados.map((estado) => (
            <li
              key={estado}
              onClick={() => handleSelect(estado)}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {estado}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}