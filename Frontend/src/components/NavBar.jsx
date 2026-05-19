import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle({ scrolled }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title={
        theme === "dark"
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      className={`
        relative
        w-9
        h-9
        overflow-hidden
        border-2
        flex
        items-center
        justify-center
        transition-all
        duration-300
        ${
          scrolled
            ? "border-[var(--accent-yellow)] bg-[var(--accent-yellow-dim)]"
            : "border-black/60 bg-black/20"
        }
      `}
    >
      {/* Sol */}
      <span
        className={`
          absolute
          text-sm
          transition-transform
          duration-300
          ${
            theme === "dark"
              ? "translate-y-0"
              : "-translate-y-8"
          }
        `}
      >
        ☀️
      </span>

      {/* Luna */}
      <span
        className={`
          absolute
          text-sm
          transition-transform
          duration-300
          ${
            theme === "dark"
              ? "translate-y-8"
              : "translate-y-0"
          }
        `}
      >
        🌙
      </span>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b-4
        transition-all
        duration-300
        ${
          scrolled
            ? "bg-[var(--nav-scrolled)] border-[var(--nav-border)] py-2"
            : "bg-[var(--nav-bg)] border-black py-4"
        }
      `}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* ───────── LOGO ───────── */}
        <Link
          to="/"
          className="flex items-center gap-2 select-none group"
        >
          {/* Icon */}
          <div
            className={`
              w-8
              h-8
              flex
              items-center
              justify-center
              font-black
              text-sm
              border-2
              transition-all
              duration-300
              ${
                scrolled
                  ? "bg-[var(--accent-yellow)] border-[var(--accent-yellow)] text-black"
                  : "bg-black border-black text-[var(--accent-yellow)]"
              }
            `}
          >
            OU
          </div>

          {/* Logo text */}
          <span
            className={`
              font-black
              uppercase
              tracking-widest
              text-xl
              transition-colors
              duration-300
              ${
                scrolled
                  ? "text-[var(--text-primary)]"
                  : "text-white"
              }
            `}
          >
            Opti
            <span
              className={`
                transition-colors
                duration-300
                ${
                  scrolled
                    ? "text-[var(--accent-yellow)]"
                    : "text-black"
                }
              `}
            >
              U
            </span>
          </span>

          {/* Beta */}
          <span
            className={`
              hidden
              sm:inline-block
              text-[10px]
              font-black
              uppercase
              tracking-widest
              px-2
              py-1
              transition-all
              duration-300
              ${
                scrolled
                  ? "bg-[var(--accent-red)] text-white"
                  : "bg-[var(--accent-yellow)] text-black"
              }
            `}
          >
            Beta
          </span>
        </Link>

        {/* ───────── ACTIONS ───────── */}
        <div className="flex items-center gap-3">
          {/* Guía */}
          <Link
            to="/optimizador/guia"
            className="
              hidden
              md:inline-block
              text-xs
              font-black
              uppercase
              tracking-widest
              px-4
              py-2
              border-2
              transition-all
              duration-300
              border-[var(--border-medium)]
              text-[var(--text-secondary)]
              hover:border-[var(--accent-yellow)]
              hover:text-[var(--accent-yellow)]
            "
          >
            Guía
          </Link>

          {/* Nuevo reporte */}
          <Link
            to="/alertas/nueva"
            className={`
              text-xs
              font-black
              uppercase
              tracking-widest
              px-4
              py-2
              border-2
              transition-all
              duration-150
              shadow-[3px_3px_0px]
              active:translate-x-[3px]
              active:translate-y-[3px]
              active:shadow-none
              ${
                scrolled
                  ? "bg-[var(--accent-red)] text-white border-[var(--accent-red)] shadow-[var(--accent-yellow)]"
                  : "bg-[var(--accent-yellow)] text-black border-black shadow-black"
              }
            `}
          >
            Nuevo Reporte
          </Link>

          {/* Theme toggle */}
          <ThemeToggle scrolled={scrolled} />
        </div>
      </div>
    </nav>
  );
}