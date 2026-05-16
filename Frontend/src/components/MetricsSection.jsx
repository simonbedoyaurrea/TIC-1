import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { TrendingUp, Users, Building2, Clock } from 'lucide-react'

const CountupNumber = ({ end, duration = 2 }) => {
  const { ref, inView } = useInView({ threshold: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime = null
    const animateCount = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const currentCount = Math.floor(end * progress)
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animateCount)
  }, [inView, end, duration])

  return <span ref={ref}>{count}</span>
}

const metrics = [
  {
    icon: TrendingUp,
    label: 'Reducción de Conflictos',
    value: 95,
    suffix: '%',
  },
  {
    icon: Building2,
    label: 'Aulas Optimizadas',
    value: 200,
    suffix: '+',
  },
  {
    icon: Users,
    label: 'Usuarios Registrados',
    value: 5000,
    suffix: '+',
  },
  {
    icon: Clock,
    label: 'Horas Optimizadas',
    value: 50000,
    suffix: '+',
  },
]

export default function MetricsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold mb-4">
            <span className="text-white">Resultados</span>
            <br />
            <span className="text-neon-cyan">Esperados</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Transformamos la optimización académica con resultados comprobados.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 bg-dark-card border border-dark-border rounded-2xl backdrop-blur-xl text-center hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-neon-cyan/10 rounded-lg">
                    <Icon className="w-6 h-6 text-neon-cyan" />
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-4xl font-orbitron font-bold text-neon-cyan">
                    <CountupNumber end={metric.value} />
                    {metric.suffix}
                  </div>
                </div>

                <p className="text-gray-400 text-sm">{metric.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
