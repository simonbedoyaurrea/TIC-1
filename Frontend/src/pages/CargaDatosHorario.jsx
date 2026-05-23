import { useState } from "react";
import apiClient from "../apis/apiClient";
import Navbar from "../components/NavBar";

// ── Configuración de secciones ────────────────────────────────
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
    campos: [
      { nombre: "Nombre materia", requerido: true },
      { nombre: "Código materia", requerido: true },
      { nombre: "Créditos / horas", requerido: true },
      { nombre: "Semestre", requerido: true },
      { nombre: "Docente asignado", requerido: false },
    ],
  },
  {
    id: "simulacion",
    titulo: "Simulación",
    subtitulo: "Simulación de horarios paara cada materia",
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
    campos: [
      { nombre: "Código aula", requerido: true },
      { nombre: "Edificio / bloque", requerido: true },
      { nombre: "Capacidad", requerido: true },
      { nombre: "Tipo de aula", requerido: true },
      { nombre: "Equipamiento", requerido: false },
    ],
  },
];

// ── Colores por sección ───────────────────────────────────────
const COLOR_MAP = {
  red: {
    icon: "bg-red-950 text-red-400",
    border: "border-red-800",
    badge: "bg-red-950 text-red-400",
  },
  yellow: {
    icon: "bg-yellow-950 text-yellow-400",
    border: "border-yellow-700",
    badge: "bg-yellow-950 text-yellow-400",
  },
};

export default function CargaDatosHorario() {
  const enviarArchivos = async () => {
    setFeedback(null);
    setCargando(true);
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

      // éxito: mostrar mensaje y limpiar archivos
      setFeedback({
        tipo: "exito",
        mensaje: "Los archivos fueron procesados y guardados correctamente.",
      });
      setArchivos({ materias: null, simulacion: null });
    } catch (error) {
      // axios pone la respuesta del backend en error.response.data
      const detalle =
        error?.response?.data?.mensaje || // ← "mensaje" no "message"
        error?.message ||
        "No se pudo conectar con el servidor.";

      setFeedback({ tipo: "error", mensaje: detalle });
    } finally {
      setCargando(false);
    }
  };

  const [archivos, setArchivos] = useState({
    materias: null,
    simulacion: null,
  });
  const [dragging, setDragging] = useState(null);
  const [pasoActivo] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleDrop = (e, id) => {
    e.preventDefault();
    setDragging(null);
    const file = e.dataTransfer.files[0];
    if (file) setArchivos((prev) => ({ ...prev, [id]: file }));
  };

  const handleFile = (e, id) => {
    const file = e.target.files[0];
    if (file) setArchivos((prev) => ({ ...prev, [id]: file }));
  };

  const removeFile = (id) => setArchivos((prev) => ({ ...prev, [id]: null }));

  const todosListos = Object.values(archivos).every(Boolean);

  return (
    <div className="min-h-screen bg-black text-mauve-200 font-sans">
      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight  mb-1">
            Carga de datos - OPTIMIZADOR
          </h1>
          <p className="text-blck text-sm">
            Sube los archivos Excel o CSV con la información requerida
          </p>
        </div>

        {/* AVISO */}
        <div className="flex items-start gap-3 bg-black border border-zinc-700 rounded px-4 py-3 mb-8">
          <span className="text-white font-semibold">
            Los dos archivos son obligatorios
          </span>
        </div>

        {/* TARJETAS DE SECCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {SECCIONES.map((sec) => {
            const c = COLOR_MAP[sec.color];
            const archivoActual = archivos[sec.id];
            return (
              <div
                key={sec.id}
                className={`bg-black text-mauve-200 border rounded-lg overflow-hidden transition-all ${
                  archivoActual
                    ? `border-${sec.color === "blue" ? "blue" : sec.color === "red" ? "red" : "yellow"}-700`
                    : "border-zinc-800"
                }`}
              >
                {/* Cabecera tarjeta */}
                <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-3 mb-1">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${c.icon}`}
                    >
                      {sec.icono}
                    </div>
                    <div>
                      <p className="font-black text-base uppercase tracking-wide ">
                        {sec.titulo}
                      </p>
                      <p className="text-xs text-zinc-500">{sec.subtitulo}</p>
                    </div>
                  </div>
                </div>

                {/* Zona de arrastre */}
                <div className="px-5 py-4">
                  {archivoActual ? (
                    <div className="border border-zinc-700 rounded bg-zinc-900 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="w-4 h-4 text-green-400 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs text-zinc-300 truncate font-mono">
                          {archivoActual.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(sec.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors ml-2 shrink-0"
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
                      onDrop={(e) => handleDrop(e, sec.id)}
                      className={`flex flex-col items-center justify-center border border-dashed rounded cursor-pointer py-6 px-4 transition-all ${
                        dragging === sec.id
                          ? "border-red-500 bg-red-950/20"
                          : "border-zinc-700 hover:border-zinc-500 bg-zinc-900"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        className="w-7 h-7 text-zinc-600 mb-2"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-xs text-white text-center mb-1">
                        Arrastra tu archivo aquí
                      </p>
                      <p className="text-xs text-white text-center">
                        .xlsx o .csv · máx. 10 MB
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

        {/* RESUMEN DE ESTADO */}
        <div className=" border border-zinc-800 rounded-lg p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Estado de la carga
          </p>
          <div className="grid grid-cols-3 gap-4">
            {SECCIONES.map((sec) => {
              const cargado = !!archivos[sec.id];
              return (
                <div
                  key={sec.id}
                  className={`rounded border px-4 py-3 flex items-center gap-3 transition-all ${
                    cargado
                      ? "border-green-800 bg-green-950/30"
                      : "border-zinc-800 bg-zinc-900"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${cargado ? "bg-green-400" : "bg-zinc-700"}`}
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{sec.titulo}</p>
                    <p className="text-xs text-zinc-500">
                      {cargado ? archivos[sec.id].name : "Sin archivo"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {feedback && (
          <div
            className={`flex items-start gap-3 rounded border px-4 py-3 mb-6 text-sm ${
              feedback.tipo === "error"
                ? "bg-red-950/30 border-red-800 text-red-400"
                : "bg-green-950/30 border-green-800 text-green-400"
            }`}
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
                  ? "Error al subir los archivos"
                  : "Archivos enviados correctamente"}
              </p>
              <p className="text-xs opacity-80">{feedback.mensaje}</p>
            </div>
          </div>
        )}

        {/* ACCIONES */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setArchivos({ materias: null, simulacion: null })}
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-5 py-2.5 rounded transition-all uppercase tracking-wide font-bold"
          >
            Limpiar todo
          </button>
          <button
            disabled={!todosListos || cargando}
            onClick={enviarArchivos}
            className={`text-sm font-black uppercase tracking-widest px-8 py-2.5 rounded transition-all ${
              !todosListos || cargando
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
            }`}
          >
            {cargando
              ? "Cargando..."
              : todosListos
                ? "CARGAR ARCHIVOS →"
                : "Faltan archivos"}
          </button>
        </div>
      </main>
    </div>
  );
}
