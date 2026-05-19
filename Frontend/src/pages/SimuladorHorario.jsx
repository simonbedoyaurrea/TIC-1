import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/NavBar";
import {
  obtenerEstado,
  obtenerResultado,
} from "../services/AlgoritmoService";

// ── Estados ─────────────────────────────────────────────
const ESTADO = {
  IDLE: "idle",
  CORRIENDO: "corriendo",
  COMPLETADO: "completado",
  ERROR: "error",
};

// ── Fases ───────────────────────────────────────────────
const FASES = [
  {
    id: "validacion",
    label: "Validando datos de entrada",
    keywords: ["cargando"],
  },
  {
    id: "restricciones",
    label: "Analizando restricciones",
    keywords: ["restrict"],
  },
  {
    id: "docentes",
    label: "Procesando disponibilidad docente",
    keywords: ["docente", "disponib"],
  },
  {
    id: "aulas",
    label: "Asignando aulas disponibles",
    keywords: ["salon", "aula"],
  },
  {
    id: "conflictos",
    label: "Resolviendo conflictos de horario",
    keywords: ["cp-sat", "optimizando"],
  },
  {
    id: "optimizacion",
    label: "Optimizando distribución",
    keywords: ["reparando", "asignando docente"],
  },
  {
    id: "generacion",
    label: "Generando horario final",
    keywords: ["completad", "listo"],
  },
];

const mensajeAFase = (mensaje = "") => {
  const lower = mensaje.toLowerCase();

  for (let i = FASES.length - 1; i >= 0; i--) {
    if (FASES[i].keywords.some((kw) => lower.includes(kw))) {
      return i;
    }
  }

  return 0;
};

export default function SimuladorHorario({
  archivosListos = false,
}) {
  const [estado, setEstado] = useState(ESTADO.IDLE);
  const [faseActual, setFaseActual] = useState(-1);
  const [progreso, setProgreso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [log, setLog] = useState([]);
  const [tiempo, setTiempo] = useState(0);
  const [jobId, setJobId] = useState(null);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const logRef = useRef(null);

  // ── Auto scroll log ─────────────────────────────────
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop =
        logRef.current.scrollHeight;
    }
  }, [log]);

  // ── Timer ───────────────────────────────────────────
  useEffect(() => {
    if (estado === ESTADO.CORRIENDO) {
      timerRef.current = setInterval(() => {
        setTiempo((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [estado]);

  // ── Leer jobId ──────────────────────────────────────
  useEffect(() => {
    const storedJobId =
      localStorage.getItem("jobId");

    if (storedJobId) {
      setJobId(storedJobId);

      agregarLog(
        `Job encontrado en sesión: ${storedJobId}`,
        "info"
      );

      setEstado(ESTADO.CORRIENDO);
      setTiempo(0);
    }
  }, []);

  // ── Polling ─────────────────────────────────────────
  useEffect(() => {
    if (
      estado === ESTADO.CORRIENDO &&
      jobId
    ) {
      iniciarPolling(jobId);
    }

    return () =>
      clearInterval(pollingRef.current);
  }, [estado, jobId]);

  const agregarLog = (
    msg,
    tipo = "info"
  ) => {
    const hora = new Date().toLocaleTimeString(
      "es-CO",
      {
        hour12: false,
      }
    );

    setLog((prev) => [
      ...prev,
      { msg, tipo, hora },
    ]);
  };

  // ── Polling backend ─────────────────────────────────
  const iniciarPolling = useCallback((id) => {
    clearInterval(pollingRef.current);

    pollingRef.current = setInterval(
      async () => {
        try {
          const data = await obtenerEstado(id);

          const {
            estado: estadoJob,
            mensaje,
          } = data;

          const faseIdx =
            mensajeAFase(mensaje);

          setFaseActual(faseIdx);

          setProgreso(
            Math.round(
              ((faseIdx + 1) / FASES.length) *
                100
            )
          );

          agregarLog(mensaje, "fase");

          if (estadoJob === "listo") {
            clearInterval(
              pollingRef.current
            );

            setEstado(
              ESTADO.COMPLETADO
            );

            setProgreso(100);

            agregarLog(
              "Optimización completada exitosamente.",
              "exito"
            );

            setResultado({
              totalClases:
                data.confirmados +
                (data.pendientes ?? 0),

              clasesAsignadas:
                data.confirmados ?? "—",

              conflictos:
                data.pendientes ?? 0,

              satisfaccion:
                data.gap != null
                  ? Math.max(
                      0,
                      Math.round(
                        (1 - data.gap) *
                          100
                      )
                    )
                  : null,

              advertencias:
                data.pendientes > 0
                  ? [
                      `${data.pendientes} asignaciones con docente pendiente`,
                    ]
                  : [],

              gap: data.gap,
            });
          }

          if (estadoJob === "error") {
            clearInterval(
              pollingRef.current
            );

            setEstado(ESTADO.ERROR);

            agregarLog(
              `Error del servidor: ${mensaje}`,
              "error"
            );
          }
        } catch (err) {
          agregarLog(
            `Error de red: ${err.message}`,
            "error"
          );
        }
      },
      4000
    );
  }, []);

  // ── Iniciar ─────────────────────────────────────────
  const iniciarSimulacion = () => {
    const storedJobId =
      localStorage.getItem("jobId");

    if (!storedJobId) {
      agregarLog(
        "No se encontró un jobId en la sesión.",
        "error"
      );

      return;
    }

    setJobId(storedJobId);
    setEstado(ESTADO.CORRIENDO);
    setFaseActual(0);
    setProgreso(0);
    setResultado(null);
    setLog([]);
    setTiempo(0);

    agregarLog(
      `Iniciando seguimiento del job: ${storedJobId}`,
      "inicio"
    );
  };

  // ── Descargar ───────────────────────────────────────
  const descargarHorario = async () => {
    const id =
      jobId ??
      localStorage.getItem("jobId");

    if (!id) return;

    try {
      agregarLog(
        "Descargando archivo Excel...",
        "info"
      );

      const blob =
        await obtenerResultado(id);

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download = `asignacion_${id}.xlsx`;

      a.click();

      URL.revokeObjectURL(url);

      agregarLog(
        "Archivo descargado correctamente.",
        "ok"
      );
    } catch (err) {
      agregarLog(
        `Error al descargar: ${err.message}`,
        "error"
      );
    }
  };

  const reiniciar = () => {
    clearInterval(pollingRef.current);

    localStorage.removeItem("jobId");

    setEstado(ESTADO.IDLE);
    setFaseActual(-1);
    setProgreso(0);
    setResultado(null);
    setLog([]);
    setTiempo(0);
    setJobId(null);
  };

  const formatTiempo = (s) =>
    `${String(
      Math.floor(s / 60)
    ).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;

  const corriendo =
    estado === ESTADO.CORRIENDO;

  const completado =
    estado === ESTADO.COMPLETADO;

  const hayError =
    estado === ESTADO.ERROR;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-10">
        <div
          className="
            bg-[var(--bg-card)]
            border
            border-[var(--border-subtle)]
            rounded-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-[var(--border-subtle)]
              bg-[var(--bg-secondary)]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  corriendo
                    ? "bg-yellow-400 animate-pulse"
                    : completado
                    ? "bg-green-400"
                    : hayError
                    ? "bg-red-500"
                    : "bg-[var(--text-muted)]"
                }`}
              />

              <h2
                className="
                  font-black
                  text-base
                  uppercase
                  tracking-[0.2em]
                "
              >
                Simulador de Horarios
              </h2>

              {jobId && (
                <span
                  className="
                    text-xs
                    font-mono
                    text-[var(--text-secondary)]
                    border
                    border-[var(--border-subtle)]
                    px-2
                    py-0.5
                    rounded
                  "
                >
                  job: {jobId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {(completado ||
                hayError) && (
                <button
                  onClick={reiniciar}
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    border
                    border-[var(--border-medium)]
                    text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)]
                    hover:border-[var(--accent-yellow)]
                    px-4
                    py-2
                    rounded-xl
                    transition-all
                  "
                >
                  ↺ Nueva simulación
                </button>
              )}

              <button
                onClick={
                  corriendo
                    ? undefined
                    : completado
                    ? reiniciar
                    : iniciarSimulacion
                }
                disabled={
                  corriendo ||
                  (!archivosListos &&
                    estado ===
                      ESTADO.IDLE)
                }
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
                    corriendo
                      ? "bg-yellow-900 text-yellow-400 border-yellow-800 cursor-wait"
                      : completado
                      ? "bg-green-900 text-green-400 border-green-700 hover:bg-green-800"
                      : hayError
                      ? "bg-red-900 text-red-400 border-red-700 hover:bg-red-800"
                      : !archivosListos
                      ? "bg-[var(--bg-tertiary)] border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed"
                      : "bg-[var(--accent-red)] border-red-700 text-white hover:brightness-110 hover:border-yellow-500/60 shadow-lg shadow-red-950/20"
                  }
                `}
              >
                {corriendo
                  ? "⟳ Simulando..."
                  : completado
                  ? "✓ Completado"
                  : hayError
                  ? "Reintentar"
                  : !archivosListos
                  ? "Carga archivos primero"
                  : "▶ Iniciar simulación"}
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              divide-y
              lg:divide-y-0
              lg:divide-x
              divide-[var(--border-subtle)]
            "
          >
            {/* LEFT */}
            <div className="p-6">
              <div className="mb-8">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >
                  <span
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      text-[var(--text-secondary)]
                    "
                  >
                    Progreso general
                  </span>

                  <span
                    className={`
                      text-xl
                      font-black
                      ${
                        corriendo
                          ? "text-yellow-400"
                          : completado
                          ? "text-green-400"
                          : "text-[var(--text-muted)]"
                      }
                    `}
                  >
                    {progreso}%
                  </span>
                </div>

                <div
                  className="
                    h-2.5
                    bg-[var(--bg-tertiary)]
                    rounded-full
                    overflow-hidden
                  "
                >
                  <div
                    className={`
                      h-full
                      rounded-full
                      transition-all
                      duration-500
                      ${
                        completado
                          ? "bg-green-500"
                          : hayError
                          ? "bg-red-500"
                          : corriendo
                          ? "bg-yellow-400"
                          : "bg-[var(--text-muted)]"
                      }
                    `}
                    style={{
                      width: `${progreso}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                  Etapas del algoritmo
                </p>

                {FASES.map((fase, i) => {
                  const esFaseActual =
                    faseActual === i;

                  const completada =
                    corriendo
                      ? i < faseActual
                      : completado;

                  return (
                    <div
                      key={fase.id}
                      className={`
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        border
                        transition-all
                        duration-300
                        ${
                          esFaseActual
                            ? "bg-yellow-950/30 border-yellow-700/40"
                            : completada
                            ? "bg-green-950/20 border-green-700/30"
                            : "bg-[var(--bg-secondary)] border-[var(--border-subtle)]"
                        }
                      `}
                    >
                      <div
                        className={`
                          w-6
                          h-6
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-black
                          shrink-0
                          ${
                            esFaseActual
                              ? "bg-yellow-400 text-black animate-pulse"
                              : completada
                              ? "bg-green-500 text-black"
                              : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                          }
                        `}
                      >
                        {completada
                          ? "✓"
                          : i + 1}
                      </div>

                      <span
                        className={`
                          text-sm
                          font-semibold
                          ${
                            esFaseActual
                              ? "text-yellow-400"
                              : completada
                              ? "text-green-400"
                              : "text-[var(--text-secondary)]"
                          }
                        `}
                      >
                        {fase.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-6 flex flex-col gap-6">
              {/* LOG */}
              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-[var(--text-secondary)]
                    mb-3
                  "
                >
                  Log de ejecución
                </p>

                <div
                  ref={logRef}
                  className="
                    h-52
                    bg-[var(--bg-primary)]
                    border
                    border-[var(--border-subtle)]
                    rounded-xl
                    p-4
                    overflow-y-auto
                    font-mono
                    text-xs
                    space-y-1.5
                  "
                >
                  {log.length === 0 ? (
                    <p className="text-[var(--text-faint)]">
                      Esperando inicio
                      de simulación...
                    </p>
                  ) : (
                    log.map(
                      (entry, i) => (
                        <div
                          key={i}
                          className="flex gap-2"
                        >
                          <span
                            className="
                              text-[var(--text-muted)]
                              shrink-0
                            "
                          >
                            {entry.hora}
                          </span>

                          <span
                            className={
                              entry.tipo ===
                              "exito"
                                ? "text-green-400"
                                : entry.tipo ===
                                  "ok"
                                ? "text-green-500"
                                : entry.tipo ===
                                  "fase"
                                ? "text-yellow-400"
                                : entry.tipo ===
                                  "inicio"
                                ? "text-[var(--text-primary)] font-bold"
                                : entry.tipo ===
                                  "error"
                                ? "text-red-400"
                                : "text-[var(--text-secondary)]"
                            }
                          >
                            {entry.msg}
                          </span>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>

              {/* RESULTADOS */}
              {completado &&
                resultado && (
                  <div>
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
                      Resultados
                    </p>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-3
                        mb-4
                      "
                    >
                      {[
                        {
                          label:
                            "Clases asignadas",

                          valor:
                            resultado.clasesAsignadas !==
                            "—"
                              ? `${resultado.clasesAsignadas}/${resultado.totalClases}`
                              : "—",

                          color:
                            "text-green-400",
                        },

                        {
                          label:
                            "GAP solver",

                          valor:
                            resultado.gap !=
                            null
                              ? `${(
                                  resultado.gap *
                                  100
                                ).toFixed(
                                  1
                                )}%`
                              : "—",

                          color:
                            "text-[var(--text-primary)]",
                        },

                        {
                          label:
                            "Satisfacción",

                          valor:
                            resultado.satisfaccion !=
                            null
                              ? `${resultado.satisfaccion}%`
                              : "—",

                          color:
                            "text-green-400",
                        },

                        {
                          label:
                            "Pendientes",

                          valor:
                            resultado.conflictos,

                          color:
                            resultado.conflictos >
                            0
                              ? "text-yellow-400"
                              : "text-green-400",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="
                            bg-[var(--bg-secondary)]
                            border
                            border-[var(--border-subtle)]
                            rounded-xl
                            px-4
                            py-3
                          "
                        >
                          <p
                            className={`
                              text-2xl
                              font-black
                              ${stat.color}
                            `}
                          >
                            {stat.valor}
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
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {resultado
                      .advertencias
                      .length > 0 && (
                      <div
                        className="
                          bg-yellow-950/20
                          border
                          border-yellow-700/30
                          rounded-xl
                          p-4
                          mb-4
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-bold
                            text-yellow-400
                            uppercase
                            tracking-wide
                            mb-2
                          "
                        >
                          ⚠{" "}
                          {
                            resultado
                              .advertencias
                              .length
                          }{" "}
                          advertencias
                        </p>

                        {resultado.advertencias.map(
                          (adv, i) => (
                            <p
                              key={i}
                              className="
                                text-xs
                                text-yellow-300/80
                                font-mono
                                mb-1
                              "
                            >
                              • {adv}
                            </p>
                          )
                        )}
                      </div>
                    )}

                    <button
                      onClick={
                        descargarHorario
                      }
                      className="
                        w-full
                        bg-[var(--accent-red)]
                        hover:brightness-110
                        text-white
                        font-black
                        uppercase
                        tracking-[0.15em]
                        text-sm
                        py-3
                        rounded-xl
                        transition-all
                        flex
                        items-center
                        justify-center
                        gap-2
                        border
                        border-red-700
                        hover:border-yellow-500/60
                      "
                    >
                      Descargar horario
                      .xlsx
                    </button>
                  </div>
                )}

              {/* EMPTY */}
              {estado ===
                ESTADO.IDLE && (
                <div
                  className="
                    flex-1
                    flex
                    items-center
                    justify-center
                  "
                >
                  <div className="text-center">
                    <div
                      className="
                        w-16
                        h-16
                        border-2
                        border-[var(--border-medium)]
                        rounded-full
                        flex
                        items-center
                        justify-center
                        mx-auto
                        mb-4
                      "
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={
                          1.5
                        }
                        className="
                          w-8
                          h-8
                          text-[var(--text-muted)]
                        "
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>

                    <p
                      className="
                        text-[var(--text-muted)]
                        text-sm
                        font-semibold
                      "
                    >
                      {archivosListos
                        ? "Listo para simular"
                        : "Carga los archivos primero"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}