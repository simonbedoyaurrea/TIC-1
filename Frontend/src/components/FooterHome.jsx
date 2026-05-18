import { Github } from 'lucide-react'

export default function FooterHome() {
  return (
    <footer className="bg-black border-t border-dark-border">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-orbitron font-bold text-neon-cyan mb-3">
              OPTIU
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Plataforma inteligente de simulación de horarios UPB.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              Navegación
            </h4>

            <ul className="space-y-2 text-gray-400 text-sm">

              <li>
                <a
                  href="#inicio"
                  className="hover:text-neon-cyan transition"
                >
                  Inicio
                </a>
              </li>

              <li>
                <a
                  href="#features"
                  className="hover:text-neon-cyan transition"
                >
                  Características
                </a>
              </li>

              <li>
                <a
                  href="#team"
                  className="hover:text-neon-cyan transition"
                >
                  Equipo
                </a>
              </li>

            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              GitHub
            </h4>

            <div className="flex gap-3">

              <a
                href="#"
                className="p-2 bg-dark-card border border-dark-border rounded-lg text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition"
              >
                <Github size={20} />
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-dark-border mt-10 pt-6 text-center text-gray-500 text-sm">

          <p>
            © 2026 OPTIU · Universidad Pontificia Bolivariana
          </p>

        </div>

      </div>

    </footer>
  )
}