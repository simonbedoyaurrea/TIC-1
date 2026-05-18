import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState("roles");
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleComenzar = () => {
    navigate("/planeacion/simulador");
  };

  return (
    <>
      <nav className="top-0 w-full z-50 backdrop-blur-lg bg-dark-bg/80 border-b border-dark-border ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-orbitron font-bold">
                <span className="text-neon-cyan">OPTIU</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#inicio"
                className="text-gray-300 hover:text-neon-cyan transition"
              >
                Inicio
              </a>
              <a
                href="#simulador"
                className="text-gray-300 hover:text-neon-cyan transition"
              >
                Simulador
              </a>
              <a
                href="#campus"
                className="text-gray-300 hover:text-neon-cyan transition"
              >
                Mapa Campus
              </a>
              <a
                href="#features"
                className="text-gray-300 hover:text-neon-cyan transition"
              >
                Características
              </a>
              <a
                href="#team"
                className="text-gray-300 hover:text-neon-cyan transition"
              >
                Nosotros
              </a>
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center gap-4"></div>
          </div>
        </div>
      </nav>
    </>
  );
}
