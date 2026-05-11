import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black border-b-4 border-yellow-400 shadow-[0_4px_0px_#facc15] py-2"
          : "bg-[#E01050] border-b-4 border-black py-4"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-2 group select-none">
          {/* Icon mark */}
          <div
            className={`w-8 h-8 flex items-center justify-center font-black text-sm border-2 transition-all duration-300 ${
              scrolled
                ? "bg-blue-400 border-blue-400 text-black group-hover:bg-white"
                : "bg-black border-black text-yellow-400 group-hover:bg-blue-400 group-hover:text-black"
            }`}
          >
            OU
          </div>

          {/* Name */}
          <span
            className={`font-black uppercase tracking-widest text-xl leading-none transition-colors duration-300 ${
              scrolled ? "text-white" : "text-white"
            }`}
          >
            Opti
            <span
              className={`transition-colors duration-300 ${
                scrolled ? "text-blue-400" : "text-black"
              }`}
            >
              U
            </span>
          </span>

          {/* Pill tag */}
        </a>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/alert"
            className={`text-xs font-black uppercase tracking-widest px-4 py-2 border-2 transition-all duration-150 cursor-pointer shadow-[3px_3px_0px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
              scrolled
                ? "bg-blue-400 text-white border-blue-600 shadow-blue-400 hover:bg-blue-400 hover:text-black hover:border-blue-400"
                : "bg-blue-400 text-black border-black shadow-black hover:bg-white hover:text-black"
            }`}
          >
            Nuevo Reporte
          </Link>
        </div>
      </div>
    </nav>
  );
}
