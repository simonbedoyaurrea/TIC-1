import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import HorarioAula from "../components/HorarioAula";
import { useAula } from "../hooks/useAula";
import { useHorario } from "../hooks/useHorario";

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

  if (loadingAula) return <div>Cargando Aula...</div>;
  if (loadingHorario) return <div>Cargando horario...</div>;
  if (errorAula) return <div>{errorAula}</div>;
  if (errorHorario) return <div>{errorHorario}</div>;

  return (
    <div className="bg-[#1E1E1E]">
      <header className="flex flex-col gap-4 p-4 ">
        <div className=" flex flex-row justify-between">
          <span className="text-white text-5xl font-bold">Horario Semanal</span>
          <span className="text-[#a4a4a4] text-4xl font-bold">
            Bloque {aula.ubicacion} Salon{" "}
            {String(aula.piso) +
              String(
                aula.numeroAula > 9 ? aula.numeroAula : "0" + aula.numeroAula,
              )}
          </span>
        </div>
        <hr className="h-px w-auto border-white" />
        <div className="flex flex-row justify-baseline gap-3">
          <button
            className="w-40 text-black p-2 rounded transition bg-[#F2CB00] hover:bg-black hover:text-white"
            onClick={() => handleClick()}
          >
            Crear nuevo horario
          </button>
          <button className="w-40 text-black p-2 rounded transition bg-[#F2CB00] hover:bg-black hover:text-white">
            Modificar Aula
          </button>
        </div>
      </header>

      <HorarioAula
        horarios={rawHorarios || []}
        onEventClick={handleEventClick}
        // Si quieres habilitar creación/edición, pasas tu formulario:
        customEditor={console.log("Funciona")}
      />
    </div>
  );
}
