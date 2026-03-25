import { Scheduler } from "@aldabil/react-scheduler";
import { useHorarioAula } from "../hooks/useHorarioAula";

/**
 * Props:
 *   horarios: HorarioAsignacionResponseDTO[]  — colección cruda del backend
 *   onEventClick?: (horario: DTO) => void     — callback al hacer clic en un bloque
 *   customEditor?: (scheduler) => ReactNode   — formulario personalizado (opcional)
 */
export default function HorarioAula({ horarios = [], onEventClick, customEditor }) {
  const { events, schedulerConfig } = useHorarioAula(horarios);

  return (
    <Scheduler
      {...schedulerConfig}
      events={events}
      // Si pasaron un formulario custom, lo usamos; si no, deshabilitamos el editor
      {...(customEditor
        ? { customEditor }
        : { editable: false }
      )}
      // Al hacer clic en un evento existente, extraemos el DTO original
      onEventClick={(event) => {
        onEventClick?.(event._horario);
      }}
      // Renderer custom para mostrar info relevante del aula
      eventRenderer={({ event, ...props }) => (
        <div
          {...props}
          style={{
            background: event.color,
            borderRadius: 6,
            padding: "2px 6px",
            height: "100%",
            overflow: "hidden",
            cursor: onEventClick ? "pointer" : "default",
          }}
        >
          <div style={{ color: "#fff", fontWeight: 500, fontSize: 12, lineHeight: 1.3 }}>
            {event.title}
          </div>
          {event.subtitle && (
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
              {event.subtitle}
            </div>
          )}
        </div>
      )}
    />
  );
}