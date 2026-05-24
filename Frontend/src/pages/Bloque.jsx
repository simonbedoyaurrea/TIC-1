// import bloque11 from "/bloque11.jpg";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useAulasPorPiso } from "../hooks/useAulasPorPiso";
import { useBloquePorId } from "../hooks/useBloquePorId";

import AulaCard from "../components/AulaCard";
import PisoButton from "../components/PisoButton";

import Navbar from "../components/NavBar";

const Bloque = () => {
  const { idBloque } = useParams();

  const [pisoSeleccionado, setPisoSeleccionado] =
    useState(1);

  const {
    bloque,
    loading: bloqueLoading,
  } = useBloquePorId(idBloque);

  const {
    aulas,
    loading: aulasLoading,
  } = useAulasPorPiso(
    idBloque,
    pisoSeleccionado
  );

  // ── LOADING ─────────────────────────────
  if (
    bloqueLoading ||
    aulasLoading ||
    !bloque
  ) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[var(--bg-primary)]
          text-[var(--text-primary)]
        "
      >
        <div
          className="
            text-xl
            font-bold
            animate-pulse
          "
        >
          Cargando bloque...
        </div>
      </div>
    );
  }

  // ── PISOS ───────────────────────────────
  const pisos = Array.from(
    { length: bloque.pisos },
    (_, i) => i + 1
  );

  return (
    <div
      className="
        relative
        min-h-screen
        bg-cover
        bg-center
        flex
        overflow-hidden
      "
      // style={{
      //   backgroundImage: `url(${bloque11})`,
      // }}
    >
      {/* NAVBAR */}
      <Navbar />
      {/* Background cyberpunk */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <iframe
          src="https://my.spline.design/chainmailbackground-kOrJPYQmh5UgAi4hu8jvA11I/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      </div>

      {/* OVERLAY */}
      <div
        className="
          absolute
          inset-0
          bg-[var(--bg-primary)]/75
          backdrop-blur-[2px]
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          flex
          flex-1
          pt-20
        "
      >
        {/* ═══════════════════════════════ */}
        {/* ══ SIDEBAR ═══════════════════ */}
        {/* ═══════════════════════════════ */}

        <aside
          className="
            w-72
            min-w-72
            border-r
            border-[var(--border-subtle)]
            p-6
            backdrop-blur-xl
            bg-[var(--bg-card)]/80
            text-[var(--text-primary)]
            shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="mb-10">
            <h1
              className="
                text-4xl
                font-black
                tracking-tight
              "
            >
              Bloque {bloque.bloque}
            </h1>

            <h2
              className="
                text-[var(--text-secondary)]
                text-xl
                font-semibold
                mt-2
              "
            >
              {bloque.nombre}
            </h2>
          </div>

          {/* TITLE */}
          <div className="mb-4">
            <h2
              className="
                text-sm
                uppercase
                tracking-[0.15em]
                font-bold
                text-[var(--text-secondary)]
              "
            >
              Pisos Disponibles
            </h2>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3">
            {pisos.map((piso) => (
              <PisoButton
                key={piso}
                piso={piso}
                activo={
                  pisoSeleccionado === piso
                }
                onClick={
                  setPisoSeleccionado
                }
              />
            ))}
          </div>
        </aside>

        {/* ═══════════════════════════════ */}
        {/* ══ MAIN ══════════════════════ */}
        {/* ═══════════════════════════════ */}

        <section
          className="
            flex-1
            p-6
            overflow-auto
          "
        >
          {/* HEADER */}
          <header className="mb-8">
            <div
              className="
                inline-flex
                items-center
                gap-3
                rounded-2xl
                px-5
                py-3
                backdrop-blur-xl
                bg-[var(--bg-card)]/75
                border
                border-[var(--border-subtle)]
                shadow-xl
              "
            >
              <div
                className="
                  w-3
                  h-3
                  rounded-full
                  bg-yellow-400
                  animate-pulse
                "
              />

              <h1
                className="
                  text-3xl
                  font-black
                  text-[var(--text-primary)]
                "
              >
                Aulas · Piso{" "}
                {pisoSeleccionado}
              </h1>
            </div>
          </header>

          {/* GRID */}
          <main
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >
            {aulas.map((aula) => (
              <AulaCard
                key={aula.id}
                aula={aula}
              />
            ))}
          </main>
        </section>
      </div>
    </div>
  );
};

export default Bloque;