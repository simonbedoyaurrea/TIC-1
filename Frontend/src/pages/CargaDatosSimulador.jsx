import { useState } from "react";

const API = "http://localhost:8080/api/simulacion/carga";

const ARCHIVOS = [
  {
    id: "programacion-sin-docentes",
    numero: 0,
    titulo: "Programación sin docentes",
    subtitulo: "Estructura curricular por programa",
    campos: [
      { nombre: "Código programa", requerido: true },
      { nombre: "Nombre programa", requerido: true },
      { nombre: "Semestres", requerido: true },
      { nombre: "Facultad", requerido: false },
    ],
  },
  {
    id: "asignaturas",
    numero: 1,
    titulo: "Asignaturas",
    subtitulo: "Catálogo de materias del periodo",
    campos: [
      { nombre: "Código materia", requerido: true },
      { nombre: "Nombre materia", requerido: true },
      { nombre: "Créditos", requerido: true },
      { nombre: "Semestre", requerido: true },
      { nombre: "Tipo", requerido: false },
    ],
  },
  {
    id: "restricciones-edificio",
    numero: 2,
    titulo: "Restricciones Edificio",
    subtitulo: "Restricciones de aulas por asignatura",
    campos: [
      { nombre: "Código materia", requerido: true },
      { nombre: "Edificio", requerido: true },
      { nombre: "Tipo aula", requerido: true },
      { nombre: "Observaciones", requerido: false },
    ],
  },
  {
    id: "demandas",
    numero: 3,
    titulo: "Demandas",
    subtitulo: "Demanda esperada por asignatura",
    campos: [
      { nombre: "Código materia", requerido: true },
      { nombre: "Grupos", requerido: true },
      { nombre: "Estudiantes", requerido: true },
      { nombre: "Periodo", requerido: false },
    ],
  },
  {
    id: "docentes-catalogo",
    numero: 4,
    titulo: "Docentes Catálogo",
    subtitulo: "Información base de docentes",
    campos: [
      { nombre: "Código docente", requerido: true },
      { nombre: "Nombre completo", requerido: true },
      { nombre: "Email", requerido: true },
      { nombre: "Tipo", requerido: true },
      { nombre: "Departamento", requerido: false },
    ],
  },
  {
    id: "docentes-disponibilidad",
    numero: 5,
    titulo: "Docentes Disponibilidad",
    subtitulo: "Franjas horarias disponibles",
    campos: [
      { nombre: "Código docente", requerido: true },
      { nombre: "Día semana", requerido: true },
      { nombre: "Hora inicio", requerido: true },
      { nombre: "Hora fin", requerido: true },
    ],
  },
  {
    id: "docentes-asignaturas",
    numero: 6,
    titulo: "Docentes Asignaturas",
    subtitulo: "Relación docente y materia",
    campos: [
      { nombre: "Código docente", requerido: true },
      { nombre: "Código materia", requerido: true },
      { nombre: "Habilitado", requerido: false },
    ],
  },
];

export default function CargaDatosSimulador() {
  const [archivos, setArchivos] = useState({});
  const [cargando, setCargando] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [jobId, setJobId] = useState(null);

  const totalCargados = Object.keys(archivos).length;
  const todosListos = totalCargados === ARCHIVOS.length;

  const subirTodos = async () => {
    if (!todosListos) {
      alert("Debes subir los 7 archivos");
      return;
    }

    const formData = new FormData();
    formData.append("asignaturas", archivos["asignaturas"]);
    formData.append("docentes_cat", archivos["docentes-catalogo"]);
    formData.append("disponibilidad", archivos["docentes-disponibilidad"]);
    formData.append("doc_asignaturas", archivos["docentes-asignaturas"]);
    formData.append("restricciones_ed", archivos["restricciones-edificio"]);
    formData.append("programacion", archivos["programacion-sin-docentes"]);
    formData.append("demandas", archivos["demandas"]);

    try {
      setCargando(true);
      const res = await fetch(API, { method: "POST", body: formData });
      const data = await res.json();
      setJobId(data.jobId);
      localStorage.setItem("jobId", data.jobId);
      alert("Simulación iniciada ");
    } catch (error) {
      console.error(error);
      alert("Error al enviar archivos");
    } finally {
      setCargando(false);
    }
  };

  const seleccionarArchivo = (id, file) => {
    if (!file) return;
    setArchivos((prev) => ({ ...prev, [id]: file }));
  };

  const eliminarArchivo = (id) => {
    setArchivos((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  const limpiarTodo = () => setArchivos({});

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HEADER */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-black text-2xl tracking-widest text-red-500">
            UPB
          </span>
          <span className="w-px h-6 bg-zinc-700" />
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            Generador de Horarios
          </span>
          <span className="text-xs font-mono text-red-400 border border-red-800 px-2 py-0.5 rounded">
            ADMIN
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-500 border border-zinc-700 px-3 py-1 rounded">
          Periodo 2026-1
        </span>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-1">
            Carga masiva de archivos
          </h1>
          <p className="text-zinc-400 text-sm">
            Sube los 7 archivos Excel requeridos para generar el horario
            académico.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {ARCHIVOS.map((sec) => {
            const archivoActual = archivos[sec.id];

            return (
              <div
                key={sec.id}
                className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex flex-col transition-all"
              >
                {/* Cabecera */}
                <div className="px-4 pt-4 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-red-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {sec.numero}
                    </span>
                    <p className="font-black text-sm uppercase tracking-wide text-white truncate">
                      {sec.titulo}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500">{sec.subtitulo}</p>
                </div>

                {/* Dropzone */}
                <div className="px-4 py-3">
                  {archivoActual ? (
                    <div className="border border-zinc-700 rounded bg-zinc-900 px-3 py-2 flex items-center justify-between">
                      <span className="text-xs text-zinc-300 truncate font-mono">
                        {archivoActual.name}
                      </span>
                      <button
                        onClick={() => eliminarArchivo(sec.id)}
                        className="text-zinc-600 hover:text-red-400 ml-2 shrink-0"
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
                        seleccionarArchivo(sec.id, e.dataTransfer.files[0]);
                      }}
                      className={`flex flex-col items-center justify-center border border-dashed rounded cursor-pointer py-4 px-3 transition-all ${
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
                        className="w-6 h-6 text-zinc-600 mb-1"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-xs text-zinc-400">
                        .xlsx · máx. 10 MB
                      </p>
                      <input
                        id={`file-${sec.id}`}
                        type="file"
                        accept=".xlsx,.csv"
                        className="hidden"
                        onChange={(e) =>
                          seleccionarArchivo(sec.id, e.target.files[0])
                        }
                      />
                    </label>
                  )}
                </div>

                {/* Columnas */}
                <div className="px-4 pb-4 flex-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1">
                    Columnas
                  </p>
                  {sec.campos.map((campo) => (
                    <div
                      key={campo.nombre}
                      className="flex items-center justify-between py-0.5"
                    >
                      <span className="text-xs text-zinc-400">
                        {campo.nombre}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                          campo.requerido
                            ? "bg-red-950 text-red-400"
                            : "bg-zinc-900 text-zinc-600"
                        }`}
                      >
                        {campo.requerido ? "req" : "opt"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* RESUMEN */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Resumen de carga
          </p>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Seleccionados",
                valor: totalCargados,
                color: "text-white",
                bg: "bg-zinc-900 border-zinc-700",
              },
              {
                label: "Faltantes",
                valor: ARCHIVOS.length - totalCargados,
                color: "text-yellow-400",
                bg: "bg-yellow-950 border-yellow-800",
              },
              {
                label: "Total",
                valor: ARCHIVOS.length,
                color: "text-zinc-400",
                bg: "bg-zinc-900 border-zinc-700",
              },
              {
                label: "Listos",
                valor: todosListos ? "✓" : "—",
                color: todosListos ? "text-green-400" : "text-zinc-600",
                bg: todosListos
                  ? "bg-green-950 border-green-800"
                  : "bg-zinc-900 border-zinc-700",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded border px-4 py-3 ${item.bg}`}
              >
                <p className={`text-2xl font-black ${item.color}`}>
                  {item.valor}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-between">
          <button
            onClick={limpiarTodo}
            className="text-sm text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-5 py-2.5 rounded transition-all uppercase tracking-wide font-bold"
          >
            Limpiar todo
          </button>
          <button
            onClick={subirTodos}
            disabled={!todosListos || cargando}
            className={`text-sm font-black uppercase tracking-widest px-6 py-2.5 rounded transition-all border ${
              todosListos && !cargando
                ? "bg-zinc-900 border-zinc-600 text-white hover:bg-zinc-800 cursor-pointer"
                : "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            {cargando ? "Enviando..." : "Subir todos →"}
          </button>
        </div>
      </main>
    </div>
  );
}
