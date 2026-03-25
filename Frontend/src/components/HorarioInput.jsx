import { useState } from "react";
import { CalendarDays } from "lucide-react";

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

export const HorarioInput = ({ value, onChange }) => {
  const [diasSeleccionados, setDiasSeleccionados] = useState(value?.dias || []);
  const [horaInicio, setHoraInicio] = useState(value?.horaInicio || "");
  const [horaFin, setHoraFin] = useState(value?.horaFin || "");

  const actualizar = (nuevo) => {
    const data = {
      dias: diasSeleccionados,
      horaInicio,
      horaFin,
      ...nuevo,
    };

    onChange?.(data);
  };

  return (
    <div className="flex gap-8">
      {/* Icono */}
      <CalendarDays size={50} />

      {/* Radios */}
      <div className="flex flex-col gap-2">
        {dias.map((d) => (
          <label key={d} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={d}
              checked={diasSeleccionados.includes(d)}
              onChange={(e) => {
                let nuevosDias;

                if (e.target.checked) {
                  nuevosDias = [...diasSeleccionados, d];
                } else {
                  nuevosDias = diasSeleccionados.filter((dia) => dia !== d);
                }

                setDiasSeleccionados(nuevosDias);
                actualizar({ dias: nuevosDias });
              }}
            />
            {d}
          </label>
        ))}
      </div>

      {/* Horas */}
      <div className="flex flex-col gap-4 w-64">
        <div>
          <label className="block mb-1 font-medium">Hora inicio</label>

          <input
            type="time"
            value={horaInicio}
            onChange={(e) => {
              setHoraInicio(e.target.value);
              actualizar({ horaInicio: e.target.value });
            }}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Hora fin</label>

          <input
            type="time"
            value={horaFin}
            onChange={(e) => {
              setHoraFin(e.target.value);
              actualizar({ horaFin: e.target.value });
            }}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
};
