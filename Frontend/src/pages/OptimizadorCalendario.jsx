import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import ModalNuevaMateria from "../components/ModalNuevaMateria";

import {
  agregarHorarioService,
  BuscarHorariosService,
  obtenerMateriasService,
} from "../services/AlgoritmoService";

// ── DÍAS ─────────────────────────────────────────────
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// ── HORAS ────────────────────────────────────────────
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

export default function OptimizadorCalendario() {
  // ── STATES ────────────────────────────────────────
  const [materias, setMaterias] = useState([]);
  const [opcionesUbicacion, setOpcionesUbicacion] = useState([]);
  const [selectedUbicacionId, setSelectedUbicacionId] =
    useState(null);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [restricciones, setRestricciones] =
    useState({
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

  const [search, setSearch] = useState("");

  const [selectedSubject, setSelectedSubject] =
    useState(null);

  const [previewSlot, setPreviewSlot] =
    useState(null);

  const [duration] = useState(2);

  // ── PREVIEW RESTRICCIONES ─────────────────────────
  const RESTRICCIONES_PREVIEW = {
    Materia: restricciones.materia.id,

    Profesor: restricciones.materia.docente
      ? restricciones.disponibilidad
      : false,

    Duración: restricciones.materia.duracion,

    Vacantes: restricciones.materia.demanda,

    Salones:
      restricciones.materia.salonesPermitidos,

    Dias: restricciones.materia.dias,
  };

  // ── CARGAR MATERIAS ───────────────────────────────
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const data =
          await obtenerMateriasService();

        setMaterias(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarMaterias();
  }, []);

  // ── HELPERS ───────────────────────────────────────
  const getOptionId = (r) =>
    `${r.salon}-${r.hora_inicio}-${r.hora_fin}-${r.dias.join(
      ""
    )}`;

  const formatHora = (h) => {
    const s = h.toString().padStart(4, "0");

    return `${s.slice(0, 2)}:${s.slice(2)}`;
  };

  const horaToIndex = (hora) => {
    const s = hora.toString().padStart(4, "0");

    const formatted = `${s.slice(
      0,
      2
    )}:${s.slice(2)}`;

    return HOURS.indexOf(formatted);
  };

  const getRoomType = (r) =>
    r.salon.includes("VIRTUAL")
      ? "Virtual"
      : "Presencial";

  // ── OPCIÓN SELECCIONADA ───────────────────────────
  const opcionSeleccionada =
    opcionesUbicacion.find(
      (o) =>
        getOptionId(o) === selectedUbicacionId
    );

  // ── GUARDAR RESTRICCIONES ─────────────────────────
  const handleGuardarRestricciones = (
    payload
  ) => {
    setRestricciones(payload);
  };

  // ── BUSCAR HORARIO ────────────────────────────────
  const BuscarHorario = async () => {
    const { materia, disponibilidad } =
      restricciones;

    if (!materia.id)
      return console.error("Materia inválida");

    if (!materia.docente)
      return console.error("Docente inválido");

    if (
      !Number.isFinite(materia.demanda) ||
      materia.demanda <= 0
    )
      return console.error("Demanda inválida");

    if (
      !Number.isFinite(materia.duracion) ||
      materia.duracion < 1 ||
      materia.duracion > 4
    )
      return console.error("Duración inválida");

    if (
      !Array.isArray(materia.dias) ||
      materia.dias.length === 0
    )
      return console.error("Días inválidos");

    const payload = {
      materia,
      disponibilidad,
    };

    try {
      const response =
        await BuscarHorariosService(payload);

      setOpcionesUbicacion(
        response.data.opciones
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ── GUARDAR HORARIO ───────────────────────────────
  const guardarHorario = async () => {
    if (!opcionSeleccionada) return;

    if (!selectedSubject) return;

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

    const parseHora = (h) => {
      const s = h.toString().padStart(4, "0");

      return parseInt(s.slice(0, 2), 10);
    };

    const payload = {
      crn: selectedSubject.crn,

      courseName: selectedSubject.nombre,

      sessionVacancies:
        restricciones.materia.demanda ?? 0,

      roomCode: opcionSeleccionada.salon,

      bloque: "",

      salon: 0,

      roomVacancies: 0,

      instructorCode:
        restricciones.materia.docente ?? 0,

      startHour: parseHora(
        opcionSeleccionada.hora_inicio
      ),

      endHour: parseHora(
        opcionSeleccionada.hora_fin
      ),

      ...diasPayload,
    };

    try {
      await agregarHorarioService(payload);

      alert("✅ Horario guardado correctamente");
    } catch (err) {
      console.error(err);

      alert("❌ Error al guardar el horario");
    }
  };

  // ── BLOQUES SELECCIONADOS ─────────────────────────
  const bloquesSeleccionados = [];

  if (opcionSeleccionada) {
    const start = horaToIndex(
      opcionSeleccionada.hora_inicio
    );

    const end = horaToIndex(
      opcionSeleccionada.hora_fin
    );

    const duration = end - start;

    opcionSeleccionada.dias.forEach((dia) => {
      bloquesSeleccionados.push({
        day: dia,

        startHour: start,

        duration,

        subject: opcionSeleccionada.materia,

        room: opcionSeleccionada.salon,

        color: "#facc15",
      });
    });
  }

  // ── PREVIEW ───────────────────────────────────────
  const isPreview = (dayIdx, hourIdx) => {
    if (!previewSlot) return false;

    return (
      previewSlot.day === dayIdx &&
      hourIdx >= previewSlot.startHour &&
      hourIdx <
        previewSlot.startHour + duration
    );
  };

  // ── CLASE EXISTENTE ───────────────────────────────
  const getExistingClass = (
    dayIdx,
    hourIdx
  ) => {
    return bloquesSeleccionados.find(
      (c) =>
        c.day === dayIdx &&
        hourIdx >= c.startHour &&
        hourIdx <
          c.startHour + c.duration
    );
  };

  // ── FIRST HOUR ────────────────────────────────────
  const isFirstHourOf = (cls, hourIdx) =>
    cls.startHour === hourIdx;

  // ──────────────────────────────────────────────────
  // ── RENDER ───────────────────────────────────────
  // ──────────────────────────────────────────────────

  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">
      <Navbar />

      <div
        className="
          flex
          overflow-hidden
          pt-20
          bg-[var(--bg-primary)]
        "
        style={{
          height: "100vh",
        }}
      >
        {/* ═══════════════════════════════════════ */}
        {/* ══ COL 1 · MATERIAS ══════════════════ */}
        {/* ═══════════════════════════════════════ */}

        <aside
          className="
            w-[240px]
            min-w-[240px]
            border-r
            border-[var(--border-subtle)]
            flex
            flex-col
            bg-[var(--bg-secondary)]
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              px-[14px]
              pt-[14px]
              pb-[10px]
              border-b
              border-[var(--border-subtle)]
            "
          >
            <div
              className="
                text-[10px]
                tracking-[0.12em]
                font-bold
                mb-2
              "
            >
              MATERIAS DISPONIBLES
            </div>

            {/* SEARCH */}
            <div className="relative">
              <span
                className="
                  absolute
                  left-[9px]
                  top-1/2
                  -translate-y-1/2
                  text-[13px]
                  text-[var(--text-muted)]
                "
              >
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Buscar materia"
                className="
                  w-full
                  bg-[var(--bg-card)]
                  border
                  border-[var(--border-subtle)]
                  rounded-md
                  py-[7px]
                  pl-[26px]
                  pr-[8px]
                  text-[12px]
                  outline-none
                  transition-all
                  focus:border-yellow-500/60
                "
              />
            </div>
          </div>

          {/* LISTA */}
          <div
            className="
              flex-1
              overflow-y-auto
              scrollbar
              scrollbar-thumb-red-700
              scrollbar-w-[5px]
              px-2
              py-2
            "
          >
            {materias
              .filter((m) =>
                m.nombre
                  ?.toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((m) => {
                const active =
                  selectedSubject?.id === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedSubject(m);

                      setRestricciones(
                        (prev) => ({
                          ...prev,

                          materia: {
                            ...prev.materia,

                            id:
                              m.subjectCourseCode,
                          },
                        })
                      );

                      setPreviewSlot(null);
                    }}
                    className={`
                      w-full
                      text-left
                      rounded-xl
                      px-[10px]
                      py-[8px]
                      mb-[4px]
                      border
                      transition-all
                      duration-150
                      cursor-pointer
                      ${
                        active
                          ? "bg-red-900/50 border-red-700 text-white shadow-lg shadow-red-950/20"
                          : "bg-[var(--bg-card)] border-transparent hover:border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)]"
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mb-[2px]
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          tracking-[0.06em]
                          text-[var(--text-secondary)]
                        "
                      >
                        {m.crn}
                      </span>

                      <span
                        className="
                          text-[9px]
                          rounded
                          px-[5px]
                          py-[1px]
                          bg-yellow-500/10
                          text-yellow-400
                        "
                      >
                        {m.creditos}cr
                      </span>
                    </div>

                    <div
                      className="
                        text-[12px]
                        leading-[1.3]
                        font-bold
                      "
                    >
                      {m.nombre}
                    </div>

                    <div
                      className="
                        text-[10px]
                        mt-[2px]
                        text-[var(--text-secondary)]
                      "
                    >
                      {m.subjectCourseCode}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* RESTRICCIONES */}
          {selectedSubject && (
            <div
              className="
                border-t
                border-[var(--border-subtle)]
                px-2
                py-2
                flex
                flex-col
                gap-1
              "
            >
              {Object.entries(
                RESTRICCIONES_PREVIEW
              ).map(([key, value]) => {
                const isActive =
                  Array.isArray(value)
                    ? value.length > 0
                    : value !== false &&
                      value !== null &&
                      value !== undefined;

                return (
                  <div
                    key={key}
                    className={`
                      flex
                      flex-col
                      gap-[5px]
                      rounded-[7px]
                      px-2
                      py-[7px]
                      border
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-[var(--bg-card)] border-green-500/25"
                          : "bg-[var(--bg-card)] border-[var(--border-subtle)]"
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          font-mono
                          text-[9px]
                          font-semibold
                          tracking-[0.08em]
                          text-[var(--text-primary)]
                        "
                      >
                        {key}
                      </span>

                      <div
                        className={`
                          w-[5px]
                          h-[5px]
                          rounded-full
                          border
                          ${
                            isActive
                              ? "bg-green-500 border-green-600"
                              : "bg-red-900 border-red-700"
                          }
                        `}
                      />
                    </div>

                    <div
                      className="
                        w-full
                        h-[2px]
                        rounded-full
                        bg-[var(--bg-tertiary)]
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
                            isActive
                              ? "w-full bg-green-500"
                              : "w-[18%] bg-red-500/50"
                          }
                        `}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() =>
                  setMostrarModal(true)
                }
                className="
                  flex
                  items-center
                  justify-between
                  w-full
                  bg-yellow-400
                  border
                  border-yellow-300
                  rounded-lg
                  px-3.5
                  py-2.5
                  text-[#1a1208]
                  dark:text-black
                  text-[11px]
                  font-bold
                  tracking-wide
                  transition-all
                  hover:brightness-105
                  mt-1
                "
              >
                <div className="flex items-center gap-2">
                  Configurar restricciones
                </div>

                →
              </button>
            </div>
          )}

          {/* MODAL */}
          {mostrarModal && (
            <ModalNuevaMateria
              onSave={
                handleGuardarRestricciones
              }
              onClose={() =>
                setMostrarModal(false)
              }
              initialData={restricciones}
            />
          )}

          {/* ACTIONS */}
          <div
            className="
              px-2
              py-2
              border-t
              border-[var(--border-subtle)]
            "
          >
            <button
              onClick={BuscarHorario}
              className="
                flex
                items-center
                justify-between
                bg-[var(--accent-red)]
                border
                border-red-700
                rounded-lg
                px-[14px]
                py-[10px]
                text-white
                text-[11px]
                font-bold
                tracking-[0.08em]
                cursor-pointer
                w-full
                transition-all
                duration-150
                hover:brightness-110
                hover:border-yellow-500/60
                shadow-lg
                shadow-red-950/30
              "
            >
              <span>
                BUSCAR HORARIOS
              </span>
            </button>

            <button
              onClick={guardarHorario}
              disabled={
                !opcionSeleccionada
              }
              className={`
                mt-2
                flex
                items-center
                justify-between
                rounded-lg
                px-[14px]
                py-[10px]
                text-[11px]
                font-bold
                tracking-[0.08em]
                w-full
                transition-all
                duration-150
                border
                ${
                  opcionSeleccionada
                    ? "bg-yellow-400 text-[#1a1208] dark:text-black border-yellow-300 hover:brightness-105 shadow-lg shadow-yellow-500/20 cursor-pointer"
                    : "bg-red-950/40 text-[var(--text-secondary)] border-red-900/40 cursor-not-allowed opacity-90"
                }
              `}
            >
              <span>
                GUARDAR HORARIO
              </span>
            </button>
          </div>
        </aside>

        {/* ═══════════════════════════════════════ */}
        {/* ══ COL 2 · UBICACIONES ═══════════════ */}
        {/* ═══════════════════════════════════════ */}

        <aside
          className="
            flex
            flex-col
            w-[220px]
            min-w-[220px]
            bg-[var(--bg-secondary)]
            overflow-hidden
            border-r
            border-[var(--border-subtle)]
          "
        >
          {/* HEADER */}
          <div
            className="
              px-[14px]
              pt-[14px]
              pb-[10px]
              border-b
              border-[var(--border-subtle)]
            "
          >
            <div
              className="
                text-[10px]
                tracking-[0.12em]
                font-bold
                mb-2
              "
            >
              OPCIONES DE UBICACIÓN
            </div>
          </div>

          {/* ROOMS */}
          <div
            className="
              flex-1
              overflow-auto
              p-[8px]
              scrollbar
              scrollbar-thumb-red-700
              scrollbar-w-[5px]
            "
          >
            {opcionesUbicacion.map((r) => {
              const id = getOptionId(r);

              const active =
                selectedUbicacionId === id;

              return (
                <button
                  key={id}
                  onClick={() =>
                    setSelectedUbicacionId(
                      id
                    )
                  }
                  className={`
                    w-full
                    rounded-2xl
                    border
                    mb-1
                    p-[9px]
                    text-left
                    transition-all
                    ${
                      active
                        ? "bg-yellow-500/20 border-yellow-400/40"
                        : "bg-transparent border-transparent hover:bg-[var(--bg-card)] hover:border-[var(--border-subtle)]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      justify-between
                      items-start
                    "
                  >
                    <span
                      className={`
                        text-[13px]
                        font-bold
                        ${
                          active
                            ? "text-yellow-400"
                            : "text-[var(--text-primary)]"
                        }
                      `}
                    >
                      {r.salon}
                    </span>

                    <span
                      className="
                        text-[9px]
                        bg-yellow-500/10
                        text-yellow-400
                        rounded
                        px-[5px]
                        py-[1px]
                        ml-1
                        flex-shrink-0
                      "
                    >
                      {getRoomType(r)}
                    </span>
                  </div>

                  <div
                    className="
                      text-[11px]
                      text-[var(--text-secondary)]
                      mt-[2px]
                    "
                  >
                    {r.materia}
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-[var(--text-muted)]
                      mt-[3px]
                    "
                  >
                    {r.dias_nombre.join(
                      " / "
                    )}
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-[var(--text-secondary)]
                    "
                  >
                    {formatHora(
                      r.hora_inicio
                    )}{" "}
                    -{" "}
                    {formatHora(
                      r.hora_fin
                    )}
                  </div>

                  {active && (
                    <div
                      className="
                        mt-[5px]
                        text-[10px]
                        text-yellow-400
                      "
                    >
                      ✓ Seleccionado
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ═══════════════════════════════════════ */}
        {/* ══ COL 3 · CALENDARIO ════════════════ */}
        {/* ═══════════════════════════════════════ */}

        <main
          className="
            flex
            flex-col
            flex-1
            bg-[var(--bg-secondary)]
            overflow-hidden
          "
        >
          <div
            className="
              flex-1
              overflow-auto
              scrollbar
              scrollbar-thumb-red-700
              scrollbar-w-[5px]
              pb-4
            "
          >
            <div className="min-w-[700px]">
              {/* DAYS */}
              <div
                className="
                  grid
                  grid-cols-[52px_repeat(6,1fr)]
                  sticky
                  top-0
                  z-10
                  bg-[var(--bg-secondary)]
                  border-b
                  border-[var(--border-subtle)]
                "
              >
                <div className="py-2" />

                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="
                      py-2
                      text-center
                      bg-red-900/70
                      text-[11px]
                      font-bold
                      tracking-[0.08em]
                      border-l
                      border-[var(--border-subtle)]
                      text-white
                    "
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* GRID */}
              {HOURS.map((hour, hi) => (
                <div
                  key={hour}
                  className="
                    grid
                    grid-cols-[52px_repeat(6,1fr)]
                    border-b
                    border-black/20
                  "
                >
                  {/* HOUR */}
                  <div
                    className="
                      px-2.5
                      flex
                      items-center
                      justify-end
                      text-[10px]
                      border-r
                      border-[var(--border-subtle)]
                      h-9
                      bg-red-900/70
                      text-white
                      font-bold
                    "
                  >
                    {hour}
                  </div>

                  {/* CELLS */}
                  {DAYS.map((_, di) => {
                    const existingCls =
                      getExistingClass(
                        di,
                        hi
                      );

                    const preview =
                      isPreview(
                        di,
                        hi
                      );

                    return (
                      <div
                        key={di}
                        onMouseLeave={() =>
                          setPreviewSlot(
                            null
                          )
                        }
                        className="
                          h-9
                          box-border
                          relative
                          transition-colors
                          bg-[var(--bg-secondary)]
                          outline
                          outline-1
                          outline-black/20
                          outline-offset-[-1]
                        "
                      >
                        {/* EXISTING */}
                        {existingCls &&
                          isFirstHourOf(
                            existingCls,
                            hi
                          ) && (
                            <div
                              className="
                                absolute
                                left-0
                                right-0
                                top-0
                                z-20
                                overflow-hidden
                                bg-amber-300/20
                                border-l-2
                                border-l-amber-300
                              "
                              style={{
                                height: `${existingCls.duration * 36}px`,
                              }}
                            >
                              <div
                                className="
                                  text-[9px]
                                  font-bold
                                  tracking-[0.04em]
                                  text-yellow-300
                                "
                              >
                                {
                                  existingCls.subject
                                }

                                <span
                                  className="
                                    text-[var(--text-secondary)]
                                    ml-1
                                  "
                                >
                                  {
                                    existingCls.room
                                  }
                                </span>
                              </div>
                            </div>
                          )}

                        {/* PREVIEW */}
                        {preview &&
                          previewSlot &&
                          hi ===
                            previewSlot.startHour && (
                            <div
                              className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                z-30
                              "
                            >
                              <span
                                className="
                                  text-[9px]
                                  text-indigo-400
                                  tracking-[0.06em]
                                "
                              >
                                {
                                  selectedSubject?.code
                                }{" "}
                                (
                                {
                                  duration
                                }
                                h)
                              </span>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}