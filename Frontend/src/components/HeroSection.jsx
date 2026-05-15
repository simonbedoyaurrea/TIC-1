import { motion } from 'framer-motion';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/50 to-dark-bg/80" />

      {/* Efecto de líneas de datos animadas */}
      <div className="absolute inset-0 opacity-[0.03]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
            style={{ width: '100%' }}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Label "Welcome" */}
        <motion.div variants={item} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full glassmorphism text-neon-cyan text-sm font-orbitron font-bold tracking-widest">
            ● SISTEMA INTELIGENTE
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          variants={item}
          className="text-6xl md:text-7xl font-orbitron font-black mb-6 text-white tracking-tighter"
        >
          Explora el campus de forma
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple">
            inteligente
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl text-gray-300 mb-8 font-inter max-w-2xl mx-auto leading-relaxed"
        >
          Navega por el campus de la UPB con un sistema de inteligencia artificial que te guía en tiempo real. Descubre rutas óptimas, eventos y reportes de tu comunidad universitaria.
        </motion.p>

        {/* Botones */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-neon-cyan text-dark-bg font-bold font-orbitron tracking-widest uppercase text-sm neon-glow-cyan hover:bg-white transition-all"
          >
            Explorar Mapa
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg glassmorphism border border-neon-cyan text-neon-cyan font-bold font-orbitron tracking-widest uppercase text-sm hover:neon-glow-cyan transition-all"
          >
            Ver Rutas
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg glassmorphism border border-neon-purple text-neon-purple font-bold font-orbitron tracking-widest uppercase text-sm hover:neon-glow-purple transition-all"
          >
            Crear Reporte
          </motion.button>
        </motion.div>

        {/* Efecto de scroll hint */}
        <motion.div
          variants={item}
          className="mt-16"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-neon-cyan text-xs font-orbitron tracking-widest mb-2">DESPLAZA HACIA ABAJO</p>
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
