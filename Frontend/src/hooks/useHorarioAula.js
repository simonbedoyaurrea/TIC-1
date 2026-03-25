import { useMemo } from "react";
import { horariosToEvents } from "../utils/horarioMapper";

/**
 * Recibe la colección cruda de DTOs y devuelve los eventos
 * listos para el Scheduler, más helpers de configuración.
 */
export function useHorarioAula(horarios = []) {
  const events = useMemo(
    () => horariosToEvents(horarios),
    [horarios]
  );

  const schedulerConfig = {
    view: "week",
    week: {
      weekDays: [1, 2, 3, 4, 5],
      weekStartOn: 1,
      startHour: 6,
      endHour: 22,
      step: 60,
    },
    hourFormat: "24",
    editable: false,   // el horario del aula es solo lectura por defecto
    deletable: false,
    draggable: false,
  };

  return { events, schedulerConfig };
}