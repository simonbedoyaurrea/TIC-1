import { Github, Linkedin, Mail } from 'lucide-react'

export default function FooterHome() {
  return (
    <footer className="bg-dark-bg border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo Section */}
          <div>
            <div className="text-2xl font-orbitron font-bold text-neon-cyan mb-2">OPTIU</div>
            <p className="text-gray-400 text-sm">
              Smart Campus Scheduler para la Universidad Pontificia Bolivariana
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navegación</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#inicio" className="hover:text-neon-cyan transition">Inicio</a></li>
              <li><a href="#features" className="hover:text-neon-cyan transition">Características</a></li>
              <li><a href="#campus" className="hover:text-neon-cyan transition">Campus</a></li>
              <li><a href="#team" className="hover:text-neon-cyan transition">Equipo</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-neon-cyan transition">Documentación</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition">API Reference</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition">Soporte</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition">Contacto</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2026 OPTIU - Universidad Pontificia Bolivariana. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-neon-cyan transition">Privacidad</a>
              <a href="#" className="hover:text-neon-cyan transition">Términos</a>
              <a href="#" className="hover:text-neon-cyan transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
