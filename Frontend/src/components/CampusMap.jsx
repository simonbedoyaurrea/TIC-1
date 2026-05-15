import { useState } from "react";
import { motion } from "framer-motion";
import mapa from "../assets/MapaUPB.png";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-xl overflow-hidden w-full max-w-5xl glassmorphism border border-neon-cyan/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-dark-card to-dark-secondary border-b border-neon-cyan/20">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-blue rounded-full" />
          <div>
            <p className="text-neon-cyan text-xs font-orbitron font-bold tracking-widest leading-none mb-1">
              CAMPUS MAP
            </p>
            <h2 className="text-white text-xl font-orbitron font-black tracking-tight leading-none">
              Mapa del Campus
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 glassmorphism px-4 py-2 rounded-lg border border-neon-cyan/30"
            >
              <span className="text-neon-cyan text-xs font-orbitron font-bold tracking-widest">
                BLOQUE:
              </span>
              <span className="text-white text-sm font-bold font-inter">
                {selected}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-neon-cyan ml-2 text-lg cursor-pointer transition-colors"
              >
                ✕
              </button>
            </motion.div>
          )}
          <div className="glassmorphism px-4 py-2 rounded-lg border border-neon-cyan/20">
            <span className="text-neon-cyan text-xs font-orbitron font-bold tracking-widest">
              {Object.keys(buildingPositions).length} BLOQUES
            </span>
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="relative w-full bg-dark-bg" style={{ paddingBottom: "62%" }}>
        <img
          src={mapa}
          alt="Mapa del Campus"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "contrast(1.1) brightness(0.85) saturate(1.2) hue-rotate(-5deg)",
          }}
        />

        {/* Overlay oscuro sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/30 via-transparent to-dark-bg/40" />

        {/* Grid futurista sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '80px 80px'
        }} />

        {/* Marcadores */}
        {Object.entries(buildingPositions).map(([id, pos]) => {
          const isHovered = hovered === id;
          const isSelected = selected === Number(id);

          return (
            <motion.div
              key={id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(Number(id))}
              whileHover={{ scale: 1.3 }}
              transition={{ duration: 0.2 }}
            >
              {/* Aura de glow */}
              {(isHovered || isSelected) && (
                <motion.div
                  className={`absolute inset-0 -m-3 rounded-full ${
                    isSelected ? "neon-glow-cyan" : "neon-glow-cyan"
                  }`}
                  animate={{
                    opacity: isSelected ? [0.6, 0.3, 0.6] : [0.4, 0.2, 0.4],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: isSelected ? '0 0 30px rgba(0, 217, 255, 0.8)' : '0 0 20px rgba(0, 217, 255, 0.5)' }}
                />
              )}

              {/* Marcador principal */}
              <motion.div
                className={`
                  relative z-10 flex items-center justify-center
                  w-8 h-8 rounded-lg font-orbitron font-bold text-xs
                  transition-all duration-150
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-neon-cyan to-neon-blue text-dark-bg neon-glow-cyan shadow-lg scale-110"
                      : isHovered
                        ? "bg-neon-cyan/80 text-dark-bg neon-glow-cyan"
                        : "bg-neon-cyan/40 text-neon-cyan border border-neon-cyan/50 backdrop-blur"
                  }
                `}
                animate={isSelected ? { y: [0, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
              >
                {id}
              </motion.div>

              {/* Tooltip elegante */}
              <motion.div
                className={`
                  absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                  px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold tracking-widest
                  pointer-events-none z-20 glassmorphism border border-neon-cyan/40
                  ${isHovered || isSelected ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                animate={{
                  y: isHovered || isSelected ? 0 : 5,
                  opacity: isHovered || isSelected ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-neon-cyan">Bloque {id}</span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Info bottom-left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 glassmorphism px-4 py-2 rounded-lg border border-neon-cyan/20"
        >
          <p className="text-neon-cyan text-xs font-orbitron font-bold tracking-widest">
            ● SELECCIONA UN BLOQUE
          </p>
        </motion.div>

        {/* Leyenda bottom-right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 right-4 glassmorphism px-4 py-3 rounded-lg border border-neon-cyan/20 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neon-cyan/40 border border-neon-cyan/60" />
            <span className="text-gray-300 text-xs font-inter font-medium">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-neon-cyan border border-neon-cyan shadow-lg" style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)' }} />
            <span className="text-neon-cyan text-xs font-inter font-medium">Seleccionado</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
