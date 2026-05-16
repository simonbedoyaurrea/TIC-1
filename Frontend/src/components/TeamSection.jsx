import { motion } from 'framer-motion'
import { Mail, Linkedin } from 'lucide-react'

const teamMembers = [
  {
    id: 1,
    name: 'Alexandra Jiménez',
    career: 'Ingeniería de Sistemas e Informática',
    email: 'alexandra@upb.edu.co',
    image: '/team/alexandra.jpg',
  },
  {
    id: 2,
    name: 'Simon Bedoya',
    career: 'Ingeniería de Sistemas e Informática',
    email: 'simon@upb.edu.co',
    image: '/team/simon.jpg',
  },
  {
    id: 3,
    name: 'Sebastian Quiceno',
    career: 'Ingeniería de Sistemas e Informática',
    email: 'sebastian@upb.edu.co',
    image: '/team/sebastian.jpg',
  },
  {
    id: 4,
    name: 'Julian Amariles',
    career: 'Ingeniería de Ciencia de Datos',
    email: 'julian@upb.edu.co',
    image: '/team/julian.jpg',
  },
  {
    id: 5,
    name: 'Juan Jose Mesa',
    career: 'Ingeniería de Sistemas e Informática',
    email: 'juanjose@upb.edu.co',
    image: '/team/juanjose.jpg',
  },
]

export default function TeamSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  }

  return (
    <section
      id="team"
      className="relative py-32 px-6 lg:px-12 overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-neon-cyan/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-6xl font-orbitron font-bold mb-6">
            <span className="text-white">Nuestro</span>{' '}
            <span className="text-neon-cyan">Equipo</span>
          </h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-8">
            Un equipo multidisciplinario enfocado en innovación, optimización
            académica y desarrollo de soluciones inteligentes para la gestión
            universitaria.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-8
                text-center
                transition-all
                duration-500
                hover:border-neon-cyan/40
                hover:shadow-[0_0_40px_rgba(0,217,255,0.12)]
              "
            >
              {/* Glow Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />

              {/* Image */}
              <div className="relative flex justify-center mb-6">
                <div className="
                  relative
                  w-36
                  h-36
                  rounded-full
                  overflow-hidden
                  border-4
                  border-neon-cyan/30
                  shadow-[0_0_30px_rgba(0,217,255,0.15)]
                  group-hover:scale-105
                  transition-all
                  duration-500
                ">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      object-center
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>

              {/* Name */}
              <h3 className="
                text-2xl
                font-semibold
                text-white
                mb-2
                group-hover:text-neon-cyan
                transition-colors
              ">
                {member.name}
              </h3>

              {/* Career */}
              <p className="
                text-sm
                text-gray-400
                leading-6
                min-h-[50px]
                mb-6
              ">
                {member.career}
              </p>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/10 mb-5" />

              {/* Contact */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={`mailto:${member.email}`}
                  className="
                    p-3
                    rounded-xl
                    bg-black/30
                    border
                    border-white/10
                    text-gray-400
                    hover:text-neon-cyan
                    hover:border-neon-cyan/40
                    hover:bg-neon-cyan/10
                    transition-all
                    duration-300
                  "
                >
                  <Mail size={18} />
                </a>

                <a
                  href="#"
                  className="
                    p-3
                    rounded-xl
                    bg-black/30
                    border
                    border-white/10
                    text-gray-400
                    hover:text-neon-cyan
                    hover:border-neon-cyan/40
                    hover:bg-neon-cyan/10
                    transition-all
                    duration-300
                  "
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}