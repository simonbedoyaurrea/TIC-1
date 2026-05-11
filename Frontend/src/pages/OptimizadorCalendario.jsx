import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import ModalNuevaMateria from "../components/ModalNuevaMateria";
import apiClient from "../apis/apiClient";

// Días de la semana usados en el grid del calendario (solo lunes-viernes+sábado)
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Horas de disponibilidad para el calendario (bloques horarios de 1h)
const HOURS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

// ── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
// Renders the calendar optimization UI and maneja la lógica de selección.
export default function OptimizadorCalendario() {
  // Estado de materias traídas del backend
  const [materias, setMaterias] = useState([]);

  const [opcionesUbicacion, setOpcionesUbicacion] = useState([]);
  const [selectedUbicacionId, setSelectedUbicacionId] = useState(null);

  const [restricciones, setRestricciones] = useState({
    materia: {
      id: false,
      docente: false,
      demanda: false,
      duracion: false,
      dias: [],
      salonesPermitidos: [],
    },
    disponibilidad: false,
  });

  const RESTRICCIONES_PREVIEW = {
    Materia: restricciones.materia.id,
    Profesor: restricciones.materia.docente
      ? restricciones.disponibilidad
      : false,
    Duración: restricciones.materia.duracion,
    Vacantes: restricciones.materia.demanda,
    Salones: restricciones.materia.salonesPermitidos,
    Dias: restricciones.materia.dias,
  };

  const guardarHorario = async () => {
    if (!opcionSeleccionada) return console.error("No hay opción seleccionada");
    if (!selectedSubject) return console.error("No hay materia seleccionada");

    // Mapear días del array numérico a campos día
    const diasMap = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const diasPayload = {};
    diasMap.forEach((d) => (diasPayload[d] = ""));
    opcionSeleccionada.dias.forEach((d) => {
      diasPayload[diasMap[d]] = "X";
    });

    // Parsear hora numérica (ej: 800 → 8, 1300 → 13) a short
    const parseHora = (h) => {
      const s = h.toString().padStart(4, "0");
      return parseInt(s.slice(0, 2), 10);
    };

    const payload = {
      crn: selectedSubject.crn,
      courseName: selectedSubject.nombre,
      sessionVacancies: restricciones.materia.demanda ?? 0,
      roomCode: opcionSeleccionada.salon,
      bloque: "", // ajusta si tienes este dato
      salon: 0, // ajusta si tienes número de salón
      roomVacancies: 0, // ajusta si lo devuelve el backend
      instructorCode: restricciones.materia.docente ?? 0,
      startHour: parseHora(opcionSeleccionada.hora_inicio),
      endHour: parseHora(opcionSeleccionada.hora_fin),
      ...diasPayload,
    };

    try {
      const response = await apiClient.post(
        "simulacion/horarios/agregar",
        payload,
      );
      console.log("Horario guardado:", response.data);
      alert("✅ Horario guardado correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar el horario");
    }
  };

  //funcion mas imposrtante
  const BuscarHorario = async () => {
    const { materia, disponibilidad } = restricciones;

    // ── VALIDAR MATERIA ─────────────────

    if (!materia.id) return console.error("Materia inválida");

    if (!materia.docente) return console.error("Docente inválido");

    if (!Number.isFinite(materia.demanda) || materia.demanda <= 0)
      return console.error("Demanda inválida");

    if (
      !Number.isFinite(materia.duracion) ||
      materia.duracion < 1 ||
      materia.duracion > 4
    )
      return console.error("Duración inválida");

    if (
      !Array.isArray(materia.dias) ||
      materia.dias.length === 0 ||
      materia.dias.some((d) => d < 0 || d > 6)
    )
      return console.error("Días inválidos");

    //falta validar salones

    // ── VALIDAR DISPONIBILIDAD ───────────

    if (!disponibilidad || typeof disponibilidad !== "object")
      return console.error("Disponibilidad inválida");

    const profesores = Object.entries(disponibilidad);

    if (profesores.length === 0)
      return console.error("No hay disponibilidad registrada");

    for (const [profId, rangos] of profesores) {
      if (!Array.isArray(rangos) || rangos.length === 0)
        return console.error(`Profesor ${profId} sin rangos`);

      for (const rango of rangos) {
        if (!Array.isArray(rango) || rango.length !== 3)
          return console.error("Formato de rango inválido");

        const [dia, inicio, fin] = rango;

        if (dia < 0 || dia > 6)
          return console.error("Día inválido en disponibilidad");

        if (!Number.isFinite(inicio) || !Number.isFinite(fin) || inicio >= fin)
          return console.error("Rango horario inválido");
      }
    }

    // ── TODO OK ─────────────────────────

    console.log("Datos válidos");

    const payload = {
      materia,
      disponibilidad,
    };

    console.log(payload);

    const response = await apiClient.post(
      "simulacion/horarios/horario",
      payload,
    );

    console.log("Respuesta del backend:", response.data);

    setOpcionesUbicacion(response.data.opciones);
  };

  const handleGuardarRestricciones = (payload) => {
    setRestricciones(payload);
  };

  const [mostrarModal, setMostrarModal] = useState(false);

  // Debug: muestra cambios en restricciones en consola
  useEffect(() => {
    console.log("Restricciones actuales:", restricciones);
  }, [restricciones]);

  // Efecto para cargar materias al iniciar el componente (una sola vez)
  useEffect(() => {
    fetch("http://localhost:8080/api/simulacion/materias")
      .then((res) => res.json())
      .then((data) => {
        setMaterias(data);
        console.log(data);
      });
  }, []);

  // Estado para buscar materia por texto
  const [search, setSearch] = useState("");
  // Materia actualmente seleccionada para colocar en el calendario
  const [selectedSubject, setSelectedSubject] = useState(null);
  // Slot final confirmado (día + hora) del usuario
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Slot de vista previa al pasar el mouse
  const [previewSlot, setPreviewSlot] = useState(null);
  // Duración de la franja seleccionada en horas (1/2/3)
  const [duration, setDuration] = useState(2);
  // Identificador de opción de sala seleccionada

  // Genera un ID único para un bloque de opción de horario (usado en el mapeo)
  const getOptionId = (r) =>
    `${r.salon}-${r.hora_inicio}-${r.hora_fin}-${r.dias.join("")}`;

  // Convierte hora numérica (1200) a cadena con ':' ("12:00")
  const formatHora = (h) => {
    const s = h.toString().padStart(4, "0");
    return `${s.slice(0, 2)}:${s.slice(2)}`;
  };

  const opcionSeleccionada = opcionesUbicacion.find(
    (o) => getOptionId(o) === selectedUbicacionId,
  );

  const horaToIndex = (hora) => {
    const s = hora.toString().padStart(4, "0");
    const formatted = `${s.slice(0, 2)}:${s.slice(2)}`;
    return HOURS.indexOf(formatted);
  };

  // Determina si la opción es virtual o presencial según el identificador del salón
  const getRoomType = (r) =>
    r.salon.includes("VIRTUAL") ? "Virtual" : "Presencial";

  // Determina si una celda pertenece al rango de vista previa (duration)
  const isPreview = (dayIdx, hourIdx) => {
    if (!previewSlot) return false;
    return (
      previewSlot.day === dayIdx &&
      hourIdx >= previewSlot.startHour &&
      hourIdx < previewSlot.startHour + duration
    );
  };

  const getExistingClass = (dayIdx, hourIdx) => {
    const clases = [...bloquesSeleccionados];

    return clases.find(
      (c) =>
        c.day === dayIdx &&
        hourIdx >= c.startHour &&
        hourIdx < c.startHour + c.duration,
    );
  };

  const bloquesSeleccionados = [];

  if (opcionSeleccionada) {
    const start = horaToIndex(opcionSeleccionada.hora_inicio);
    const end = horaToIndex(opcionSeleccionada.hora_fin);
    const duration = end - start;

    opcionSeleccionada.dias.forEach((dia) => {
      bloquesSeleccionados.push({
        day: dia,
        startHour: start,
        duration,
        subject: opcionSeleccionada.materia,
        room: opcionSeleccionada.salon,
      });
    });
  }

  // Indica si la hora actual es la primera hora de una clase existente
  const isFirstHourOf = (cls, hourIdx) => cls.startHour === hourIdx;

  return (
    <div
      className="bg-black"
      style={{
        color: "#e2e8f0",
      }}
    >
      {/* ── HEADER ── */}
      <Navbar />

      {/* ── MAIN LAYOUT ── */}
      <div
        className="flex overflow-hidden mt-17 bg-black"
        style={{
          height: "calc(100vh - 70px)",
        }}
      >
        {/* ══ COL 1: MATERIAS ══ */}
        <aside className="w-[240px] min-w-[240px] border-r border-slate-800 flex flex-col text-black bg-mauve-200 overflow-hidden">
          {/* Header */}
          <div className="px-[14px] pt-[14px] pb-[10px] border-b border-slate-800">
            <div className="text-[10px] tracking-[0.12em] font-bold mb-2">
              MATERIAS DISPONIBLES
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[13px]">
                ⌕
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar materia"
                className="w-full bg-white  rounded-md py-[7px] pl-[26px] pr-[8px] text-[12px] outline-none box-border transition-colors focus:border-indigo-500"
              />
            </div>
          </div>

          {/*  lista materias */}
          <div className="flex-1 overflow-y-auto scrollbar scrollbar-thumb-red-600 scrollbar-w-[5px] px-2 py-2">
            {materias.map((m) => {
              const active = selectedSubject?.id === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedSubject(m);
                    setRestricciones((prev) => ({
                      ...prev,
                      materia: {
                        ...prev.materia,
                        id: m.subjectCourseCode,
                      },
                    }));

                    setPreviewSlot(null);
                  }}
                  className={`w-full text-left  rounded-md px-[10px] py-[8px] mb-[2px] border transition-all duration-150 cursor-pointer ${
                    active
                      ? "border bg-[#E01050] text-black"
                      : "hover:bg-mauve-500 hover:border-slate-800 border-transparent bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-[2px]">
                    <span className="text-[10px]  tracking-[0.06em]">
                      {m.crn}
                    </span>
                    <span className="text-[9px] rounded px-[5px] py-[1px]">
                      {m.creditos}cr
                    </span>
                  </div>

                  <div
                    className={`text-[12px] leading-[1.3] font-bold text-black ${
                      active ? "text-slate-100" : ""
                    }`}
                  >
                    {m.nombre}
                  </div>

                  <div className="text-[10px]  mt-[2px]">
                    {m.subjectCourseCode}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Restrictions */}
          {selectedSubject && (
            <div className="border-t border-slate-800 px-2 py-2 flex flex-col gap-0.5">
              {Object.entries(RESTRICCIONES_PREVIEW).map(([key, value]) => {
                const isActive = Array.isArray(value)
                  ? value.length > 0
                  : value !== false && value !== null && value !== undefined;
                return (
                  <div
                    key={key}
                    className={`flex  flex-col  gap-[5px] rounded-[7px] px-2 py-[7px] border transition-all duration-200 cursor-default
              ${
                isActive || key === "Salones"
                  ? "bg-white border-green-500/25 hover:bg-green-500/[0.12] hover:border-green-500/50"
                  : "bg-white border-white/[0.07] hover:bg-white/[0.05] hover:border-white/[0.15]"
              }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-[9px] font-semibold tracking-[0.08em] truncate pr-1
                ${isActive || key === "Salones" ? "text-black" : "text-black"}`}
                      >
                        {key}
                      </span>
                      <div
                        className={`w-[5px] h-[5px] rounded-full flex-shrink-0 border
                ${
                  isActive || key === "Salones"
                    ? "bg-green-500 border-green-600"
                    : "bg-[#3f1212] border-[#7f1d1d]"
                }`}
                      />
                    </div>

                    {/* Bar */}
                    <div className="w-full h-[2px] rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500
                  ${
                    isActive || key === "Salones"
                      ? "w-full bg-green-500"
                      : "w-[18%] bg-red-500/50 animate-pulse"
                  }`}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setMostrarModal(true)}
                className="flex items-center justify-between w-full bg-yellow-400 border border-yellow-400/25 rounded-lg px-3.5 py-2.5 text-black text-[11px] font-bold tracking-wide cursor-pointer transition-all hover:bg-yellow-400/[0.14] hover:border-yellow-400/50 mt-1"
              >
                <div className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1v2M6 9v2M1 6h2M9 6h2M2.5 2.5l1.5 1.5M8 8l1.5 1.5M2.5 9.5L4 8M8 4l1.5-1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Configurar restricciones
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M4 2l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

          {mostrarModal && (
            <ModalNuevaMateria
              onSave={handleGuardarRestricciones}
              onClose={() => setMostrarModal(false)}
              initialData={restricciones}
            />
          )}

          <div className="px-2 py-2 border-t border-slate-800">
            <button
              onClick={BuscarHorario}
              className="relative flex items-center justify-between bg-blue-300  rounded-lg px-[14px] py-[10px] text-black text-[11px] font-bold tracking-[0.08em] cursor-pointer w-full transition-all duration-150 hover:bg-cyan-900/50 hover:border-cyan-500/60"
            >
              <span>BUSCAR HORARIOS</span>
            </button>
            <button
              onClick={guardarHorario}
              disabled={!opcionSeleccionada}
              className={`mt-2 flex items-center justify-between rounded-lg px-[14px] py-[10px] text-black text-[11px] font-bold tracking-[0.08em] w-full transition-all duration-150
      ${
        opcionSeleccionada
          ? "bg-green-400 hover:bg-green-500 cursor-pointer"
          : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
      }`}
            >
              <span>GUARDAR HORARIO</span>
            </button>
          </div>
        </aside>

        {/* ══ COL 2: OPCIONES DE UBICACIÓN ══ */}
        <aside className=" flex flex-col w-[200px] min-w-[220px] bg-mauve-200 text-black overflow-hidden border-r border-slate-800">
          {/* Header */}
          <div className="px-[14px] pt-[14px] pb-[10px] border-b border-slate-800">
            <div className="text-[10px] tracking-[0.12em] font-bold  mb-2">
              OPCIONES DE UBICACIÓN
            </div>
          </div>

          {/* Rooms */}
          <div className="flex-1 overflow-auto p-[8px] scrollbar scrollbar-thumb-red-600 scrollbar-w-[5px]">
            {opcionesUbicacion.map((r, idx) => {
              const id = getOptionId(r);
              const active = selectedUbicacionId === id;

              return (
                <button
                  key={id}
                  onClick={() => setSelectedUbicacionId(id)}
                  className={`w-full rounded-2xl border mb-1 p-[9px] text-left transition-all
        ${
          active
            ? "bg-yellow-500/20 border-yellow-400/40"
            : "bg-transparent border-transparent hover:bg-[#12121f] hover:border-slate-800"
        }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[13px] font-bold ${
                        active ? "text-yellow-400" : "text-slate-400"
                      }`}
                    >
                      {r.salon}
                    </span>

                    <span className="text-[9px] bg-yellow-500/10 text-yellow-400 rounded px-[5px] py-[1px] ml-1 flex-shrink-0">
                      {getRoomType(r)}
                    </span>
                  </div>

                  {/* Materia */}
                  <div className="text-[11px] text-slate-500 mt-[2px]">
                    {r.materia}
                  </div>

                  {/* Días */}
                  <div className="text-[10px] text-slate-600 mt-[3px]">
                    {r.dias_nombre.join(" / ")}
                  </div>

                  {/* Horario */}
                  <div className="text-[10px] text-slate-500">
                    {formatHora(r.hora_inicio)} - {formatHora(r.hora_fin)}
                  </div>

                  {active && (
                    <div className="mt-[5px] text-[10px] text-yellow-400">
                      ✓ Seleccionado
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ══ COL 3: CALENDARIO ══ */}
        <main className="flex flex-col flex-1 bg-mauve-200 overflow-hidden">
          <div className="flex-1 overflow-auto scrollbar scrollbar-thumb-red-600 scrollbar-w-[5px] pb-4">
            <div className="min-w-[700px] ">
              {/* Day headers */}
              <div className=" grid grid-cols-[52px_repeat(6,1fr)] sticky top-0 z-10 bg-mauve-200 border-b border-[#1e293b]">
                <div className="py-2" />
                {DAYS.map((d, i) => (
                  <div
                    key={d}
                    className={`py-2 text-center bg-blue-400 text-[11px] font-bold tracking-[0.08em] border-l border-[#1e293b] text-black`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {HOURS.map((hour, hi) => {
                return (
                  <div
                    key={hour}
                    className="grid bg-blue-400 font-bold text-black grid-cols-[52px_repeat(6,1fr)] border-b border-black/20"
                  >
                    <div
                      className={`px-2.5 flex items-center justify-end text-[10px] border-r border-[#1e293b] h-9 ext-[#334155]`}
                    >
                      {hour}
                    </div>

                    {DAYS.map((_, di) => {
                      const existingCls = getExistingClass(di, hi);
                      const preview = isPreview(di, hi);

                      return (
                        <div
                          key={di}
                          onClick={() =>
                            !existingCls && handleCalendarClick(di, hi)
                          }
                          onMouseLeave={() => setPreviewSlot(null)}
                          className={`h-9 box-border relative transition-colors bg-mauve-200 outline outline-1 outline-black/20 outline-offset-[-1]`}
                          style={{
                            cursor: existingCls
                              ? "default"
                              : selectedSubject
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {/* Existing class block */}
                          {existingCls && isFirstHourOf(existingCls, hi) && (
                            <div
                              className="absolute left-0 right-0 top-0 z-20 overflow-hidden bg-amber-300/20 border-l-2 border-l-amber-300"
                              style={{
                                height: `${existingCls.duration * 36}px`,
                                borderLeft: `2px solid ${existingCls.color}`,
                              }}
                            >
                              {isFirstHourOf(existingCls, hi) && (
                                <div
                                  className="text-[9px] font-bold tracking-[0.04em]"
                                  style={{ color: existingCls.color }}
                                >
                                  {existingCls.subject}
                                  <span
                                    style={{ color: "#475569", marginLeft: 4 }}
                                  >
                                    {existingCls.room}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Preview label */}
                          {preview &&
                            previewSlot &&
                            hi === previewSlot.startHour && (
                              <div className="absolute inset-0 flex items-center justify-center z-30">
                                <span className="text-[9px] text-[#818cf8] tracking-[0.06em]">
                                  {selectedSubject?.code} ({duration}h)
                                </span>
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
