import { useState } from 'react'
import { motion } from 'framer-motion'
import CampusMap from './CampusMap'
import { Building2, Users, Clock, AlertCircle } from 'lucide-react'

export default function CampusMapSection() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)

  // Mock data for buildings - this would typically come from an API
  const buildingDetails = {
    1: { name: 'Bloque A', faculty: 'Ingeniería', capacity: 120, status: 'Disponible', professor: 'Dr. Juan Pérez' },
    2: { name: 'Bloque B', faculty: 'Medicina', capacity: 150, status: 'Ocupado', professor: 'Dra. María López' },
    3: { name: 'Bloque C', faculty: 'Derecho', capacity: 100, status: 'Disponible', professor: 'Prof. Carlos García' },
    4: { name: 'Bloque D', faculty: 'Administración', capacity: 130, status: 'Disponible', professor: 'Prof. Ana Martínez' },
    5: { name: 'Bloque E', faculty: 'Educación', capacity: 110, status: 'Disponible', professor: 'Prof. Roberto Silva' },
  }

  const handleBuildingClick = (id) => {
    setSelectedBuilding(id)
  }

  const currentBuilding = selectedBuilding ? buildingDetails[selectedBuilding] : null

  const statusColor = {
    'Disponible': 'text-green-400',
    'Ocupado': 'text-orange-400',
    'Mantenimiento': 'text-red-400',
  }

  return (
    <section id="campus" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-orbitron font-bold mb-4">
            <span className="text-white">Mapa Interactivo</span>
            <br />
            <span className="text-neon-cyan">del Campus</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explora visualiza e interactúa con los bloques del campus en tiempo real.
          </p>
        </motion.div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="p-6 bg-dark-card border border-dark-border rounded-2xl backdrop-blur-xl">
              <CampusMap onBuildingClick={handleBuildingClick} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 p-6 bg-dark-card border border-dark-border rounded-2xl backdrop-blur-xl">
              <h3 className="text-xl font-orbitron font-semibold text-neon-cyan mb-6">
                Información del Bloque
              </h3>

              {currentBuilding ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Building Name */}
                  <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={18} className="text-neon-cyan" />
                      <span className="text-sm text-gray-400">Nombre</span>
                    </div>
                    <p className="text-xl font-semibold text-white">{currentBuilding.name}</p>
                  </div>

                  {/* Faculty */}
                  <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <span className="text-sm text-gray-400">Facultad</span>
                    <p className="text-white mt-1">{currentBuilding.faculty}</p>
                  </div>

                  {/* Capacity */}
                  <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={18} className="text-neon-cyan" />
                      <span className="text-sm text-gray-400">Capacidad</span>
                    </div>
                    <p className="text-white">{currentBuilding.capacity} personas</p>
                  </div>

                  {/* Status */}
                  <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={18} className="text-neon-cyan" />
                      <span className="text-sm text-gray-400">Estado</span>
                    </div>
                    <p className={`font-semibold ${statusColor[currentBuilding.status]}`}>
                      {currentBuilding.status}
                    </p>
                  </div>

                  {/* Professor */}
                  <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={18} className="text-neon-cyan" />
                      <span className="text-sm text-gray-400">Docente Asignado</span>
                    </div>
                    <p className="text-white">{currentBuilding.professor}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2 border-t border-dark-border">
                    <button className="w-full px-4 py-2 bg-neon-cyan text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition">
                      Ver Horarios
                    </button>
                    <button className="w-full px-4 py-2 border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan/10 transition">
                      Editar Asignación
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle size={32} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">Haz clic en un bloque para ver detalles</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
