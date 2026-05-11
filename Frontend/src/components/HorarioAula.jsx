import { Scheduler } from "@aldabil/react-scheduler";
import { useHorarioAula } from "../hooks/useHorarioAula";

/**
 * Props:
 *   horarios: HorarioAsignacionResponseDTO[]  — colección cruda del backend
 *   onEventClick?: (horario: DTO) => void     — callback al hacer clic en un bloque
 *   customEditor?: (scheduler) => ReactNode   — formulario personalizado (opcional)
 */
export default function HorarioAula({
  horarios = [],
  onEventClick,
  customEditor,
}) {
  const { events, schedulerConfig } = useHorarioAula(horarios);

  return (
    <div className="max-h-[570px] scale-90 mx-auto overflow-auto rounded-xl shadow-lg">
      <Scheduler
        {...schedulerConfig}
        events={events}
        {...(customEditor ? { customEditor } : { editable: false })}
        onEventClick={(event) => {
          onEventClick?.(event._horario);
        }}
        eventRenderer={({ event, ...props }) => (
          <div
            {...props}
            className="h-full overflow-hidden rounded-md px-2 py-1"
            style={{
              background: event.color,
              cursor: onEventClick ? "pointer" : "default",
            }}
          >
            <div className="text-white font-medium text-xs leading-tight">
              {event.title}
            </div>
            {event.subtitle && (
              <div className="text-white/80 text-[11px]">{event.subtitle}</div>
            )}
          </div>
        )}
      />
    </div>
  );
}
