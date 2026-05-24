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
  const { events, schedulerConfig } =
    useHorarioAula(horarios);

  return (
    <>
      <style>{`
        .rs__cell {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
          border-color: var(--border-subtle) !important;
        }

        .rs__header {
          background: var(--bg-secondary) !important;
          color: var(--text-primary) !important;
          border-color: var(--border-subtle) !important;
        }

        .rs__time {
          background: var(--bg-secondary) !important;
          color: var(--text-secondary) !important;
          border-color: var(--border-subtle) !important;
        }

        .rs__panel {
          background: var(--bg-card) !important;
        }

        .MuiTypography-root {
          color: var(--text-primary) !important;
        }

        .MuiButton-root {
          color: var(--text-primary) !important;
        }

        .MuiIconButton-root {
          color: var(--text-primary) !important;
        }

        .MuiPaper-root {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
        }

        .MuiToolbar-root {
          background: var(--bg-secondary) !important;
        }

        .MuiTableCell-root {
          border-color: var(--border-subtle) !important;
        }

        .MuiDialog-paper {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
        }

        .MuiInputBase-root {
          color: var(--text-primary) !important;
        }

        .MuiOutlinedInput-notchedOutline {
          border-color: var(--border-medium) !important;
        }

        .MuiSvgIcon-root {
          color: var(--text-primary) !important;
        }

        .MuiMenu-paper {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
        }
      `}</style>

      <div
        className="
          max-h-[570px]
          scale-90
          mx-auto
          overflow-auto
          rounded-2xl
          shadow-2xl
          border
          border-[var(--border-subtle)]
          bg-[var(--bg-card)]
          text-[var(--text-primary)]
        "
      >
        <Scheduler
          {...schedulerConfig}
          events={events}
          {...(customEditor
            ? { customEditor }
            : { editable: false })}
          onEventClick={(event) => {
            onEventClick?.(event._horario);
          }}
          eventRenderer={({ event, ...props }) => (
            <div
              {...props}
              className="
                h-full
                overflow-hidden
                rounded-md
                px-2
                py-1
              "
              style={{
                background: event.color,
                cursor: onEventClick
                  ? "pointer"
                  : "default",
              }}
            >
              <div
                className="
                  text-white
                  font-medium
                  text-xs
                  leading-tight
                "
              >
                {event.title}
              </div>

              {event.subtitle && (
                <div className="text-white/80 text-[11px]">
                  {event.subtitle}
                </div>
              )}
            </div>
          )}
        />
      </div>
    </>
  );
}