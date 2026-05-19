import { useState } from "react";
import { enviarReporte } from "../services/ReporteService";
import { Notebook, PenTool, ShieldUser } from "lucide-react";

import { useTheme } from "../context/ThemeContext";

// ---── Bloques UPB ──────────────────────────────────────────────
const BLOQUES = [
  {
    num: 1,
    nombre: "Templo Universitario Ntra. Sra. del Santísimo Sacramento",
  },
  { num: 2, nombre: "Aula Magna Mons. Manuel José Sierra" },
  { num: 3, nombre: "Bloque Rectoral" },
  { num: 4, nombre: "Colegio UPB · Primaria y Preescolar" },
  { num: 5, nombre: "Colegio UPB · Bachillerato" },
  {
    num: 6,
    nombre: "Economía, Administración, Teología, Filosofía · Auditorio Pío XII",
  },
  { num: 7, nombre: "Ciencias Sociales" },
  {
    num: 8,
    nombre: "Centro de Production Audiovisual CPA / Talleres y Laboratorios",
  },
  { num: 9, nombre: "Postgrados" },
  {
    num: 10,
    nombre: "Arquitectura y Diseño · Auditorio Ignacio Vieira Jaramillo",
  },
  { num: 11, nombre: "Laboratorios · Centro de Eventos FORUM UPB" },
  {
    num: 12,
    nombre: "Derecho y Ciencias Políticas · Auditorio Guillermo Jaramillo",
  },
  { num: 13, nombre: "Editorial · Librería · Tienda Universitaria" },
  { num: 14, nombre: "Bienestar Universitario" },
  { num: 15, nombre: "Biblioteca Central Mons. Darío Múnera Vélez" },
  { num: 16, nombre: "Canchas Sintéticas · Canchas de Tenis" },
  { num: 18, nombre: "Polideportivo · Gimnasio UPB" },
  { num: 19, nombre: "Bloque de Parqueaderos · Cancha Fundadores" },
  { num: 24, nombre: "Puestos de Estudio · Asesoría Integral" },
  { num: 50, nombre: "Centro de Familia · Carrera 73 No. C2-46" },
  { num: 51, nombre: "Casa de Institutos · Circular 1ª No. 73-30" },
  { num: 52, merge: "Circular 1ª No. 73-74 · Conciliación y Arbitraje" },
  { num: 53, nombre: "Casa de Transferencia · Circular 1ª No. 73-74" },
  { num: 54, nombre: "Casa Bioingeniería · Circular 1ª No. 73-80" },
  { num: 55, nombre: "Casa GIA · Grupo de Investigaciones Ambientales" },
];

// ── Tipos de daño con subcategorías ─────────────────────────
const CATEGORIAS = {
  "Aire acondicionado": [
    "Aire acondicionado",
    "Ventilador",
    "Calefacción",
    "Extractor",
  ],
  "Mobiliario (daños de algún elemento del salón)": [
    "Silla rota",
    "Mesa dañada",
    "Escritorio",
    "Armario / Casillero",
    "Tablero / Pizarrón",
  ],
  Eléctrico: [
    "Toma / Enchufe",
    "Lámpara / Bombillo",
    "Interruptor",
    "Cableado expuesto",
    "Corto circuito",
  ],
  Sanitario: [
    "Grifo con fuga",
    "Baño tapado",
    "Sanitario dañado",
    "Sin agua",
    "Malos olores",
  ],
  Infraestructura: [
    "Pared dañada",
    "Techo / Goteras",
    "Piso dañado",
    "Puerta / Cerradura",
    "Ventana rota",
    "Escalera",
  ],
  Tecnología: [
    "Proyector / Video beam",
    "Computador",
    "Pantalla / TV",
    "Red WiFi",
    "Equipo de sonido",
  ],
  Seguridad: [
    "Cámara dañada",
    "Cerradura",
    "Extintor",
    "Señalización",
    "Iluminación de emergencia",
  ],
  "Limpieza / Higiene": [
    "Basura acumulada",
    "Malos olores",
    "Manchas / Suciedad",
    "Plaga",
  ],
  Otro: ["Otro (describir en descripción)"],
};

const URGENCIAS = [
  {
    key: "low",
    label: "Baja",
    desc: "No impide el uso del espacio",
    dot: "#3dd68c",
  },
  {
    key: "medium",
    label: "Media",
    desc: "Molestia significativa",
    dot: "#f5a623",
  },
  {
    key: "high",
    label: "Alta",
    desc: "Afecta el uso normal del espacio",
    dot: "#e84855",
  },
  {
    key: "critical",
    label: "Crítica",
    desc: "Espacio inhabilitado o riesgo físico",
    dot: "#ff2d55",
  },
];

const ROLES = [
  { key: "Estudiante", icon: <Notebook /> },
  { key: "Docente", icon: <PenTool /> },
  { key: "Administrativo", icon: <ShieldUser /> },
];

// ── Helpers ──────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-primary)]">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    {children}
    {error && <p className="text-red-600 text-[11px] font-bold">{error}</p>}
  </div>
);

// ── Component ────────────────────────────────────────────────
export default function AlertForm() {
  const [form, setForm] = useState({
    rol: "",
    bloque: "",
    salon: "",
    inhabilitado: false,
    categoria: "",
    subcategoria: "",
    descripcion: "",
    urgencia: "",
    contacto: "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [dragging, setDragging] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.rol) e.rol = "Selecciona tu rol.";
    if (!form.bloque) e.bloque = "Selecciona el bloque.";
    if (!form.salon.trim()) e.salon = "Especifica el salón o espacio.";
    if (!form.categoria) e.categoria = "Selecciona la categoría del daño.";
    if (!form.subcategoria)
      e.subcategoria = "Selecciona el elemento específico.";
    if (!form.urgencia) e.urgencia = "Indica la urgencia.";
    if (!form.descripcion.trim()) e.descripcion = "Describe el daño.";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setServerError("");
    setLoading(true);

    const rolMap = {
      Estudiante: "ESTUDIANTE",
      Docente: "DOCENTE",
      Administrativo: "ADMINISTRATIVO",
    };

    const dto = {
      rol: rolMap[form.rol] || form.rol,
      contacto: form.contacto || null,
      numeroBloque: Number(form.bloque),
      salon: form.salon,
      piso: form.piso || null,
      inhabilitado: !!form.inhabilitado,
      categoria: form.categoria,
      subcategoria: form.subcategoria,
      descripcion: form.descripcion,
      urgencia: form.urgencia ? form.urgencia.toUpperCase() : null,
    };

    try {
      await enviarReporte(dto);
      setSubmitted(true);
    } catch (err) {
      console.error("Error al enviar reporte:", err);
      setServerError(err.message || "Error al enviar reporte");
    } finally {
      loading(false);
    }
  };

  const reset = () => {
    setForm({
      rol: "",
      bloque: "",
      salon: "",
      inhabilitado: false,
      categoria: "",
      subcategoria: "",
      descripcion: "",
      urgencia: "",
      files: [],
      contacto: "",
      fecha: new Date().toISOString().split("T")[0],
    });
    setErrors({});
    setSubmitted(false);
  };

  // ── Success screen ─────────────────────────────────────────
  if (submitted) {
    const urg = URGENCIAS.find((u) => u.key === form.urgencia);
    const bloqueInfo = BLOQUES.find((b) => b.num === Number(form.bloque));
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)]"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/dark-mosaic.png")`,
        }}
      >
        <div className="bg-[var(--bg-card)] border-4 border-yellow-400 max-w-md w-full p-8 text-center shadow-[8px_8px_0px_#facc15]">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-[var(--text-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
            Reporte registrado
          </p>
          <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-widest mb-5">
            ¡Enviado!
          </h2>

          <div className="text-left border-2 border-[var(--border-subtle)] divide-y-2 divide-black mb-6">
            {[
              ["Rol", form.rol],
              ["Bloque", `Bloque ${form.bloque} · ${bloqueInfo?.nombre}`],
              ["Espacio", form.salon],
              ["Daño", `${form.categoria} → ${form.subcategoria}`],
              ["Urgencia", urg?.label],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] w-20 shrink-0 pt-0.5">
                  {k}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{v}</span>
              </div>
            ))}
          </div>

          <p className="text-[var(--text-secondary)] text-xs mb-6">
            El equipo de mantenimiento fue notificado. Tiempo de respuesta:
            24-72 h hábiles.
          </p>
          <button
            onClick={reset}
            className="bg-red-600 text-[var(--text-primary)] font-black uppercase tracking-widest px-8 py-3 border-2 border-[var(--border-subtle)] hover:bg-yellow-400 hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Nuevo Reporte
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] py-10 px-4"
      style={{
        backgroundImage: `url("https://www.transparenttextures.com/patterns/dark-mosaic.png")`,
      }}
    >
      {/* Botón de Cambiar Tema alineado arriba */}
      <div className="max-w-2xl mx-auto flex justify-end mb-3">
        <button
          onClick={toggleTheme}
          title={
            theme === "dark"
              ? "Cambiar a modo claro"
              : "Cambiar a modo oscuro"
          }
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-lg
            border
            border-[var(--border-subtle)]
            bg-[var(--bg-card)]
            text-[var(--text-primary)]
            hover:border-[var(--accent-yellow)]
            hover:-translate-y-[1px]
            transition-all
            duration-200
            cursor-pointer
          "
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Mini Contenedor del Header */}
      <div className="max-w-2xl mx-auto mb-7 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] p-5 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-12 bg-red-600 shrink-0" />
          <div>
            <p 
  className="text-yellow-400 text-[12px] font-black uppercase tracking-[0.3em]"
  style={{
    textShadow: `
      1px 1px 0px #000, 
     -1px 1px 0px #000, 
      1px -1px 0px #000, 
     -1px -1px 0px #000
    `
  }}
>
  UPB · Gestión de Espacios
</p>
            <h1 className="text-[var(--text-primary)] text-3xl font-black uppercase leading-none tracking-tight">
              Reporte de Daños
            </h1>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mt-2 pl-5">
          Completa el formulario y el equipo de mantenimiento recibirá la
          notificación de inmediato.
        </p>
      </div>

      {/* Card Principal del Formulario */}
      <div className="max-w-2xl mx-auto bg-[var(--bg-card)] border-4 border-red-600 shadow-[6px_6px_0px_#facc15]">
        <div className="h-2 bg-red-600 w-full" />

        <div className="p-6 space-y-6">
          {/* ① ROL */}
          <Field label="Tu rol" required error={errors.rol}>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => set("rol", r.key)}
                  className={`flex flex-col items-center gap-1.5 py-3 border-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer
                    ${
                      form.rol === r.key
                        ? "bg-[var(--bg-primary)] text-yellow-500 dark:text-yellow-400 border-[var(--border-subtle)] scale-[1.02] shadow-[3px_3px_0px_#facc15]"
                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-gray-300 hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  {r.key}
                </button>
              ))}
            </div>
          </Field>

          {/* ② UBICACIÓN */}
          <div className="border-2 border-[var(--border-subtle)] p-4 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Ubicación
            </p>

            {/* Bloque */}
            <Field label="Bloque" required error={errors.bloque}>
              <select
                value={form.bloque}
                onChange={(e) => set("bloque", e.target.value)}
                className={`w-full border-2 px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 cursor-pointer appearance-none ${errors.bloque ? "border-red-600 bg-red-50" : "border-[var(--border-subtle)]"}`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">— Selecciona un bloque —</option>
                {BLOQUES.map((b) => (
                  <option key={b.num} value={String(b.num)}>
                    Bloque {b.num} · {b.nombre}
                  </option>
                ))}
              </select>
            </Field>

            {/* Salón + piso */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Salón / Espacio" required error={errors.salon}>
                <input
                  type="text"
                  placeholder="Ej: 301, Lab. 2, Baños"
                  value={form.salon}
                  onChange={(e) => set("salon", e.target.value)}
                  className={`border-2 px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 font-mono ${errors.salon ? "border-red-600 bg-red-50" : "border-[var(--border-subtle)]"}`}
                />
              </Field>
              <Field label="Piso">
                <input
                  type="text"
                  placeholder="Ej: 1, 2, Sótano"
                  value={form.piso || ""}
                  onChange={(e) => set("piso", e.target.value)}
                  className="border-2 border-[var(--border-subtle)] px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 font-mono"
                />
              </Field>
            </div>

            {/* Inhabilitado */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set("inhabilitado", !form.inhabilitado)}
                className={`w-5 h-5 border-2 border-[var(--border-subtle)] flex items-center justify-center shrink-0 transition-colors cursor-pointer
                  ${form.inhabilitado ? "bg-red-600 border-red-600" : "bg-[var(--bg-card)] group-hover:border-red-400"}`}
              >
                {form.inhabilitado && (
                  <svg
                    className="w-3 h-3 text-[var(--text-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold text-[var(--text-muted)]">
                El espacio está{" "}
                <span className="text-red-600">inhabilitado</span> por este daño
              </span>
            </label>
          </div>

          {/* ③ TIPO DE DAÑO */}
          <div className="space-y-3">
            <Field label="Categoría del daño" required error={errors.categoria}>
              <select
                value={form.categoria}
                onChange={(e) => {
                  set("categoria", e.target.value);
                  set("subcategoria", "");
                }}
                className={`w-full border-2 px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 cursor-pointer appearance-none ${errors.categoria ? "border-red-600 bg-red-50" : "border-[var(--border-subtle)]"}`}
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">— Selecciona una categoría —</option>
                {Object.keys(CATEGORIAS).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>

            {form.categoria && (
              <Field
                label="Elemento específico"
                required
                error={errors.subcategoria}
              >
                <select
                  value={form.subcategoria}
                  onChange={(e) => set("subcategoria", e.target.value)}
                  className={`w-full border-2 px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 cursor-pointer appearance-none ${errors.subcategoria ? "border-red-600 bg-red-50" : "border-[var(--border-subtle)]"}`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="">— Selecciona el elemento —</option>
                  {CATEGORIAS[form.categoria].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field
              label="Descripción del daño"
              required
              error={errors.descripcion}
            >
              <textarea
                rows={3}
                placeholder="Describe con detalle: qué falló, desde cuándo, si representa peligro..."
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                className={`border-2 px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 resize-none ${errors.descripcion ? "border-red-600 bg-red-50" : "border-[var(--border-subtle)]"}`}
              />
            </Field>
          </div>

          {/* ④ URGENCIA */}
          <Field label="Urgencia" required error={errors.urgencia}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {URGENCIAS.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => set("urgencia", u.key)}
                  className={`flex flex-col items-start gap-1 px-3 py-2.5 border-2 text-left transition-all cursor-pointer
                    ${
                      form.urgencia === u.key
                        ? "bg-[var(--bg-primary)] border-[var(--border-subtle)] shadow-[3px_3px_0px_#facc15]"
                        : "bg-[var(--bg-card)] border-gray-300 hover:border-[var(--border-subtle)]"
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: u.dot }}
                    />
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${form.urgencia === u.key ? "text-yellow-500 dark:text-yellow-400" : "text-[var(--text-primary)]"}`}
                    >
                      {u.label}
                    </span>
                  </div>
                  <span className="text-[10px] leading-tight text-[var(--text-secondary)]">
                    {u.desc}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {/* ⑥ CONTACTO */}
          <Field label="Correo de contacto">
            <div className="relative">
              <input
                type="email"
                placeholder="tu@upb.edu.co (opcional)"
                value={form.contacto}
                onChange={(e) => set("contacto", e.target.value)}
                className="w-full border-2 border-[var(--border-subtle)] px-3 py-2 text-sm bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)] font-bold">
                OPCIONAL
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Si lo ingresas, te notificaremos cuando el reporte sea atendido.
            </p>
          </Field>

          {/* ⑦ FECHA */}
          <Field label="Fecha del reporte">
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => set("fecha", e.target.value)}
              className="border-2 border-[var(--border-subtle)] px-3 py-2 text-sm font-mono bg-[var(--bg-tertiary)] focus:outline-none focus:border-red-600 w-full"
            />
          </Field>

          {/* SUBMIT */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-red-600 text-[var(--text-primary)] font-black text-sm uppercase tracking-widest py-4 border-2 border-[var(--border-subtle)] hover:bg-yellow-400 hover:text-[var(--text-primary)] transition-colors shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            Enviar Reporte de Daño →
          </button>
        </div>

        <div className="h-2 bg-yellow-400 w-full" />
      </div>
    </div>
  );
}