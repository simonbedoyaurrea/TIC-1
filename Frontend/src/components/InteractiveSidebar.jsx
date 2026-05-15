import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Zap, MapPin, Wind } from 'lucide-react';

export default function InteractiveSidebar() {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.aside
      className="w-full max-w-sm h-full flex flex-col gap-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Bloque Seleccionado */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-cyan/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-cyan/60 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-orbitron font-bold text-sm text-neon-cyan tracking-widest">
            UBICACIÓN
          </h3>
        </div>
        <p className="text-gray-400 text-sm font-inter mb-2">Bloque Seleccionado</p>
        <p className="text-white text-2xl font-orbitron font-black">-</p>
        <p className="text-gray-500 text-xs mt-2">Selecciona un bloque en el mapa</p>
      </motion.div>

      {/* Próximos Eventos */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-cyan/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-cyan/60 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-neon-blue" />
          <h3 className="font-orbitron font-bold text-sm text-neon-blue tracking-widest">
            PRÓXIMOS EVENTOS
          </h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              whileHover={{ x: 5 }}
              className="p-2 rounded bg-dark-bg/50 border border-neon-blue/20 hover:border-neon-blue/40 transition-all"
            >
              <p className="text-gray-300 text-xs font-inter font-medium">Evento Campus</p>
              <p className="text-gray-500 text-[10px]">Hoy a las 14:00</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reportes Recientes */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-pink/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-pink/60 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-neon-pink" />
          <h3 className="font-orbitron font-bold text-sm text-neon-pink tracking-widest">
            REPORTES
          </h3>
        </div>
        <p className="text-gray-400 text-sm font-inter mb-3">Reportes recientes del campus</p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 110, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 px-4 rounded-lg bg-neon-pink/20 border border-neon-pink/40 text-neon-pink font-orbitron text-xs font-bold tracking-widest uppercase hover:bg-neon-pink/30 transition-all"
        >
          Nuevo Reporte
        </motion.button>
      </motion.div>

      {/* Estado de Zonas */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-green/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-green/60 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-neon-green" />
          <h3 className="font-orbitron font-bold text-sm text-neon-green tracking-widest">
            ESTADO
          </h3>
        </div>
        <div className="space-y-2">
          {['Bloque A: Normal', 'Bloque B: Abarrotado', 'Bloque C: Cerrado'].map((status, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded bg-dark-bg/50 border border-neon-green/20">
              <span className="text-gray-300 text-xs font-inter">{status}</span>
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Clima */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-blue/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-blue/60 transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
          <Wind className="w-5 h-5 text-neon-blue" />
          <h3 className="font-orbitron font-bold text-sm text-neon-blue tracking-widest">
            CLIMA
          </h3>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-4xl font-orbitron font-black text-white">24°</p>
            <p className="text-gray-400 text-xs font-inter">Parcialmente nublado</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-400 text-xs">Humedad: <span className="text-neon-cyan font-bold">65%</span></p>
            <p className="text-gray-400 text-xs">Viento: <span className="text-neon-cyan font-bold">8 km/h</span></p>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas en Tiempo Real */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}
        className="glassmorphism border border-neon-purple/30 rounded-lg p-6 backdrop-blur-md hover:border-neon-purple/60 transition-all"
      >
        <h3 className="font-orbitron font-bold text-sm text-neon-purple tracking-widest mb-4">
          ESTADÍSTICAS EN TIEMPO REAL
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Estudiantes', value: '4.2K', color: 'neon-cyan' },
            { label: 'Eventos Hoy', value: '12', color: 'neon-blue' },
            { label: 'Reportes', value: '8', color: 'neon-pink' },
            { label: 'Activos', value: '67%', color: 'neon-green' },
          ].map((stat, i) => (
            <div key={i} className={`text-center p-3 rounded-lg bg-dark-bg/50 border border-${stat.color}/20`}>
              <p className={`text-${stat.color} text-2xl font-orbitron font-black`}>{stat.value}</p>
              <p className="text-gray-400 text-[10px] font-inter font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
