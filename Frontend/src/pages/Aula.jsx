import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import HorarioAula from "../components/HorarioAula";
import { useAula } from "../hooks/useAula";
import { useHorario } from "../hooks/useHorario";

import Navbar from "../components/NavBar";

//import FormularioAsignacion from "../components/FormularioAsignacion";

export default function Aula() {
  const { idAula } = useParams();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/optimizador`);
  };

  const {
    aula,
    loading: loadingAula,
    error: errorAula,
    obtenerPorId,
  } = useAula();
  const {
    eventos,
    rawHorarios,
    loading: loadingHorario,
    error: errorHorario,
    obtenerHorariosAula,
  } = useHorario();

  useEffect(() => {
    obtenerPorId(idAula);
    obtenerHorariosAula(idAula);
  }, [idAula]);

  useEffect(() => {
    console.log("EVENTOS actualizados:", eventos);
  }, [eventos]);

  const handleEventClick = (horarioDTO) => {
    // Aquí abres tu modal/drawer ya existente con el DTO pre-cargado
    console.log("DTO seleccionado:", horarioDTO);
  };

  if (loadingAula)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <p className="text-lg font-semibold animate-pulse">
        Cargando aula...
      </p>
    </div>
  );

if (loadingHorario)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <p className="text-lg font-semibold animate-pulse">
        Cargando horario...
      </p>
    </div>
  );

if (errorAula)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-red-400">
      {errorAula}
    </div>
  );

if (errorHorario)
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-red-400">
      {errorHorario}
    </div>
  );

  return (
  <div
    className="
      relative
      min-h-screen
      overflow-hidden
      bg-[var(--bg-primary)]
      text-[var(--text-primary)]
      transition-colors
      duration-300
    "
  >
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

  {/* Overlay */}
  <div
    className="
      absolute
      inset-0
      bg-[var(--bg-primary)]/75
      backdrop-blur-[2px]
    "
  />
  <div className="relative z-10">
    <header
        className="
        mt-20
          flex
          flex-col
          gap-5
          p-6
          border-b
          border-[var(--border-subtle)]
          bg-[var(--bg-secondary)]
        "
      >
        {/* TOP */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <span
            className="
              text-4xl
              xl:text-5xl
              font-black
              tracking-tight
            "
          >
            Horario Semanal
          </span>

          <span
            className="
              text-xl
              xl:text-3xl
              font-bold
              text-[var(--text-secondary)]
              text-left
              xl:text-right
            "
          >
            Bloque {aula.ubicacion} · Salón{" "}
            {String(aula.piso) +
              String(
                aula.numeroAula > 9
                  ? aula.numeroAula
                  : "0" + aula.numeroAula
              )}
          </span>
        </div>

        {/* LINE */}
        <hr className="border-[var(--border-subtle)]" />

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3">
          {/* NUEVO HORARIO */}
          <button
            className="
              px-5
              py-2.5
              rounded-xl
              font-bold
              text-sm
              tracking-wide
              border
              transition-all
              duration-200
              bg-[var(--accent-red)]
              border-red-700
              text-white
              hover:brightness-110
              hover:border-yellow-500/60
              shadow-lg
              shadow-red-950/20
            "
            onClick={() => handleClick()}
          >
            Crear nuevo horario
          </button>

          {/* MODIFICAR */}
          <button
            className="
              px-5
              py-2.5
              rounded-xl
              font-bold
              text-sm
              tracking-wide
              border
              transition-all
              duration-200
              bg-yellow-400
              border-yellow-300
              text-[#1a1208]
              dark:text-black
              hover:brightness-105
              shadow-lg
              shadow-yellow-500/10
            "
          >
            Modificar Aula
          </button>
        </div>
      </header>
    </div>

    {/* HORARIO */}
    <div className="p-4 md:p-6">
      <div
        className="
          rounded-2xl
          overflow-hidden
          border
          border-[var(--border-subtle)]
          bg-[var(--bg-card)]
          shadow-xl
          shadow-black/10
        "
      >
        <HorarioAula
          horarios={rawHorarios || []}
          onEventClick={handleEventClick}
          customEditor={console.log("Funciona")}
        />
      </div>
    </div>
  </div>
);
}
