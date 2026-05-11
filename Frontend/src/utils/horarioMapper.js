import { parseISO, eachWeekOfInterval, addDays, format } from "date-fns";

const DIA_OFFSET = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const COLORES_ESTADO = {
  ACTIVA: "#185FA5",
  INACTIVA: "#5F5E5A",
  PENDIENTE: "#854F0B",
};

/**
 * Convierte un HorarioAsignacionResponseDTO en uno o varios ProcessedEvent[],
 * uno por cada (semana × día) dentro del rango fechaInicio–fechaFin.
 */
export function horarioToEvents(horario) {
  if (!horario || typeof horario !== "object") {
    console.warn("horarioToEvents: horario inválido:", horario);
    return [];
  }

  const { fechaInicio, fechaFin, horaInicio, horaFin, diasSemana } = horario;

  console.log("HORARIO RECIBIDO:", horario);
  console.log("FECHAS:", fechaInicio, fechaFin);

  if (!fechaInicio || !fechaFin) {
    console.warn("horarioToEvents: falta fechaInicio/fechaFin:", {
      fechaInicio,
      fechaFin,
      horario,
    });
    return [];
  }

  if (!horaInicio || !horaFin) {
    console.warn("horarioToEvents: falta horaInicio/horaFin:", {
      horaInicio,
      horaFin,
      horario,
    });
    return [];
  }

  if (!Array.isArray(diasSemana) || diasSemana.length === 0) {
    console.warn("horarioToEvents: diasSemana inválido:", diasSemana);
    return [];
  }

  // Las fechas vienen como string "YYYY-MM-DD" desde Java LocalDate
  let inicio, fin;
  try {
    inicio = parseISO(fechaInicio);
    fin = parseISO(fechaFin);
  } catch (e) {
    console.error("horarioToEvents: error parseando fechas:", e, horario);
    return [];
  }

  // Obtenemos el lunes de cada semana en el rango
  const semanas = eachWeekOfInterval(
    { start: inicio, end: fin },
    { weekStartsOn: 1 },
  );

  const eventos = [];

  for (const semana of semanas) {
    for (const dia of diasSemana) {
      if (typeof dia !== "string" || !(dia in DIA_OFFSET)) {
        console.warn("horarioToEvents: día desconocido en diasSemana:", dia);
        continue;
      }

      const fechaDia = addDays(semana, DIA_OFFSET[dia]);

      // Descartamos si la fecha cae fuera del rango exacto
      if (fechaDia < inicio || fechaDia > fin) continue;

      //convierte de "08:30" a [8, 30]
      const partsIni = String(horaInicio).split(":").map(Number);
      const partsFin = String(horaFin).split(":").map(Number);

      if (partsIni.length < 2 || partsFin.length < 2) {
        console.warn("horarioToEvents: formato de hora inválido:", {
          horaInicio,
          horaFin,
        });
        continue;
      }

      const [hIni, mIni] = partsIni;
      const [hFin, mFin] = partsFin;

      const start = new Date(fechaDia);
      start.setHours(hIni, mIni, 0, 0);

      const end = new Date(fechaDia);
      end.setHours(hFin, mFin, 0, 0);

      eventos.push({
        // ID único: horario.id + fecha para evitar colisiones
        event_id: `${horario.id}-${format(fechaDia, "yyyyMMdd")}-${dia}`,
        title: horario.nombreProfesor || "Sin asignar",
        subtitle: horario.tipoSesion,
        start,
        end,
        color: COLORES_ESTADO[horario.estado] ?? "#185FA5",
        // Guardamos el DTO original para pasarlo al formulario
        _horario: horario,
      });
    }
  }

  return eventos;
}

/**
 * Recibe toda la colección y aplana en un array plano de ProcessedEvent.
 */
export function horariosToEvents(horarios) {
  return horarios.flatMap(horarioToEvents);
}
