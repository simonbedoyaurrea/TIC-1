import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import HorarioAula from "../components/HorarioAula";
import { horarioService } from "../services/HorarioService";
//import FormularioAsignacion from "../components/FormularioAsignacion";

export default function AulaDetallePage() {

  const { idAula } = useParams();
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    horarioService
      .obtenerPorAula(idAula)
      .then(setHorarios)
      .finally(() => setLoading(false));
  }, [idAula]);

  const handleEventClick = (horarioDTO) => {
    // Aquí abres tu modal/drawer ya existente con el DTO pre-cargado
    console.log("DTO seleccionado:", horarioDTO);
  };

  if (loading) return <div>Cargando horario...</div>;

  return (
    <HorarioAula
      horarios={horarios}
      onEventClick={handleEventClick}
      // Si quieres habilitar creación/edición, pasas tu formulario:
      customEditor={console.log("Funciona")}
    />
  );
}
