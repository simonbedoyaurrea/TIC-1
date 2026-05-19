import { useState } from "react";
import apiClient from "../apis/apiClient";
import Navbar from "../components/NavBar";

const SECCIONES = [
  {
    id: "materias",
    titulo: "Materias",
    subtitulo: "Asignaturas del periodo académico",
    color: "red",
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="w-5 h-5"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "simulacion",
    titulo: "Simulación",
    subtitulo: "Simulación de horarios para cada materia",
    color: "yellow",
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="w-5 h-5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
];

const COLOR_MAP = {
  red: {
    icon: "bg-red-100 dark:bg-red-950/40 text-red-500",
    border: "border-red-500/40",
  },
  yellow: {
    icon: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-500",
    border: "border-yellow-500/40",
  },
};

export default function CargaDatosHorario() {
  const [archivos, setArchivos] = useState({
    materias: null,
    simulacion: null,
  });

  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const todosListos = Object.values(archivos).every(Boolean);

  const enviarArchivos = async () => {
    setFeedback(null);

    try {
      const formDataMaterias = new FormData();
      formDataMaterias.append("file", archivos.materias);

      const formDataHorarios = new FormData();
      formDataHorarios.append("fileHorario", archivos.simulacion);

      await Promise.all([
        apiClient.post("/simulacion/materias/carga", formDataMaterias, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        apiClient.post("/simulacion/horarios/carga", formDataHorarios, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      ]);

      setFeedback({
        tipo: "exito",
        mensaje: "Archivos enviados correctamente.",
      });
    } catch (error) {
      const detalle =
        error?.response?.data?.message ||
        "No se pudo conectar con el servidor.";

      setFeedback({
        tipo: "error",
        mensaje: detalle,
      });
    }
  };

  const handleDrop = (e, id) => {
    e.preventDefault();
    setDragging(null);

    const file = e.dataTransfer.files[0];

    if (file) {
      setArchivos((prev) => ({
        ...prev,
        [id]: file,
      }));
    }
  };

  const handleFile = (e, id) => {
    const file = e.target.files[0];

    if (file) {
      setArchivos((prev) => ({
        ...prev,
        [id]: file,
      }));
    }
  };

  const removeFile = (id) => {
    setArchivos((prev) => ({
      ...prev,
      [id]: null,
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-28 pb-10">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
            Carga de datos · Optimizador
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Sube los archivos Excel o CSV requeridos para generar el horario
            académico.
          </p>
        </div>

        {/* ALERT */}
        <div className="mb-8 rounded-xl border border-[var(--accent-yellow)]/30 bg-[var(--accent-yellow-dim)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Los dos archivos son obligatorios para continuar.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {SECCIONES.map((sec) => {
            const c = COLOR_MAP[sec.color];
            const archivoActual = archivos[sec.id];

            return (
              <div
                key={sec.id}
                className={`
                  rounded-2xl
                  border
                  bg-[var(--bg-card)]
                  border-[var(--border-subtle)]
                  overflow-hidden
                  transition-all
                  duration-300
                  ${
                    archivoActual
                      ? c.border
                      : "hover:border-[var(--border-medium)]"
                  }
                `}
              >
                {/* TOP */}
                <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${c.icon}
                      `}
                    >
                      {sec.icono}
                    </div>

                    <div>
                      <h2 className="font-black uppercase tracking-wide text-sm">
                        {sec.titulo}
                      </h2>

                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {sec.subtitulo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  {archivoActual ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-100 dark:bg-emerald-950/30 px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="w-4 h-4 text-emerald-500 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        <span className="text-xs truncate font-mono text-[var(--text-primary)]">
                          {archivoActual.name}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFile(sec.id)}
                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-${sec.id}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(sec.id);
                      }}
                      onDragLeave={() => setDragging(null)}
                      onDrop={(e) => handleDrop(e, sec.id)}
                      className={`
                        flex
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        px-5
                        py-10
                        cursor-pointer
                        transition-all
                        duration-300
                        ${
                          dragging === sec.id
                            ? "border-[var(--accent-red)] bg-[var(--accent-red-dim)]"
                            : "border-[var(--border-medium)] bg-[var(--bg-secondary)] hover:border-[var(--accent-yellow)] hover:bg-[var(--bg-tertiary)]"
                        }
                      `}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        className="w-8 h-8 text-[var(--text-muted)] mb-3"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>

                      <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                        Arrastra tu archivo aquí
                      </p>

                      <p className="text-xs text-[var(--text-secondary)]">
                        .xlsx o .csv · máximo 10 MB
                      </p>

                      <input
                        id={`file-${sec.id}`}
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) => handleFile(e, sec.id)}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* STATUS */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
            Estado de carga
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECCIONES.map((sec) => {
              const cargado = !!archivos[sec.id];

              return (
                <div
                  key={sec.id}
                  className={`
                    rounded-xl
                    border
                    px-4
                    py-3
                    flex
                    items-center
                    gap-3
                    ${
                      cargado
                        ? "border-emerald-400/30 bg-emerald-100 dark:bg-emerald-950/20"
                        : "border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
                    }
                  `}
                >
                  <div
                    className={`
                      w-2.5
                      h-2.5
                      rounded-full
                      ${
                        cargado
                          ? "bg-emerald-500"
                          : "bg-[var(--text-muted)]"
                      }
                    `}
                  />

                  <div>
                    <p className="text-sm font-bold">{sec.titulo}</p>

                    <p className="text-xs text-[var(--text-secondary)]">
                      {cargado
                        ? archivos[sec.id].name
                        : "Sin archivo seleccionado"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK */}
        {feedback && (
          <div
            className={`
              mb-6
              rounded-xl
              border
              px-5
              py-4
              text-sm
              ${
                feedback.tipo === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }
            `}
          >
            <p className="font-bold mb-1">
              {feedback.tipo === "error"
                ? "Error al subir archivos"
                : "Archivos enviados correctamente"}
            </p>

            <p className="opacity-80">{feedback.mensaje}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setArchivos({
                materias: null,
                simulacion: null,
              })
            }
            className="
              px-5
              py-3
              rounded-xl
              border
              border-[var(--border-subtle)]
              text-sm
              font-bold
              uppercase
              tracking-wide
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              hover:border-[var(--border-medium)]
              transition-all
            "
          >
            Limpiar todo
          </button>

          <button
            disabled={!todosListos}
            onClick={enviarArchivos}
            className={`
              px-8
              py-3
              rounded-xl
              text-sm
              font-black
              uppercase
              tracking-[0.15em]
              transition-all
              border
              ${
                todosListos
                  ? "bg-[var(--accent-red)] text-white border-red-700 hover:brightness-110 hover:border-yellow-500/60 shadow-lg shadow-red-950/20"
                  : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed"
              }
            `}
          >
            {todosListos
              ? "Continuar a validación →"
              : "Faltan archivos"}
          </button>
        </div>
      </main>
    </div>
  );
}