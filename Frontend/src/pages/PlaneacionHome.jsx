import { useState } from "react";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

const cards = [
  {
    tag: "módulo 01",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="#FACC15"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
        <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" />
      </svg>
    ),
    title: "Carga de Datos nueva clase",
    subtitle: "Nueva Clase",
    desc: "Carga las plantillas necesarias para asignar una nueva clase al sistema.",
    link: "/planeacion/carga/optimizador",
  },
  {
    tag: "módulo 02",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="#FACC15"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
        <path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" />
      </svg>
    ),
    title: "Carga de Datos Simulacion",
    subtitle: "simulador",
    desc: "Carga las plantillas necesarias para simular los horarios.",
    link: "/planeacion/carga/simulador",
  },
  {
    tag: "módulo 03",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="#FACC15"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    title: "Simulación",
    subtitle: "Ejecutar",
    desc: "Corre el algoritmo de horarios con los datos actuales del sistema.",
    link: "/planeacion/simulacion",
  },
  {
    tag: "módulo 04",
    icon: (
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="#FACC15"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Asignar",
    subtitle: "Nueva Clase",
    desc: "Asigna una nueva clase a un bloque horario específico disponible.",
    link: "/planeacion/optimizador",
  },
];

export default function PlaneacionHome() {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (confirming) {
      setDataLoaded(false);
      setConfirming(false);
    } else {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-5xl mx-auto mt-16 px-6 py-10">
        {/* Page header */}

        {/* Status bar */}
        <div className="mb-8 flex items-center justify-between bg-white/2 border border-white/6 rounded-[14px] p-4 px-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${dataLoaded ? "bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" : "bg-red-400 shadow-[0_0_8px_#f87171]"}`}
            />
            <div>
              <p className="text-xs font-bold tracking-[0.03em] text-white">
                Estado del Sistema
              </p>
              <p
                className={`text-[11px] mt-1 font-mono ${dataLoaded ? "text-green-400" : "text-red-400"}`}
              >
                {dataLoaded
                  ? "● datos cargados y listos"
                  : "○ sin datos — carga un archivo para comenzar"}
              </p>
            </div>
          </div>

          {dataLoaded && (
            <button
              onClick={handleDelete}
              className={`flex items-center gap-2 rounded-lg transition-all duration-200 bg-transparent border border-red-400/40 px-4 py-2 text-xs tracking-[0.05em] font-mono cursor-pointer ${confirming ? "text-red-500" : "text-red-400"}`}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4h8v2" />
              </svg>
              {confirming ? "¿Confirmar?" : "Eliminar datos"}
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex flex-col group transition-all duration-300 bg-white/2 border border-white/6 rounded-xl p-6 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.4),0_20px_60px_rgba(250,204,21,0.08)] hover:border-yellow-400/20"
            >
              <div className="flex items-start justify-between mb-5">
                {/* Icon */}
                <div className="flex items-center justify-center w-11 h-11 bg-yellow-400/8 border border-yellow-400/20 rounded-xl">
                  {card.icon}
                </div>
                {/* Tag */}
                <span className="text-[10px] tracking-[0.12em] uppercase bg-white/5 border border-white/8 px-2 py-0.5 rounded text-gray-400 font-mono">
                  {card.tag}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-[10px] text-yellow-400 tracking-[0.12em] uppercase mb-1 font-mono">
                  {card.subtitle}
                </p>
                <h3 className="text-lg font-extrabold tracking-[-0.01em] mb-2 text-white">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <Link to={card.link} className="mt-6">
                <button className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:-translate-y-px bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 text-xs font-bold tracking-[0.05em] font-mono border-none cursor-pointer">
                  Abrir módulo
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}
