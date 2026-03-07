import { useEffect } from "react";
import ClassroomCard from "./ClasroomCard";

const buildingsData = {
  1: {
    name: "Bloque 1",
    classrooms: [
      {
        number: "101",
        floor: 1,
        capacity: 35,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "102",
        floor: 1,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "201",
        floor: 2,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "occupied",
      },
      {
        number: "202",
        floor: 2,
        capacity: 38,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
    ],
  },
  2: {
    name: "Bloque 2",
    classrooms: [
      {
        number: "201",
        floor: 2,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "202",
        floor: 2,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "301",
        floor: 3,
        capacity: 42,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  3: {
    name: "Bloque 3",
    classrooms: [
      {
        number: "301",
        floor: 3,
        capacity: 55,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Pizarra Digital"],
        status: "available",
      },
      {
        number: "302",
        floor: 3,
        capacity: 48,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "occupied",
      },
      {
        number: "401",
        floor: 4,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  4: {
    name: "Bloque 4",
    classrooms: [
      {
        number: "401",
        floor: 4,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "402",
        floor: 4,
        capacity: 35,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  5: {
    name: "Bloque 5",
    classrooms: [
      {
        number: "501",
        floor: 5,
        capacity: 60,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: [
          "Videobeam",
          "Computador",
          "Pantalla",
          "Audio",
          "Pizarra Digital",
        ],
        status: "available",
      },
      {
        number: "502",
        floor: 5,
        capacity: 55,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "503",
        floor: 5,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "occupied",
      },
    ],
  },
  6: {
    name: "Bloque 6",
    classrooms: [
      {
        number: "601",
        floor: 6,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "602",
        floor: 6,
        capacity: 42,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "701",
        floor: 7,
        capacity: 38,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  7: {
    name: "Bloque 7",
    classrooms: [
      {
        number: "702",
        floor: 7,
        capacity: 48,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "available",
      },
      {
        number: "703",
        floor: 7,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
    ],
  },
  8: {
    name: "Bloque 8",
    classrooms: [
      {
        number: "201",
        floor: 2,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "301",
        floor: 3,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "401",
        floor: 4,
        capacity: 52,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Pizarra Digital"],
        status: "occupied",
      },
    ],
  },
  9: {
    name: "Bloque 9",
    classrooms: [
      {
        number: "501",
        floor: 5,
        capacity: 65,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "available",
      },
      {
        number: "502",
        floor: 5,
        capacity: 58,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  10: {
    name: "Bloque 10",
    classrooms: [
      {
        number: "301",
        floor: 3,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "401",
        floor: 4,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  11: {
    name: "Bloque 11",
    classrooms: [
      {
        number: "201",
        floor: 2,
        capacity: 55,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Pizarra Digital"],
        status: "available",
      },
      {
        number: "301",
        floor: 3,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "401",
        floor: 4,
        capacity: 48,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "occupied",
      },
    ],
  },
  12: {
    name: "Bloque 12",
    classrooms: [
      {
        number: "501",
        floor: 5,
        capacity: 60,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "available",
      },
      {
        number: "601",
        floor: 6,
        capacity: 52,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  13: {
    name: "Bloque 13",
    classrooms: [
      {
        number: "301",
        floor: 3,
        capacity: 42,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "401",
        floor: 4,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  14: {
    name: "Bloque 14",
    classrooms: [
      {
        number: "201",
        floor: 2,
        capacity: 38,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "301",
        floor: 3,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  15: {
    name: "Bloque 15",
    classrooms: [
      {
        number: "401",
        floor: 4,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "available",
      },
      {
        number: "501",
        floor: 5,
        capacity: 48,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  16: {
    name: "Bloque 16",
    classrooms: [
      {
        number: "301",
        floor: 3,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "401",
        floor: 4,
        capacity: 42,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  17: {
    name: "Bloque 17",
    classrooms: [
      {
        number: "501",
        floor: 5,
        capacity: 55,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Pizarra Digital"],
        status: "available",
      },
      {
        number: "601",
        floor: 6,
        capacity: 50,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  18: {
    name: "Bloque 18",
    classrooms: [
      {
        number: "201",
        floor: 2,
        capacity: 40,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Pantalla"],
        status: "available",
      },
      {
        number: "301",
        floor: 3,
        capacity: 45,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
    ],
  },
  19: {
    name: "Bloque 19",
    classrooms: [
      {
        number: "401",
        floor: 4,
        capacity: 48,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla"],
        status: "available",
      },
      {
        number: "501",
        floor: 5,
        capacity: 52,
        furniture: "Sillas giratorias y mesas individuales",
        equipment: ["Videobeam", "Computador", "Pantalla", "Audio"],
        status: "available",
      },
    ],
  },
};

export default function BuildingModal({ buildingId, onClose }) {
  const building = buildingsData[buildingId];

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!building) return null;

  const total = building.classrooms.length;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal box ── */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white border-4 border-red-600 shadow-[10px_10px_0px_#facc15] animate-[modalIn_0.18s_ease-out]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-600 border-b-4 border-black shrink-0">
          <div className="flex items-center gap-3">
            {/* Accent bar */}
            <div className="w-2 h-10 bg-yellow-400" />
            <div>
              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.35em] leading-none mb-0.5">
                OptimU · Campus
              </p>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-2xl font-black uppercase tracking-tight leading-none">
                  Bloque
                </h2>
                <span className="bg-black text-yellow-400 text-2xl font-black px-2 py-0.5 leading-none border-2 border-yellow-400">
                  {buildingId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Classroom count badge */}
            <div className="hidden sm:flex flex-col items-center bg-black border-2 border-white px-3 py-1">
              <span className="text-yellow-400 text-xl font-black leading-none">
                {total}
              </span>
              <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">
                Salones
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="w-10 h-10 flex items-center justify-center bg-black border-2 border-white text-white font-black text-sm hover:bg-yellow-400 hover:text-black hover:border-black transition-colors duration-150 cursor-pointer shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Sub-header info strip ── */}
        <div className="flex items-center gap-4 px-5 py-2 bg-black border-b-2 border-yellow-400 shrink-0">
          <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest">
            ● {building.name ?? `Bloque ${buildingId}`}
          </span>
          {building.floor && (
            <>
              <span className="text-gray-700 text-[10px]">·</span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                {building.floor} piso{building.floor !== 1 ? "s" : ""}
              </span>
            </>
          )}
          <span className="ml-auto text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            {total} salón{total !== 1 ? "es" : ""}
          </span>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 p-5 bg-gray-50">
          {building.classrooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-black border-4 border-red-600 flex items-center justify-center mb-4">
                <span className="text-yellow-400 text-2xl font-black">?</span>
              </div>
              <p className="text-black font-black uppercase tracking-widest text-sm mb-1">
                Sin salones registrados
              </p>
              <p className="text-gray-500 text-xs">
                Este bloque aún no tiene aulas configuradas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {building.classrooms.map((classroom, i) => (
                <div
                  key={classroom.number}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="animate-[fadeUp_0.25s_ease-out_both]"
                >
                  <ClassroomCard classroom={classroom} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer strip ── */}
        <div className="flex items-center justify-between px-5 py-2 bg-black border-t-4 border-black shrink-0">
          <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">
            Presiona{" "}
            <kbd className="bg-gray-800 text-gray-300 px-1 py-0.5 text-[9px] border border-gray-700">
              Esc
            </kbd>{" "}
            para cerrar
          </p>
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase tracking-widest text-white border-2 border-white px-3 py-1 hover:bg-red-600 hover:border-red-600 transition-colors duration-150 cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        {/* Yellow bottom accent */}
        <div className="h-2 bg-yellow-400 shrink-0" />
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
