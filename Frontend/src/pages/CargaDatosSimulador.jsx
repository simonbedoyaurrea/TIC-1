import { useState } from "react";
import Navbar from "../components/NavBar";
import { cargaDatosSimuladorService } from "../services/CargaDatos";

const ARCHIVOS = [
  {
    id: "programacion-sin-docentes",
    numero: 0,
    titulo: "Programación sin docentes",
    subtitulo: "Estructura curricular por programa",
  },
  {
    id: "asignaturas",
    numero: 1,
    titulo: "Asignaturas",
    subtitulo: "Catálogo de materias del periodo",
  },
  {
    id: "restricciones-edificio",
    numero: 2,
    titulo: "Restricciones Edificio",
    subtitulo: "Restricciones de aulas por asignatura",
  },
  {
    id: "demandas",
    numero: 3,
    titulo: "Demandas",
    subtitulo: "Demanda esperada por asignatura",
  },
  {
    id: "docentes-catalogo",
    numero: 4,
    titulo: "Docentes Catálogo",
    subtitulo: "Información base de docentes",
  },
  {
    id: "docentes-disponibilidad",
    numero: 5,
    titulo: "Docentes Disponibilidad",
    subtitulo: "Franjas horarias disponibles",
  },
  {
    id: "docentes-asignaturas",
    numero: 6,
    titulo: "Docentes Asignaturas",
    subtitulo: "Relación docente y materia",
  },
];

export default function CargaDatosSimulador() {
  const [archivos, setArchivos] = useState({});
  const [cargando, setCargando] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const totalCargados = Object.keys(archivos).length;
  const todosListos = totalCargados === ARCHIVOS.length;

  const subirTodos = async () => {
    if (!todosListos) return;

    const formData = new FormData();

    formData.append("asignaturas", archivos["asignaturas"]);
    formData.append("docentes_cat", archivos["docentes-catalogo"]);
    formData.append("disponibilidad", archivos["docentes-disponibilidad"]);
    formData.append("doc_asignaturas", archivos["docentes-asignaturas"]);
    formData.append(
      "restricciones_ed",
      archivos["restricciones-edificio"]
    );
    formData.append(
      "programacion",
      archivos["programacion-sin-docentes"]
    );
    formData.append("demandas", archivos["demandas"]);

    try {
      setCargando(true);
      setFeedback(null);

      const data = await cargaDatosSimuladorService(formData);

      localStorage.setItem("jobId", data.jobId);

      setFeedback({
        tipo: "exito",
        mensaje:
          "Simulación iniciada correctamente. El proceso está en cola.",
      });
    } catch (error) {
      const detalle =
        error?.response?.data?.message ||
        "No se pudieron enviar los archivos. Verifica tu conexión e intenta nuevamente.";

      setFeedback({
        tipo: "error",
        mensaje: detalle,
      });
    } finally {
      setCargando(false);
    }
  };

  const seleccionarArchivo = (id, file) => {
    if (!file) return;

    setArchivos((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const eliminarArchivo = (id) => {
    setArchivos((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  };

  const limpiarTodo = () => {
    setArchivos({});
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 pt-28 pb-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-1">
            Carga de archivos · Simulador
          </h1>

          <p className="text-sm text-[var(--text-secondary)]">
            Sube los 7 archivos requeridos para generar la simulación
            académica.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {ARCHIVOS.map((sec) => {
            const archivoActual = archivos[sec.id];

            return (
              <div
                key={sec.id}
                className="
                  bg-[var(--bg-card)]
                  border
                  border-[var(--border-subtle)]
                  rounded-xl
                  overflow-hidden
                  flex
                  flex-col
                  transition-all
                  duration-300
                "
              >
                {/* CABECERA */}
                <div className="px-4 pt-4 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="
                        w-6
                        h-6
                        bg-yellow-600
                        text-black
                        text-xs
                        font-black
                        flex
                        items-center
                        justify-center
                        shrink-0
                        rounded-sm
                      "
                    >
                      {sec.numero}
                    </span>

                    <p className="font-black text-sm uppercase tracking-wide truncate">
                      {sec.titulo}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)]">
                    {sec.subtitulo}
                  </p>
                </div>

                {/* CONTENT */}
                <div className="px-4 py-3">
                  {archivoActual ? (
                    <div
                      className="
                        border
                        border-emerald-400/30
                        rounded-lg
                        bg-emerald-100
                        dark:bg-emerald-950/30
                        px-3
                        py-2
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span className="text-xs truncate font-mono text-[var(--text-primary)]">
                        {archivoActual.name}
                      </span>

                      <button
                        onClick={() => eliminarArchivo(sec.id)}
                        className="
                          text-[var(--text-muted)]
                          hover:text-red-400
                          ml-2
                          shrink-0
                          transition-colors
                        "
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
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
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(null);
                        seleccionarArchivo(
                          sec.id,
                          e.dataTransfer.files[0]
                        );
                      }}
                      className={`
                        flex
                        flex-col
                        items-center
                        justify-center
                        border
                        border-dashed
                        rounded-xl
                        cursor-pointer
                        py-5
                        px-3
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
                        className="w-6 h-6 text-[var(--text-muted)] mb-2"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>

                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">
                        Arrastra o selecciona
                      </p>

                      <p className="text-xs text-[var(--text-secondary)]">
                        .xlsx o .xls
                      </p>

                      <input
                        id={`file-${sec.id}`}
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) =>
                          seleccionarArchivo(
                            sec.id,
                            e.target.files[0]
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RESUMEN */}
        <div
          className="
            bg-[var(--bg-card)]
            border
            border-[var(--border-subtle)]
            rounded-xl
            p-5
            mb-8
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-[var(--text-secondary)]
              mb-4
            "
          >
            Resumen de carga
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Seleccionados",
                valor: totalCargados,
                color: "text-[var(--text-primary)]",
                bg: "bg-[var(--bg-secondary)] border-[var(--border-medium)]",
              },
              {
                label: "Faltantes",
                valor: ARCHIVOS.length - totalCargados,
                color:
                  "text-yellow-700 dark:text-yellow-400 [-webkit-text-stroke:0.2px_rgba(0,0,0,0.35)]",
                bg:
                  "bg-yellow-100 dark:bg-yellow-950/40 border-yellow-400 dark:border-yellow-800",
              },
              {
                label: "Total",
                valor: ARCHIVOS.length,
                color: "text-[var(--text-secondary)]",
                bg: "bg-[var(--bg-secondary)] border-[var(--border-medium)]",
              },
              {
                label: "Listos",
                valor: todosListos ? "✓" : "—",
                color: todosListos
                  ? "text-green-500 dark:text-green-400"
                  : "text-[var(--text-muted)]",
                bg: todosListos
                  ? "bg-green-100 dark:bg-green-950/40 border-green-400 dark:border-green-800"
                  : "bg-[var(--bg-secondary)] border-[var(--border-medium)]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`
                  rounded-xl
                  border
                  px-4
                  py-3
                  transition-all
                  duration-300
                  ${item.bg}
                `}
              >
                <p className={`text-2xl font-black ${item.color}`}>
                  {item.valor}
                </p>

                <p
                  className="
                    text-xs
                    text-[var(--text-secondary)]
                    uppercase
                    tracking-wide
                    mt-1
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK */}
        {feedback && (
          <div
            className={`
              flex
              items-start
              gap-3
              rounded-xl
              border
              px-4
              py-3
              mb-6
              text-sm
              ${
                feedback.tipo === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }
            `}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 shrink-0 mt-0.5"
            >
              {feedback.tipo === "error" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>

            <div>
              <p className="font-bold mb-0.5">
                {feedback.tipo === "error"
                  ? "Error al subir archivos"
                  : "Archivos enviados correctamente"}
              </p>

              <p className="text-xs opacity-80 mt-1 leading-relaxed">
                {feedback.mensaje}
              </p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
          <button
            onClick={limpiarTodo}
            className="
              text-sm
              text-[var(--text-secondary)]
              hover:text-[var(--text-primary)]
              border
              border-[var(--border-subtle)]
              hover:border-[var(--border-medium)]
              px-5
              py-2.5
              rounded-xl
              transition-all
              uppercase
              tracking-wide
              font-bold
            "
          >
            Limpiar todo
          </button>

          <button
            onClick={subirTodos}
            disabled={!todosListos || cargando}
            className={`
              text-sm
              font-black
              uppercase
              tracking-[0.15em]
              px-6
              py-2.5
              rounded-xl
              transition-all
              border
              ${
                todosListos && !cargando
                  ? "bg-[var(--accent-red)] border-red-700 text-white hover:brightness-110 hover:border-yellow-500/60 shadow-lg shadow-red-950/20 cursor-pointer"
                  : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed"
              }
            `}
          >
            {cargando ? "Enviando..." : "Subir todos →"}
          </button>
        </div>
      </main>
    </div>
  );
}