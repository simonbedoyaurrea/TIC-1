import { motion } from "framer-motion";

const integrantes = [
  {
    nombre: "María Alexandra Jiménez",
    carrera: "Ingeniería de Sistemas e Informática",
    foto: "/team/alexandra.jpg",
  },
  {
    nombre: "Simón Bedoya",
    carrera: "Ingeniería de Sistemas e Informática",
    foto: "/team/simon.jpg",
  },
  {
    nombre: "Julián Amariles",
    carrera: "Ingeniería de Ciencia de Datos",
    foto: "/team/julian.jpg",
  },
  {
    nombre: "Sebastián Quiceno",
    carrera: "Ingeniería de Sistemas e Informática",
    foto: "/team/sebastian.jpg",
  },
  {
    nombre: "Juan José Mesa",
    carrera: "Ingeniería de Sistemas e Informática",
    foto: "/team/juanjose.jpg",
  },
];

export default function TeamSection() {
  return (
  <section
    id="team"
    className="py-16 bg-dark-bg border-t border-dark-border"
  >
    <div className="max-w-5xl mx-auto px-6">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >

        <h2 className="text-3xl font-bold text-white mb-3">
          Nuestro Equipo
        </h2>

        <p className="text-gray-400 text-sm">
          Proyecto realizado por estudiantes UPB
        </p>

      </motion.div>

      {/* Team */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {integrantes.map((persona, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-4 py-4 hover:border-neon-cyan/50 transition duration-300"
          >

            {/* Photo */}
            <img
              src={persona.foto}
              alt={persona.nombre}
              className="w-16 h-16 rounded-full object-cover border border-dark-border"
            />

            {/* Info */}
            <div>

              <h3 className="text-white font-medium text-sm">
                {persona.nombre}
              </h3>

              <p className="text-gray-400 text-xs leading-relaxed">
                {persona.carrera}
              </p>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  </section>
)};