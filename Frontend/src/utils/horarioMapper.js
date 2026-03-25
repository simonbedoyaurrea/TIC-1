import { parseISO, eachWeekOfInterval, addDays, format } from "date-fns";

const DIA_OFFSET = {
  MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
};

const COLORES_ESTADO = {
  ACTIVA:    "#185FA5",
  INACTIVA:  "#5F5E5A",
  PENDIENTE: "#854F0B",
};

/**
 * Convierte un HorarioAsignacionResponseDTO en uno o varios ProcessedEvent[],
 * uno por cada (semana × día) dentro del rango fechaInicio–fechaFin.
 */
export function horarioToEvents(horario) {
  const { fechaInicio, fechaFin, horaInicio, horaFin, diasSemana } = horario;

  // Las fechas vienen como string "YYYY-MM-DD" desde Java LocalDate
  const inicio = parseISO(fechaInicio);
  const fin    = parseISO(fechaFin);

  // Obtenemos el lunes de cada semana en el rango
  const semanas = eachWeekOfInterval(
    { start: inicio, end: fin },
    { weekStartsOn: 1 }
  );

  const eventos = [];

  for (const semana of semanas) {
    for (const dia of diasSemana) {
      const fechaDia = addDays(semana, DIA_OFFSET[dia]);

      // Descartamos si la fecha cae fuera del rango exacto
      if (fechaDia < inicio || fechaDia > fin) continue;

      const [hIni, mIni] = horaInicio.split(":").map(Number);
      const [hFin, mFin] = horaFin.split(":").map(Number);

      const start = new Date(fechaDia);
      start.setHours(hIni, mIni, 0, 0);

      const end = new Date(fechaDia);
      end.setHours(hFin, mFin, 0, 0);

      eventos.push({
        // ID único: horario.id + fecha para evitar colisiones
        event_id:  `${horario.id}-${format(fechaDia, "yyyyMMdd")}-${dia}`,
        title:     horario.nombreProfesor || "Sin asignar",
        subtitle:  horario.tipoSesion,
        start,
        end,
        color:     COLORES_ESTADO[horario.estado] ?? "#185FA5",
        // Guardamos el DTO original para pasarlo al formulario
        _horario:  horario,
      });
    }
  }

  return eventos;
}

/**
 * Recibe toda la colección y aplana en un array plano de ProcessedEvent.
 */
export function horariosToEvents(horarios = []) {
  return horarios.flatMap(horarioToEvents);
}