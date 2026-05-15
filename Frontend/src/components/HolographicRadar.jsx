import { motion } from 'framer-motion';

export default function HolographicRadar() {
  const radius = 40;
  const buildings = [
    { angle: 0, distance: 0.8 },
    { angle: 45, distance: 0.6 },
    { angle: 90, distance: 0.7 },
    { angle: 135, distance: 0.9 },
    { angle: 180, distance: 0.5 },
    { angle: 225, distance: 0.8 },
    { angle: 270, distance: 0.6 },
    { angle: 315, distance: 0.7 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-8 left-8 z-20 w-32 h-32"
    >
      <div className="relative w-full h-full">
        {/* Background glassmorphism */}
        <div className="absolute inset-0 glassmorphism border border-neon-cyan/30 rounded-full backdrop-blur-sm" />

        {/* SVG Radar */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Círculos del radar */}
          {[1, 2, 3].map((i) => (
            <circle
              key={`circle-${i}`}
              cx="50"
              cy="50"
              r={20 * i}
              fill="none"
              stroke="rgba(0, 217, 255, 0.2)"
              strokeWidth="0.5"
            />
          ))}

          {/* Líneas de cuadrícula */}
          <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(0, 217, 255, 0.15)" strokeWidth="0.3" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(0, 217, 255, 0.15)" strokeWidth="0.3" />
          <line x1="25" y1="25" x2="75" y2="75" stroke="rgba(0, 217, 255, 0.1)" strokeWidth="0.3" />
          <line x1="75" y1="25" x2="25" y2="75" stroke="rgba(0, 217, 255, 0.1)" strokeWidth="0.3" />

          {/* Puntos de edificios */}
          {buildings.map((building, i) => {
            const rad = (building.angle * Math.PI) / 180;
            const x = 50 + building.distance * 30 * Math.cos(rad);
            const y = 50 + building.distance * 30 * Math.sin(rad);

            return (
              <g key={`building-${i}`}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="rgba(0, 217, 255, 0.8)"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    r: [1.5, 2.5, 1.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              </g>
            );
          })}

          {/* Centro */}
          <circle cx="50" cy="50" r="2" fill="rgba(0, 217, 255, 0.9)" />
        </svg>

        {/* Escaneo animado */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(0, 217, 255, 0.3) 30deg, transparent 60deg)',
            }}
          />
        </motion.div>

        {/* Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-neon-cyan text-[9px] font-orbitron font-bold tracking-widest">
            RADAR
          </p>
        </div>
      </div>
    </motion.div>
  );
}
