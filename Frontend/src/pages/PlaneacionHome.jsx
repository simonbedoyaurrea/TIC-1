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
    title: "Carga de datos de nueva clase",
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
    link: "/planeacion/simulador",
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

// Archivos cargados de ejemplo
const uploadedFiles = [
  { name: "plantilla_clase_A.xlsx", status: "ok" },
  { name: "horario_base.csv", status: "ok" },
  { name: "restricciones.json", status: "error" },
];

export default function PlaneacionHome() {
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleEliminar = () => {
    if (!confirming) {
      setConfirming(true);
    } else {
      setDeleted(true);
      setConfirming(false);
      setTimeout(() => setDeleted(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-5 px-6">
        <div className="flex gap-5 items-start">
          {/* ── Cards principales ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col group transition-all duration-300 bg-white/2 border border-white/6 rounded-xl p-6 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.4),0_20px_60px_rgba(250,204,21,0.08)] hover:border-yellow-400/20"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center justify-center w-11 h-11 bg-yellow-400/8 border border-yellow-400/20 rounded-xl">
                    {card.icon}
                  </div>
                  <span className="text-[10px] tracking-[0.12em] uppercase bg-white/5 border border-white/8 px-2 py-0.5 rounded text-gray-400 font-mono">
                    {card.tag}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="text-[10px] text-yellow-400 tracking-[0.12em] uppercase mb-1 font-mono">
                    {card.subtitle}
                  </p>
                  <h2 className="text-2xl font-extrabold tracking-[-0.01em] mb-2 text-white">
                    {card.title}
                  </h2>
                  <p className="text-xs text-gray-300 leading-relaxed">
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

          {/* ── Panel derecho: 3 cuadros pequeños ── */}
          <div className="flex flex-col gap-3 w-52 shrink-0">
            {/* 1. Eliminar datos */}
            <div className="bg-white/2 border border-white/6 rounded-xl p-4 flex flex-col gap-3 hover:border-red-500/30 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.2)] transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </div>
                <p className="text-[10px] text-red-400 tracking-[0.1em] uppercase font-mono font-semibold">
                  Eliminar
                </p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Borra todos los datos cargados en el sistema.
              </p>
              <button
                onClick={handleEliminar}
                className={`w-full text-[11px] font-bold font-mono py-1.5 rounded-lg border transition-all duration-200 cursor-pointer
                  ${
                    confirming
                      ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                      : deleted
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                  }`}
              >
                {deleted
                  ? "✓ Eliminado"
                  : confirming
                    ? "¿Confirmar?"
                    : "Eliminar datos"}
              </button>
            </div>

            {/* 2. Descargar horario */}
            <div className="bg-white/2 border border-white/6 rounded-xl p-4 flex flex-col gap-3 hover:border-yellow-400/30 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.15)] transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-400/8 border border-yellow-400/20 rounded-lg">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="#FACC15"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <p className="text-[10px] text-yellow-400 tracking-[0.1em] uppercase font-mono font-semibold">
                  Descargar
                </p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Exporta el horario generado en formato Excel.
              </p>
              <button className="w-full text-[11px] font-bold font-mono py-1.5 rounded-lg border bg-yellow-400/10 border-yellow-400/25 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-400/50 transition-all duration-200 cursor-pointer">
                Descargar horario
              </button>
            </div>

            {/* 3. Status de archivos */}
            <div className="bg-white/2 border border-white/6 rounded-xl p-4 flex flex-col gap-3 hover:border-white/15 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-white/5 border border-white/10 rounded-lg">
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="#a1a1aa"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="12" y2="17" />
                  </svg>
                </div>
                <p className="text-[10px] text-gray-400 tracking-[0.1em] uppercase font-mono font-semibold">
                  Archivos
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        f.status === "ok" ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    <span
                      className="text-[10px] text-gray-400 font-mono truncate"
                      title={f.name}
                    >
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/6">
                <span className="text-[10px] text-gray-500 font-mono">
                  {uploadedFiles.filter((f) => f.status === "ok").length}/
                  {uploadedFiles.length} ok
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    uploadedFiles.every((f) => f.status === "ok")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {uploadedFiles.every((f) => f.status === "ok")
                    ? "✓ Listo"
                    : "⚠ Errores"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}
