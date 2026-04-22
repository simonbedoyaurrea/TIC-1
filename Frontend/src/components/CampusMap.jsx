import { useState } from "react";
import mapa from "../assets/MapaUPB.png";

// ── Posiciones calibradas con el mapa real del campus UPB ─────
// x = porcentaje desde la izquierda, y = porcentaje desde arriba
const buildingPositions = {
  1: { x: 58, y: 78 },
  2: { x: 63, y: 80 },
  3: { x: 58, y: 69 },
  4: { x: 40, y: 72 },
  5: { x: 34, y: 56 },
  6: { x: 53, y: 52 },
  7: { x: 59, y: 41 },
  8: { x: 58, y: 36 },
  9: { x: 60, y: 25 },
  10: { x: 65, y: 15 },
  11: { x: 79, y: 30 },
  12: { x: 82, y: 65 },
  13: { x: 71, y: 72 },
  14: { x: 68, y: 85 },
  15: { x: 76, y: 52 },
  16: { x: 46, y: 48 },
  17: { x: 79, y: 38 },
  18: { x: 93, y: 50 },
  19: { x: 65, y: 45 },
};

export default function CampusMap({ onBuildingClick }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleClick = (id) => {
    setSelected(id);
    onBuildingClick?.(Number(id));
  };

  return (
    <div className="bg-black border-4 border-red-600 shadow-[8px_8px_0px_#facc15]  overflow-hidden mt-17 w-[870px]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-600 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-yellow-400" />
          <div>
            <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.3em] leading-none">
              OptimU
            </p>
            <h2 className="text-white text-lg font-black uppercase tracking-tight leading-none">
              Mapa del Campus
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selected && (
            <div className="flex items-center gap-1.5 bg-black border-2 border-yellow-400 px-3 py-1">
              <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">
                Seleccionado:
              </span>
              <span className="text-white text-xs font-black">
                Bloque {selected}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-red-400 ml-1 text-xs font-black cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          <div className="bg-black border-2 border-white px-3 py-1">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">
              {Object.keys(buildingPositions).length} Bloques
            </span>
          </div>
        </div>
      </div>

      {/* ── Map area ── */}
      <div className="relative w-full" style={{ paddingBottom: "62%" }}>
        <img
          src={mapa}
          alt="Mapa del Campus"
          className="absolute inset-0 w-full h-full object-cover bg-emerald-950"
          style={{
            filter: "contrast(1.05) brightness(0.9) saturate(2)",
          }}
        />

        {/* Overlay suave para contraste de marcadores */}
        <div className="absolute inset-0 bg-black/10" />

        {/* ── Marcadores ── */}
        {Object.entries(buildingPositions).map(([id, pos]) => {
          const isHovered = hovered === id;
          const isSelected = selected === Number(id);

          return (
            <div
              key={id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(Number(id))}
            >
              {/* Pulse ring */}
              {(isHovered || isSelected) && (
                <span
                  className={`absolute inset-0 -m-2 rounded-full animate-ping opacity-60 ${
                    isSelected ? "bg-yellow-400" : "bg-red-500"
                  }`}
                  style={{ animationDuration: "1s" }}
                />
              )}

              {/* Marcador */}
              <div
                className={`
                  relative z-10 flex items-center justify-center
                  w-6 h-6 border-2 font-black text-[10px]
                  transition-all duration-150
                  ${
                    isSelected
                      ? "bg-yellow-400 border-black text-black scale-125 shadow-[2px_2px_0px_#000]"
                      : isHovered
                        ? "bg-white border-black text-black scale-110 shadow-[2px_2px_0px_#dc2626]"
                        : "bg-red-600 border-white text-white shadow-[1px_1px_0px_#000]"
                  }
                `}
              >
                {id}
              </div>

              {/* Tooltip */}
              <div
                className={`
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  whitespace-nowrap px-2 py-1
                  text-[10px] font-black uppercase tracking-wider
                  border-2 pointer-events-none z-20
                  transition-all duration-100
                  ${
                    isSelected
                      ? "bg-yellow-400 text-black border-black opacity-100 translate-y-0"
                      : isHovered
                        ? "bg-black text-white border-red-600 opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1"
                  }
                `}
              >
                Bloque {id}
                <span
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                    border-l-4 border-r-4 border-t-4
                    border-l-transparent border-r-transparent
                    ${isSelected ? "border-t-black" : "border-t-red-600"}
                  `}
                />
              </div>
            </div>
          );
        })}

        {/* Corner tag */}
        <div className="absolute bottom-3 left-3 bg-black/80 border-2 border-yellow-400 px-2 py-1">
          <p className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">
            ● Selecciona un bloque
          </p>
        </div>

        {/* Leyenda */}
        <div className="absolute bottom-3 right-3 bg-black/80 border-2 border-white/30 px-3 py-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 border border-white" />
            <span className="text-white text-[9px] font-bold uppercase tracking-widest">
              Normal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 border border-black" />
            <span className="text-white text-[9px] font-bold uppercase tracking-widest">
              Seleccionado
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="h-2 bg-yellow-400" />
    </div>
  );
}
