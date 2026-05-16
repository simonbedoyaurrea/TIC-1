import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn } from 'lucide-react'

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginStep, setLoginStep] = useState('roles')
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setLoginStep('form')
  }

  const handleLogin = () => {
    console.log('Login:', selectedRole, formData)
    setShowLoginModal(false)
    setLoginStep('roles')
    setSelectedRole(null)
    setFormData({ email: '', password: '' })
  }

  const handleComenzar = () => {
    navigate('/planeacion/simulador')
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-dark-bg/80 border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-orbitron font-bold">
                <span className="text-neon-cyan">OPTIU</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <p className="text-xs text-gray-400 font-light">Smart Campus</p>
                <p className="text-xs text-gray-400 font-light">Scheduler</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#inicio" className="text-gray-300 hover:text-neon-cyan transition">Inicio</a>
              <a href="#simulador" className="text-gray-300 hover:text-neon-cyan transition">Simulador</a>
              <a href="#campus" className="text-gray-300 hover:text-neon-cyan transition">Mapa Campus</a>
              <a href="#features" className="text-gray-300 hover:text-neon-cyan transition">Características</a>
              <a href="#team" className="text-gray-300 hover:text-neon-cyan transition">Nosotros</a>
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-neon-cyan transition"
              >
                <LogIn size={18} />
                Login
              </button>
              <button
                onClick={handleComenzar}
                className="px-6 py-2 bg-neon-cyan text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition"
              >
                Comenzar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-dark-border"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#inicio" className="block text-gray-300 hover:text-neon-cyan">Inicio</a>
                <a href="#simulador" className="block text-gray-300 hover:text-neon-cyan">Simulador</a>
                <a href="#campus" className="block text-gray-300 hover:text-neon-cyan">Mapa Campus</a>
                <a href="#features" className="block text-gray-300 hover:text-neon-cyan">Características</a>
                <a href="#team" className="block text-gray-300 hover:text-neon-cyan">Nosotros</a>
                <button
                  onClick={() => { setShowLoginModal(true); setIsOpen(false); }}
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-neon-cyan hover:bg-dark-border transition"
                >
                  Login
                </button>
                <button
                  onClick={() => { handleComenzar(); setIsOpen(false); }}
                  className="w-full px-4 py-2 bg-neon-cyan text-dark-bg font-semibold rounded-lg"
                >
                  Comenzar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-xl"
            >
              {loginStep === 'roles' ? (
                <>
                  <h2 className="text-2xl font-orbitron text-neon-cyan mb-6">Selecciona tu rol</h2>
                  <div className="space-y-3">
                    {['Administrador', 'Docente', 'Estudiante'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className="w-full px-6 py-3 bg-dark-bg border border-dark-border rounded-lg text-white hover:border-neon-cyan hover:shadow-lg hover:shadow-neon-cyan/30 transition"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setLoginStep('roles')}
                    className="text-sm text-gray-400 hover:text-neon-cyan mb-4"
                  >
                    ← Volver
                  </button>
                  <h2 className="text-2xl font-orbitron text-neon-cyan mb-2">Login {selectedRole}</h2>
                  <p className="text-gray-400 text-sm mb-6">Ingresa tus credenciales</p>

                  <form
                    onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Contraseña</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-neon-cyan text-dark-bg font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition"
                    >
                      Ingresar
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
