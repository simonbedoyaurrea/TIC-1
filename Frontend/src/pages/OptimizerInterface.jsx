import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

/* ─────────────────────────────────────────────────────────────────────────────
   DATOS DE LAS FASES DEL ALGORITMO
   Extraídos directamente del optimizer.py
───────────────────────────────────────────────────────────────────────────── */
const PHASES = [
  {
    id: 1,
    tag: "FASE 1",
    title: "CP-SAT · Salón + Horario",
    icon: "⚙️",
    color: "#ef4444",
    desc: "Solver de programación por restricciones que asigna salones y franjas horarias a cada grupo de clase, minimizando la subutilización de espacios.",
    inputs: [
      { label: "Grupos preparados", type: "list", desc: "Lista de grupos con sesiones, duración y tipo de sala requerida" },
      { label: "Catálogo de salones", type: "df", desc: "DataFrame con BLOQUE, SALON, CAPACIDAD, TIPO_SALA" },
      { label: "Restricciones de edificio", type: "df", desc: "Qué edificios puede usar cada asignatura" },
      { label: "tiempo_limite", type: "int", desc: "Tiempo máximo del solver en segundos (por defecto 3900s = 65 min)" },
    ],
    outputs: [
      { label: "horarios[]", desc: "Lista de sesiones con día, slot, sala y horario en hhmm" },
      { label: "df_sal", desc: "DataFrame enriquecido de salones con TIPO_SALA calculado" },
    ],
    constraints: [
      "Cada sesión de un mismo grupo va en días distintos",
      "No hay overlap de salones (AddNoOverlap)",
      "Clases entre 06:00 y 20:00 (slot 0–14)",
      "Sábados terminan máx a las 17:00 (slot 11)",
    ],
    objective: "Minimizar desperdicio de capacidad: Σ (capacidad_salón - vacantes_óptimas)",
    snippet: `resultado = optimizar_horarios(
    grupos,
    cat_salones,        # DataFrame: BLOQUE, SALON, CAPACIDAD
    df_restricciones,   # DataFrame: ASIGNATURA, EDIFICIO
    tiempo_limite=3900  # segundos
)
if resultado:
    horarios, df_sal = resultado`,
  },
  {
    id: 2,
    tag: "FASE 2",
    title: "Reparación de Horarios",
    icon: "🔧",
    color: "#f59e0b",
    desc: "Post-procesamiento greedy que reubica sesiones para maximizar la cantidad de grupos que tienen al menos un docente disponible en su horario asignado.",
    inputs: [
      { label: "grupos", type: "list", desc: "Lista de grupos generada en la preparación" },
      { label: "horarios", type: "list", desc: "Resultado de la Fase 1" },
      { label: "df_sal", type: "df", desc: "DataFrame de salones enriquecido de la Fase 1" },
      { label: "catalogo_docentes", type: "list", desc: "Disponibilidad horaria de cada docente por día" },
    ],
    outputs: [
      { label: "horarios[]", desc: "Mismo formato que Fase 1, con sesiones reubicadas donde fue posible" },
    ],
    constraints: [
      "El salón reasignado debe estar libre en el nuevo slot",
      "El día nuevo no puede coincidir con otro día del mismo grupo",
      "Solo mueve si al final existe ≥1 docente que cubre todas las sesiones del grupo",
    ],
    objective: "Maximizar grupos con docente candidato disponible",
    snippet: `horarios = reparar_horarios(
    grupos,
    horarios,           # output de Fase 1
    df_sal,             # output de Fase 1
    cat_docentes        # lista con disponibilidad
)`,
  },
  {
    id: 3,
    tag: "FASE 3",
    title: "Asignación de Docentes",
    icon: "👨‍🏫",
    color: "#22c55e",
    desc: "Algoritmo greedy que asigna un docente confirmado a cada grupo, priorizando docentes de tiempo completo y respetando sus límites de secciones y bloques.",
    inputs: [
      { label: "grupos", type: "list", desc: "Lista de grupos" },
      { label: "horarios", type: "list", desc: "Resultado de la Fase 2" },
      { label: "catalogo_docentes", type: "list", desc: "Docentes con asignaturas, prioridad, max_secciones, max_bloques" },
      { label: "df_docentes_cat", type: "df", desc: "DataFrame con ID DOCENTE para detectar pendientes" },
    ],
    outputs: [
      { label: "asignaciones[]", desc: "Índice del docente asignado, o código 'PENDIENTE-X' si no hubo match" },
    ],
    constraints: [
      "Prioridad: docentes tipo 'E' (exclusivos) primero",
      "Respeta max_secciones y max_bloques por docente",
      "Sin conflictos de horario entre grupos del mismo docente",
      "Docentes ordenados por prioridad ascendente",
    ],
    objective: "Maximizar docentes confirmados (minimizar PENDIENTES)",
    snippet: `asignaciones = asignar_docentes(
    grupos,
    horarios,           # output de Fase 2
    cat_docentes,
    df_docentes_cat
)`,
  },
];

const EXPORT_INFO = {
  tag: "EXPORT",
  title: "formatear_banner()",
  icon: "📊",
  color: "#818cf8",
  desc: "Convierte los resultados internos al formato Banner institucional en un DataFrame exportable a Excel.",
  columns: [
    "COURSE_NAME", "ASIGNATURA", "COMPONENTE", "GRUPO",
    "SESSION_VACANCIES", "ROOM_CODE", "BLOQUE", "SALON",
    "CAPACIDAD_SALON", "INSTRUCTOR_CODE",
    "START_HOUR", "END_HOUR",
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
  ],
  snippet: `df_banner = formatear_banner(
    grupos, horarios, asignaciones, cat_docentes
)
df_banner.to_excel("output/asignacion_banner.xlsx", index=False)`,
};

const INPUT_STRUCTURE = {
  grupos: `preparar_grupos(
    catalogo_asignaturas,  # list[dict]
    df_demandas,           # col: ASIGNATURA, USABLE
    df_asignaturas_raw,    # col: MODULACION FORZADA
    max_grupos=None        # int | None
)`,
  salones: `# DataFrame con columnas:
# BLOQUE, SALON, CAPACIDAD, DESC_SALON
# + columnas de laboratorio (LAB-X = 1/0)
construir_catalogo_salones(df_programacion)`,
  docentes: `# list[dict]:
# {
#   id, tipo ('E'|'C'), prioridad,
#   max_secciones, max_bloques,
#   asignaturas: [{asignatura, max_secciones, max_bloques}],
#   disponibilidad: {'Lunes': {'06:00': 1, '07:00': 0, ...}, ...}
# }
construir_catalogo_docentes(
    df_docentes_cat,
    df_disponibilidad,
    df_doc_asignaturas
)`,
};

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTES
───────────────────────────────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return (
    <span
      style={{
        fontFamily: "monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "2px 7px",
        border: `1px solid ${color}40`,
        background: `${color}15`,
        color: color,
        borderRadius: 2,
      }}
    >
      {label}
    </span>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-primary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 6,
        overflow: "hidden",
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-tertiary)",
        }}
      >
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>
          python
        </span>
        <button
          onClick={handleCopy}
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: copied ? "#22c55e" : "var(--text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px 14px",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: "'DM Mono', 'Fira Code', monospace",
          color: "var(--text-primary)",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

function PhaseCard({ phase, expanded, onToggle }) {
  return (
    <div
      style={{
        border: `1px solid ${expanded ? phase.color + "50" : "var(--border-subtle)"}`,
        borderLeft: `3px solid ${phase.color}`,
        background: expanded ? `${phase.color}08` : "var(--bg-card)",
        borderRadius: 8,
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 22 }}>{phase.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Tag label={phase.tag} color={phase.color} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
            {phase.title}
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            color: "var(--text-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Body */}
      {expanded && (
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Description */}
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            {phase.desc}
          </p>

          {/* Inputs / Outputs grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Inputs */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Entradas
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {phase.inputs.map((inp) => (
                  <div
                    key={inp.label}
                    style={{
                      padding: "8px 10px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <code style={{ fontSize: 11, fontWeight: 700, color: phase.color, fontFamily: "monospace" }}>
                        {inp.label}
                      </code>
                      <span
                        style={{
                          fontSize: 9,
                          padding: "1px 5px",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-muted)",
                          borderRadius: 2,
                          fontFamily: "monospace",
                        }}
                      >
                        {inp.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                      {inp.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outputs + Constraints */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  Salidas
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phase.outputs.map((out) => (
                    <div
                      key={out.label}
                      style={{
                        padding: "8px 10px",
                        background: `${phase.color}10`,
                        border: `1px solid ${phase.color}30`,
                        borderRadius: 5,
                      }}
                    >
                      <code style={{ fontSize: 11, fontWeight: 700, color: phase.color, fontFamily: "monospace", display: "block", marginBottom: 2 }}>
                        {out.label}
                      </code>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {out.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objective */}
              <div
                style={{
                  padding: "8px 10px",
                  background: "var(--bg-secondary)",
                  border: "1px dashed var(--border-medium)",
                  borderRadius: 5,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                  Objetivo
                </div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {phase.objective}
                </div>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Restricciones activas
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {phase.constraints.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: phase.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>•</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code snippet */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              Ejemplo de llamada
            </div>
            <CodeBlock code={phase.snippet} />
          </div>
        </div>
      )}
    </div>
  );
}

function FlowDiagram() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        flexWrap: "wrap",
        padding: "20px 0",
      }}
    >
      {[
        { label: "Datos", sub: "Excel / CSV", icon: "📁", color: "#94a3b8" },
        { label: "Preparar", sub: "preparar_grupos()", icon: "🔄", color: "#64748b" },
        { label: "Fase 1", sub: "CP-SAT", icon: "⚙️", color: "#ef4444" },
        { label: "Fase 2", sub: "Reparar", icon: "🔧", color: "#f59e0b" },
        { label: "Fase 3", sub: "Docentes", icon: "👨‍🏫", color: "#22c55e" },
        { label: "Banner", sub: "Excel output", icon: "📊", color: "#818cf8" },
      ].map((step, i, arr) => (
        <div key={step.label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "0 4px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${step.color}18`,
                border: `2px solid ${step.color}50`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                margin: "0 auto 6px",
              }}
            >
              {step.icon}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: step.color }}>
              {step.label}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "monospace" }}>
              {step.sub}
            </div>
          </div>
          {i < arr.length - 1 && (
            <div
              style={{
                width: 28,
                height: 2,
                background: "var(--border-medium)",
                margin: "0 2px",
                flexShrink: 0,
                position: "relative",
                top: -10,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function OptimizerInterface() {
  const [expandedPhase, setExpandedPhase] = useState(1);
  const [activeTab, setActiveTab] = useState("guia"); // 'guia' | 'inputs' | 'export'

  const togglePhase = (id) =>
    setExpandedPhase((prev) => (prev === id ? null : id));

  const tabs = [
    { id: "guia", label: "Guía de fases" },
    { id: "inputs", label: "Estructura de entradas" },
    { id: "export", label: "Exportar a Banner" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'DM Mono', 'Fira Code', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
      `}</style>

      <Navbar />

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "100px 24px 60px",
        }}
      >
        {/* ── Hero ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Tag label="optimizer.py" color="#ef4444" />
            <Tag label="or-tools · CP-SAT" color="#818cf8" />
            <Tag label="3 fases" color="#22c55e" />
          </div>

          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              margin: "0 0 12px",
              color: "var(--text-primary)",
            }}
          >
            ALGORITMO DE{" "}
            <span style={{ color: "var(--accent-red)" }}>OPTIMIZACIÓN</span>
            <br />
            DE ESPACIOS
          </h1>

          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>
            El optimizador asigna automáticamente salones, franjas horarias y docentes 
            a grupos de materias usando <strong style={{ color: "var(--text-primary)" }}>programación por restricciones (CP-SAT)</strong> 
            {" "}seguida de dos fases de post-procesamiento greedy.
          </p>
        </div>

        {/* ── Flujo visual ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            padding: "16px 20px",
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Flujo completo
          </div>
          <FlowDiagram />
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, borderBottom: "1px solid var(--border-subtle)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 16px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "none",
                border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "var(--accent-red)" : "transparent"}`,
                color: activeTab === tab.id ? "var(--accent-red)" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Guía de fases ── */}
        {activeTab === "guia" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PHASES.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                expanded={expandedPhase === phase.id}
                onToggle={() => togglePhase(phase.id)}
              />
            ))}

            {/* Tip card */}
            <div
              style={{
                marginTop: 8,
                padding: "14px 18px",
                background: "var(--accent-yellow-dim)",
                border: "1px solid var(--accent-yellow)",
                borderRadius: 8,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-yellow)", marginBottom: 4, letterSpacing: "0.06em" }}>
                  PARÁMETRO CLAVE: tiempo_limite
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  La Fase 1 es la más costosa. Para pruebas usa <code style={{ color: "var(--accent-yellow)" }}>tiempo_limite=300</code> (5 min). 
                  Para producción se recomienda <code style={{ color: "var(--accent-yellow)" }}>tiempo_limite=3900</code> (65 min). 
                  El solver detiene automáticamente y retorna la mejor solución encontrada.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Estructura de entradas ── */}
        {activeTab === "inputs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Constantes globales */}
            <div
              style={{
                padding: "16px 18px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                Constantes globales del algoritmo
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {[
                  { key: "N_DIAS", val: "6", desc: "Lun–Sáb" },
                  { key: "N_SLOTS", val: "16", desc: "Divisor interno (potencia de 2)" },
                  { key: "HORA_BASE", val: "6", desc: "Primera hora disponible" },
                  { key: "MAX_FIN_SLOTS", val: "15", desc: "Máx slot fin semana (21:00)" },
                  { key: "MAX_FIN_SLOTS_SAB", val: "11", desc: "Máx slot fin sábado (17:00)" },
                ].map((c) => (
                  <div
                    key={c.key}
                    style={{
                      padding: "8px 10px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 5,
                    }}
                  >
                    <code style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", display: "block" }}>
                      {c.key} = {c.val}
                    </code>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs detallados */}
            {[
              { title: "preparar_grupos()", key: "grupos", color: "#ef4444" },
              { title: "construir_catalogo_salones()", key: "salones", color: "#f59e0b" },
              { title: "construir_catalogo_docentes()", key: "docentes", color: "#22c55e" },
            ].map(({ title, key, color }) => (
              <div
                key={key}
                style={{
                  padding: "16px 18px",
                  background: "var(--bg-card)",
                  border: `1px solid ${color}30`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Tag label={title} color={color} />
                </div>
                <CodeBlock code={INPUT_STRUCTURE[key]} />
              </div>
            ))}

            {/* Slot → hora */}
            <div
              style={{
                padding: "16px 18px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                Conversión de slots a horas
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 4 }}>
                {Array.from({ length: 15 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "5px 8px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 4,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 10, color: "var(--text-muted)" }}>slot {i}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: "monospace" }}>
                      {String(6 + i).padStart(2, "0")}:00
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Exportar a Banner ── */}
        {activeTab === "export" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                padding: "16px 18px",
                background: "var(--bg-card)",
                border: "1px solid #818cf830",
                borderLeft: "3px solid #818cf8",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{EXPORT_INFO.icon}</span>
                <Tag label={EXPORT_INFO.tag} color={EXPORT_INFO.color} />
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                  {EXPORT_INFO.title}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 14px" }}>
                {EXPORT_INFO.desc}
              </p>
              <CodeBlock code={EXPORT_INFO.snippet} />
            </div>

            <div
              style={{
                padding: "16px 18px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                Columnas del DataFrame exportado
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EXPORT_INFO.columns.map((col) => {
                  const isDayCol = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].includes(col);
                  return (
                    <code
                      key={col}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        background: isDayCol ? "#818cf815" : "var(--bg-secondary)",
                        border: `1px solid ${isDayCol ? "#818cf840" : "var(--border-subtle)"}`,
                        color: isDayCol ? "#818cf8" : "var(--text-secondary)",
                        borderRadius: 3,
                        fontFamily: "monospace",
                      }}
                    >
                      {col}
                    </code>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.5 }}>
                Las columnas de días contienen la letra del día (<code style={{ color: "#818cf8" }}>M/T/W/R/F/S/U</code>) 
                {" "}si la sesión ocurre ese día, o <code style={{ color: "#818cf8" }}>0</code> si no.
              </p>
            </div>

            {/* Resumen de resultados */}
            <div
              style={{
                padding: "14px 18px",
                background: "#22c55e10",
                border: "1px solid #22c55e30",
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                Resumen que imprime el algoritmo al finalizar
              </div>
              <CodeBlock code={`📊 RESULTADO:
   Grupos:      <total de grupos procesados>
   Sesiones:    <filas totales en el Excel>
   Confirmados: <grupos con docente asignado>
   PENDIENTE:   <grupos sin docente disponible>`} />
            </div>
          </div>
        )}

        {/* ── Footer CTA ── */}
        <div
          style={{
            marginTop: 40,
            padding: "20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
              ¿Listo para usar el optimizador?
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Carga tus datos y configura las restricciones desde la interfaz principal.
            </div>
          </div>
          <Link
            to="/optimizador"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "var(--accent-red)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              boxShadow: "3px 3px 0px var(--accent-yellow)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(3px,3px)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0,0)";
              e.currentTarget.style.boxShadow = "3px 3px 0px var(--accent-yellow)";
            }}
          >
            Ir al Optimizador
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M6 3l2 2-2 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}