import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Inicio", href: "#" },
  { label: "Salones", href: "#" },
  { label: "Reportes", href: "#" },
  { label: "Historial", href: "#" },
];

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
          : "bg-red-600 border-b-4 border-black py-4"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <a href="#" className="flex items-center gap-2 group select-none">
          {/* Icon mark */}
          <div
            className={`w-8 h-8 flex items-center justify-center font-black text-sm border-2 transition-all duration-300 ${
              scrolled
                ? "bg-yellow-400 border-yellow-400 text-black group-hover:bg-white"
                : "bg-black border-black text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black"
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
            Optim
            <span
              className={`transition-colors duration-300 ${
                scrolled ? "text-yellow-400" : "text-black"
              }`}
            >
              U
            </span>
          </span>

          {/* Pill tag */}
          <span
            className={`hidden sm:inline-block text-[10px] font-black uppercase px-1.5 py-0.5 tracking-widest transition-all duration-300 ${
              scrolled ? "bg-red-600 text-white" : "bg-yellow-400 text-black"
            }`}
          >
            Beta
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === label;
            return (
              <li key={label}>
                <a
                  href={href}
                  onClick={() => setActive(label)}
                  className={`relative px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? scrolled
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "bg-black text-yellow-400 border-black"
                      : scrolled
                        ? "text-gray-300 border-transparent hover:text-yellow-400 hover:border-yellow-400"
                        : "text-white border-transparent hover:text-black hover:bg-white hover:border-white"
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className={`text-xs font-black uppercase tracking-widest px-4 py-2 border-2 transition-all duration-150 cursor-pointer shadow-[3px_3px_0px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
              scrolled
                ? "bg-red-600 text-white border-red-600 shadow-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
                : "bg-yellow-400 text-black border-black shadow-black hover:bg-white hover:text-black"
            }`}
          >
            Nuevo Reporte
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
          className={`md:hidden flex flex-col gap-1.5 p-1 cursor-pointer group`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-0.5 w-6 transition-all duration-200 ${
                scrolled ? "bg-white" : "bg-black"
              } ${menuOpen && i === 0 ? "translate-y-2 rotate-45" : ""} ${
                menuOpen && i === 1 ? "opacity-0" : ""
              } ${menuOpen && i === 2 ? "-translate-y-2 -rotate-45" : ""}`}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`border-t-2 ${scrolled ? "border-yellow-400" : "border-black"} px-4 py-3 flex flex-col gap-1`}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = active === label;
            return (
              <a
                key={label}
                href={href}
                onClick={() => {
                  setActive(label);
                  setMenuOpen(false);
                }}
                className={`px-3 py-2 text-xs font-black uppercase tracking-widest border-2 transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? scrolled
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-black text-yellow-400 border-black"
                    : scrolled
                      ? "text-white border-transparent hover:border-yellow-400 hover:text-yellow-400"
                      : "text-white border-transparent hover:bg-black hover:text-yellow-400 hover:border-black"
                }`}
              >
                {label}
              </a>
            );
          })}
          <button
            className={`mt-1 text-xs font-black uppercase tracking-widest px-4 py-2 border-2 cursor-pointer ${
              scrolled
                ? "bg-red-600 text-white border-red-600"
                : "bg-yellow-400 text-black border-black"
            }`}
          >
            Nuevo Reporte
          </button>
        </div>
      </div>
    </nav>
  );
}
