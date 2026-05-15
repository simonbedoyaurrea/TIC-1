import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-neon-cyan/20 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Icon mark con glow */}
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center font-orbitron font-black text-lg text-neon-cyan"
            whileHover={{
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-blue/10 rounded-lg blur-sm" />
            <span className="relative">◆</span>
          </motion.div>

          {/* Logo text */}
          <div className="flex items-center gap-0">
            <span className="font-orbitron font-black text-xl text-white tracking-widest group-hover:text-neon-cyan transition-colors">
              OPTI
            </span>
            <span className="font-orbitron font-black text-xl text-neon-cyan tracking-widest">
              U
            </span>
          </div>
        </motion.div>

        {/* Nav items (opcional para futuro) */}
        <div className="hidden md:flex items-center gap-8">
          <motion.a
            href="#"
            whileHover={{ color: '#00D9FF' }}
            className="text-sm font-inter text-gray-300 font-medium tracking-wide transition-colors"
          >
            Mapa
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ color: '#00D9FF' }}
            className="text-sm font-inter text-gray-300 font-medium tracking-wide transition-colors"
          >
            Rutas
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ color: '#00D9FF' }}
            className="text-sm font-inter text-gray-300 font-medium tracking-wide transition-colors"
          >
            Reportes
          </motion.a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)',
            }}
            whileTap={{ scale: 0.95 }}
            asChild
          >
            <Link
              to="/alertas/nueva"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg font-orbitron font-bold text-xs tracking-widest uppercase cursor-pointer transition-all neon-glow-cyan hover:shadow-lg"
            >
              Nuevo Reporte
            </Link>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
