import { useState } from "react";

// ── Configuración de secciones ────────────────────────────────
const SECCIONES = [
  {
    id: "docentes",
    titulo: "Docentes",
    subtitulo: "Información del cuerpo docente",
    color: "blue",
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    campos: [
      { nombre: "Nombre completo", requerido: true },
      { nombre: "Código docente", requerido: true },
      { nombre: "Departamento", requerido: true },
      { nombre: "Horas máx. semanales", requerido: true },
      { nombre: "Disponibilidad horaria", requerido: false },
    ],
  },
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
    id: "aulas",
    titulo: "Aulas",
    subtitulo: "Espacios físicos disponibles",
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
  blue: {
    icon: "bg-blue-950 text-blue-400",
    border: "border-blue-800",
    badge: "bg-blue-950 text-blue-400",
  },
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

// ── Pasos del flujo ───────────────────────────────────────────
const PASOS = ["Cargar archivos", "Validar datos", "Generar horario"];

export default function CargaDatosHorario() {
  const [archivos, setArchivos] = useState({
    docentes: null,
    materias: null,
    aulas: null,
  });
  const [dragging, setDragging] = useState(null);
  const [pasoActivo] = useState(0);

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
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl tracking-widest text-red-500">
            OPTIU
          </span>
          <span className="w-px h-6 bg-zinc-700" />
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            Generador de Horarios
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            Carga de datos
          </h1>
          <p className="text-zinc-400 text-sm">
            Sube los archivos Excel o CSV con la información requerida para
            generar el horario académico.
          </p>
        </div>

        {/* PASOS */}
        <div className="flex items-center gap-0 mb-10">
          {PASOS.map((paso, i) => (
            <div key={paso} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 border text-sm font-bold uppercase tracking-wide transition-all ${
                  i === pasoActivo
                    ? "border-red-500 bg-red-950 text-red-400"
                    : i < pasoActivo
                      ? "border-zinc-600 bg-zinc-900 text-zinc-400"
                      : "border-zinc-800 bg-transparent text-zinc-600"
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center text-xs font-black border rounded-full ${
                    i === pasoActivo
                      ? "border-red-500 text-red-400"
                      : "border-zinc-700 text-zinc-600"
                  }`}
                >
                  {i + 1}
                </span>
                {paso}
              </div>
              {i < PASOS.length - 1 && <div className="w-8 h-px bg-zinc-700" />}
            </div>
          ))}
        </div>

        {/* AVISO */}
        <div className="flex items-start gap-3 bg-zinc-900 border border-zinc-700 rounded px-4 py-3 mb-8">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Los{" "}
            <span className="text-white font-semibold">
              tres archivos son obligatorios
            </span>{" "}
            para continuar al siguiente paso. Descarga cada plantilla para
            asegurarte de usar el formato correcto antes de subir tu archivo.
          </p>
        </div>

        {/* TARJETAS DE SECCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {SECCIONES.map((sec) => {
            const c = COLOR_MAP[sec.color];
            const archivoActual = archivos[sec.id];
            return (
              <div
                key={sec.id}
                className={`bg-zinc-950 border rounded-lg overflow-hidden transition-all ${
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
                      <p className="font-black text-base uppercase tracking-wide text-white">
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
                      <p className="text-xs text-zinc-400 text-center mb-1">
                        Arrastra tu archivo aquí
                      </p>
                      <p className="text-xs text-zinc-600 text-center">
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

                {/* Campos requeridos */}
                <div className="px-5 pb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2">
                    Columnas esperadas
                  </p>
                  <div className="flex flex-col gap-1">
                    {sec.campos.map((campo) => (
                      <div
                        key={campo.nombre}
                        className="flex items-center justify-between py-1 border-b border-zinc-900 last:border-0"
                      >
                        <span className="text-xs text-zinc-300">
                          {campo.nombre}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${
                            campo.requerido
                              ? "bg-red-950 text-red-400"
                              : "bg-zinc-900 text-zinc-600"
                          }`}
                        >
                          {campo.requerido ? "requerido" : "opcional"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plantilla */}
                <div className="px-5 pb-5 flex items-center justify-between border-t border-zinc-900 pt-3">
                  <span className="text-xs text-zinc-600">
                    Plantilla disponible
                  </span>
                  <button className="text-xs font-bold text-yellow-400 border border-yellow-800 hover:bg-yellow-950 px-3 py-1 rounded transition-colors uppercase tracking-wide">
                    Descargar .xlsx
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RESUMEN DE ESTADO */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 mb-8">
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

        {/* ACCIONES */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setArchivos({ docentes: null, materias: null, aulas: null })
            }
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-5 py-2.5 rounded transition-all uppercase tracking-wide font-bold"
          >
            Limpiar todo
          </button>
          <button
            disabled={!todosListos}
            className={`text-sm font-black uppercase tracking-widest px-8 py-2.5 rounded transition-all ${
              todosListos
                ? "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            {todosListos ? "Continuar a validación →" : "Faltan archivos"}
          </button>
        </div>
      </main>
    </div>
  );
}
