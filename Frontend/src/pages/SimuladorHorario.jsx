import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/NavBar";
import { obtenerEstado, obtenerResultado } from "../services/AlgoritmoService";

// ── Estados del simulador ─────────────────────────────────────
const ESTADO = {
  IDLE: "idle",
  CORRIENDO: "corriendo",
  COMPLETADO: "completado",
  ERROR: "error",
};

// ── Fases visuales — se mapean desde el mensaje del backend ───
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

// Mapea el mensaje del backend a un índice de fase visual
const mensajeAFase = (mensaje = "") => {
  const lower = mensaje.toLowerCase();
  for (let i = FASES.length - 1; i >= 0; i--) {
    if (FASES[i].keywords.some((kw) => lower.includes(kw))) return i;
  }
  return 0;
};

export default function SimuladorHorario({ archivosListos = false }) {
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

  // ── Scroll automático en el log ───────────────────────────
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // ── Timer de tiempo transcurrido ─────────────────────────
  useEffect(() => {
    if (estado === ESTADO.CORRIENDO) {
      timerRef.current = setInterval(() => setTiempo((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [estado]);

  // ── Leer jobId del localStorage al montar ────────────────
  useEffect(() => {
    const storedJobId = localStorage.getItem("jobId");
    if (storedJobId) {
      setJobId(storedJobId);
      agregarLog(`Job encontrado en sesión: ${storedJobId}`, "info");
      // Si hay un job guardado, arrancamos el polling directamente
      setEstado(ESTADO.CORRIENDO);
      setTiempo(0);
    }
  }, []);

  // ── Arrancar polling cuando hay jobId y está corriendo ───
  useEffect(() => {
    if (estado === ESTADO.CORRIENDO && jobId) {
      iniciarPolling(jobId);
    }
    return () => clearInterval(pollingRef.current);
  }, [estado, jobId]);

  const agregarLog = (msg, tipo = "info") => {
    const hora = new Date().toLocaleTimeString("es-CO", { hour12: false });
    setLog((prev) => [...prev, { msg, tipo, hora }]);
  };

  // ── Polling al controller Java ────────────────────────────
  const iniciarPolling = useCallback((id) => {
    clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const data = await obtenerEstado(id);

        const { estado: estadoJob, mensaje } = data; // ← renombra a estadoJob

        const faseIdx = mensajeAFase(mensaje);
        setFaseActual(faseIdx);
        setProgreso(Math.round(((faseIdx + 1) / FASES.length) * 100));
        agregarLog(mensaje, "fase");

        if (estadoJob === "listo") {
          clearInterval(pollingRef.current);
          setProgreso(100);
          setFaseActual(-1);
          setEstado(ESTADO.COMPLETADO);
          agregarLog("Optimización completada exitosamente.", "exito");
          setResultado({
            totalClases: data.confirmados + (data.pendientes ?? 0),
            clasesAsignadas: data.confirmados ?? "—",
            conflictos: data.pendientes ?? 0,
            satisfaccion:
              data.gap != null
                ? Math.max(0, Math.round((1 - data.gap) * 100))
                : null,
            advertencias:
              data.pendientes > 0
                ? [`${data.pendientes} asignaciones con docente pendiente`]
                : [],
            gap: data.gap,
          });
        } else if (estadoJob === "error") {
          clearInterval(pollingRef.current);
          setEstado(ESTADO.ERROR);
          agregarLog(`Error del servidor: ${mensaje}`, "error");
        }
      } catch (err) {
        agregarLog(`Error de red: ${err.message}`, "error");
      }
    }, 1000 * 7);
  }, []);

  const iniciarSimulacion = () => {
    const storedJobId = localStorage.getItem("jobId");
    if (!storedJobId) {
      agregarLog(
        "No se encontró un jobId en la sesión. Sube los archivos primero.",
        "error",
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
    agregarLog(`Iniciando seguimiento del job: ${storedJobId}`, "inicio");
  };

  // ── Descarga del resultado ────────────────────────────────
  const descargarHorario = async () => {
    const id = jobId ?? localStorage.getItem("jobId");
    if (!id) return;
    try {
      agregarLog("Descargando archivo Excel...", "info");

      const blob = await obtenerResultado(id); // ya es res.data (blob)

      // Elimina res.ok y res.blob() — no existen en axios
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `asignacion_${id}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      agregarLog("Archivo descargado correctamente.", "ok");
    } catch (err) {
      agregarLog(`Error al descargar: ${err.message}`, "error");
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
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const corriendo = estado === ESTADO.CORRIENDO;
  const completado = estado === ESTADO.COMPLETADO;
  const hayError = estado === ESTADO.ERROR;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <Navbar />
      {/* ── Cabecera ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              corriendo
                ? "bg-yellow-400 animate-pulse"
                : completado
                  ? "bg-green-400"
                  : hayError
                    ? "bg-red-500"
                    : "bg-zinc-600"
            }`}
          />
          <h2 className="font-black text-base uppercase tracking-widest text-white">
            Simulador de Horarios
          </h2>
          {jobId && (
            <span className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
              job: {jobId}
            </span>
          )}
          {corriendo && (
            <span className="text-xs font-mono text-yellow-400 border border-yellow-800 px-2 py-0.5 rounded">
              {formatTiempo(tiempo)}
            </span>
          )}
          {completado && (
            <span className="text-xs font-mono text-green-400 border border-green-800 px-2 py-0.5 rounded">
              ✓ {formatTiempo(tiempo)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(completado || hayError) && (
            <button
              onClick={reiniciar}
              className="text-xs font-bold uppercase tracking-wide text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded transition-all"
            >
              ↺ Nueva simulación
            </button>
          )}
          <button
            onClick={
              corriendo ? undefined : completado ? reiniciar : iniciarSimulacion
            }
            disabled={corriendo || (!archivosListos && estado === ESTADO.IDLE)}
            className={`text-sm font-black uppercase tracking-widest px-6 py-2 rounded transition-all ${
              corriendo
                ? "bg-yellow-900 text-yellow-400 border border-yellow-800 cursor-wait"
                : completado
                  ? "bg-green-900 text-green-400 border border-green-700 cursor-pointer hover:bg-green-800"
                  : hayError
                    ? "bg-red-900 text-red-400 border border-red-700 cursor-pointer hover:bg-red-800"
                    : !archivosListos
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
            }`}
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

      <div className="grid grid-cols-2 gap-0 divide-x divide-zinc-800">
        {/* ── COLUMNA IZQUIERDA: Fases + Progreso ── */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Progreso general
              </span>
              <span
                className={`text-lg font-black ${
                  corriendo
                    ? "text-yellow-400"
                    : completado
                      ? "text-green-400"
                      : "text-zinc-600"
                }`}
              >
                {progreso}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  completado
                    ? "bg-green-500"
                    : hayError
                      ? "bg-red-500"
                      : corriendo
                        ? "bg-yellow-400"
                        : "bg-zinc-600"
                }`}
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
              Etapas del algoritmo
            </p>
            {FASES.map((fase, i) => {
              const esFaseActual = faseActual === i;
              const completada = corriendo ? i < faseActual : completado;

              return (
                <div
                  key={fase.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded transition-all ${
                    esFaseActual
                      ? "bg-yellow-950/50 border border-yellow-800/50"
                      : completada
                        ? "bg-green-950/30 border border-green-900/30"
                        : "border border-transparent"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 text-xs font-black ${
                      esFaseActual
                        ? "bg-yellow-400 text-black animate-pulse"
                        : completada
                          ? "bg-green-500 text-black"
                          : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {completada ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      esFaseActual
                        ? "text-yellow-400"
                        : completada
                          ? "text-green-400"
                          : "text-zinc-600"
                    }`}
                  >
                    {fase.label}
                  </span>
                  {esFaseActual && (
                    <div className="ml-auto flex gap-0.5">
                      {[0, 1, 2].map((d) => (
                        <div
                          key={d}
                          className="w-1 h-3 bg-yellow-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${d * 150}ms` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: Log + Resultados ── */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Log de ejecución
            </p>
            <div
              ref={logRef}
              className="h-40 bg-black border border-zinc-800 rounded p-3 overflow-y-auto font-mono text-xs space-y-1"
            >
              {log.length === 0 ? (
                <p className="text-zinc-700">
                  Esperando inicio de simulación...
                </p>
              ) : (
                log.map((entry, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-zinc-600 shrink-0">{entry.hora}</span>
                    <span
                      className={
                        entry.tipo === "exito"
                          ? "text-green-400"
                          : entry.tipo === "ok"
                            ? "text-green-600"
                            : entry.tipo === "fase"
                              ? "text-yellow-400"
                              : entry.tipo === "inicio"
                                ? "text-white font-bold"
                                : entry.tipo === "error"
                                  ? "text-red-400"
                                  : "text-zinc-400"
                      }
                    >
                      {entry.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {completado && resultado && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                Resultados
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  {
                    label: "Clases asignadas",
                    valor:
                      resultado.clasesAsignadas !== "—"
                        ? `${resultado.clasesAsignadas}/${resultado.totalClases}`
                        : "—",
                    color: "text-green-400",
                  },
                  {
                    label: "GAP solver",
                    valor:
                      resultado.gap != null
                        ? `${(resultado.gap * 100).toFixed(1)}%`
                        : "—",
                    color: "text-white",
                  },
                  {
                    label: "Satisfacción",
                    valor:
                      resultado.satisfaccion != null
                        ? `${resultado.satisfaccion}%`
                        : "—",
                    color: "text-green-400",
                  },
                  {
                    label: "Pendientes",
                    valor: resultado.conflictos,
                    color:
                      resultado.conflictos > 0
                        ? "text-yellow-400"
                        : "text-green-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
                  >
                    <p className={`text-lg font-black ${stat.color}`}>
                      {stat.valor}
                    </p>
                    <p className="text-xs text-zinc-600 uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {resultado.advertencias.length > 0 && (
                <div className="bg-yellow-950/30 border border-yellow-800/40 rounded p-3 mb-4">
                  <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-2">
                    ⚠ {resultado.advertencias.length} advertencias
                  </p>
                  {resultado.advertencias.map((adv, i) => (
                    <p
                      key={i}
                      className="text-xs text-yellow-300/70 font-mono mb-1"
                    >
                      • {adv}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={descargarHorario}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm py-3 rounded transition-all flex items-center justify-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descargar horario .xlsx
              </button>
            </div>
          )}

          {estado === ESTADO.IDLE && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-8 h-8 text-zinc-600"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-zinc-600 text-sm font-semibold">
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
  );
}
