import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSectionHome() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section
      id="inicio"
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-[#0a1128] to-dark-bg opacity-60" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [100, -100],
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl  font-bold mb-6 text-white leading-tight"
        >
          Simula, optimiza y visualiza
          <br />
          <span className="text-neon-cyan">tus horarios académicos</span>
          <br />
          inteligentemente
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          OPTIU optimiza la asignación de aulas y horarios académicos en la
          Universidad Pontificia Bolivariana, reduciendo conflictos y mejorando
          el uso de los espacios.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <button
            onClick={() => {
              const element = document.getElementById("campus");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 border border-neon-cyan text-neon-cyan font-semibold rounded-lg hover:bg-neon-cyan/10 transition duration-300"
          >
            Explorar Campus
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <ChevronDown className="w-6 h-6 text-neon-cyan opacity-50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
