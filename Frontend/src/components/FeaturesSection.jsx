import { motion } from 'framer-motion'
import { Zap, BarChart3, AlertCircle, Cpu, Eye, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Optimización Automática',
    description: 'Algoritmos inteligentes resuelven automáticamente conflictos de horarios y asignación de aulas en segundos.',
  },
  {
    icon: BarChart3,
    title: 'Gestión de Aulas',
    description: 'Sistema inteligente que administra y optimiza el uso eficiente de todos los espacios disponibles.',
  },
  {
    icon: AlertCircle,
    title: 'Reducción de Conflictos',
    description: 'Elimina traslapes de horarios, sobreasignaciones y conflictos académicos automáticamente.',
  },
  {
    icon: Cpu,
    title: 'Simulación Académica',
    description: 'Prueba múltiples escenarios y simulaciones antes de implementar cambios reales.',
  },
  {
    icon: Eye,
    title: 'Visualización Interactiva',
    description: 'Explora el campus en 3D con mapa interactivo que muestra estado y ocupación de aulas.',
  },
  {
    icon: TrendingUp,
    title: 'Análisis de Ocupación',
    description: 'Reportes detallados sobre uso de espacios, tendencias y oportunidades de mejora.',
  },
]

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold mb-4">
            <span className="text-white">Características</span>
            <br />
            <span className="text-neon-cyan">Principales</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Descubre las funcionalidades que hacen de OPTIU la solución inteligente para optimizar
            tu campus académico.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group p-6 bg-dark-card border border-dark-border rounded-2xl backdrop-blur-xl hover:border-neon-cyan/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 inline-block p-3 bg-neon-cyan/10 rounded-lg group-hover:bg-neon-cyan/20 transition">
                  <Icon className="w-6 h-6 text-neon-cyan" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-neon-cyan transition">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
