const equipmentIcons = {
  Videobeam: { icon: "📽", label: "Videobeam" },
  Computador: { icon: "💻", label: "Computador" },
  Pantalla: { icon: "🖥", label: "Pantalla" },
  Audio: { icon: "🔊", label: "Audio" },
  "Pizarra Digital": { icon: "📱", label: "Pizarra Digital" },
};

export default function ClassroomCard({ classroom }) {
  const isAvailable = classroom.status === "available";

  return (
    <div
      className={`
        group relative flex flex-col bg-white border-2 border-black
        transition-all duration-150 cursor-default
        hover:-translate-x-0.5 hover:-translate-y-0.5
        ${
          isAvailable
            ? "shadow-[4px_4px_0px_#dc2626] hover:shadow-[6px_6px_0px_#dc2626]"
            : "shadow-[4px_4px_0px_#555] hover:shadow-[6px_6px_0px_#555]"
        }
      `}
    >
      {/* ── Top accent bar (red = available, dark = occupied) ── */}
      <div
        className={`h-1.5 w-full ${isAvailable ? "bg-red-600" : "bg-gray-700"}`}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b-2 border-black">
        {/* Room number */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-black">
            <span className="text-yellow-400 text-xs font-black leading-none">
              {classroom.number}
            </span>
          </div>
          <span className="text-black text-xs font-black uppercase tracking-widest">
            Salón
          </span>
        </div>

        {/* Floor badge */}
        <div className="flex items-center gap-1.5">
          <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
            Piso {classroom.floor}
          </span>
        </div>
      </div>

      {/* ── Status banner ── */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 border-b-2 border-black ${
          isAvailable ? "bg-yellow-400" : "bg-gray-200"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full border border-black ${
            isAvailable ? "bg-green-600 animate-pulse" : "bg-gray-500"
          }`}
        />
        <span className="text-black text-[10px] font-black uppercase tracking-[0.2em]">
          {isAvailable ? "Disponible" : "Ocupado"}
        </span>
      </div>

      {/* ── Info rows ── */}
      <div className="flex flex-col divide-y-2 divide-black/10 px-3 py-2 gap-0">
        {/* Capacity */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] leading-none">👥</span>
            </div>
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Capacidad
            </span>
          </div>
          <span className="text-black text-xs font-black">
            {classroom.capacity}
            <span className="text-gray-500 font-normal text-[10px]"> est.</span>
          </span>
        </div>

        {/* Furniture */}
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] leading-none">🪑</span>
            </div>
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
              Mobiliario
            </span>
          </div>
          <span className="text-black text-[10px] font-bold text-right max-w-[110px] truncate">
            {classroom.furniture}
          </span>
        </div>
      </div>

      {/* ── Equipment ── */}
      <div className="px-3 pb-3 pt-1 mt-auto">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1 h-3 bg-yellow-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-black">
            Equipamiento
          </span>
        </div>

        {classroom.equipment.length === 0 ? (
          <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
            — Sin equipamiento —
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {classroom.equipment.map((item) => (
              <span
                key={item}
                className="flex items-center gap-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black"
              >
                <span className="text-[10px]">
                  {equipmentIcons[item]?.icon ?? "✦"}
                </span>
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom accent ── */}
      <div className="h-1 bg-yellow-400 mt-auto" />
    </div>
  );
}
