import { useState, useEffect, useRef } from "react";

const DIAS_MAP = [
  { idx: 0, label: "Lun", fullLabel: "MONDAY" },
  { idx: 1, label: "Mar", fullLabel: "TUESDAY" },
  { idx: 2, label: "Mié", fullLabel: "WEDNESDAY" },
  { idx: 3, label: "Jue", fullLabel: "THURSDAY" },
  { idx: 4, label: "Vie", fullLabel: "FRIDAY" },
  { idx: 5, label: "Sáb", fullLabel: "SATURDAY" },
];

const HORAS = Array.from({ length: 15 }, (_, i) => {
  const h = 6 + i;
  return { value: h * 100, label: `${String(h).padStart(2, "0")}:00` };
});

// ── Primitivos reutilizables ──────────────────────────────────────────────────
function RmInput({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-[#0d0d18] border border-slate-800 rounded-md py-1.5 px-2.5 text-slate-200 text-xs outline-none transition-colors focus:border-yellow-400 placeholder:text-slate-700 box-border ${className}`}
      {...props}
    />
  );
}

function RmSelect({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full bg-[#0d0d18] border border-slate-800 rounded-md py-1.5 px-2 text-slate-200 text-[11px] outline-none cursor-pointer transition-colors focus:border-yellow-400 [&_option]:bg-[#0d0d18] ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function RmLabel({ children }) {
  return (
    <label className="block text-[9px] tracking-widest text-slate-600 mb-1 uppercase">
      {children}
    </label>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function ModalNuevaMateria({ onClose, onSave, initialData }) {
  const overlayRef = useRef(null);

  const [materia, setMateria] = useState(initialData?.materia?.id ?? "");
  const [docente, setDocente] = useState(
    String(initialData?.materia?.docente ?? ""),
  );
  const [demanda, setDemanda] = useState(
    String(initialData?.materia?.demanda ?? ""),
  );
  const [duracion, setDuracion] = useState(
    String(initialData?.materia?.duracion ?? "2"),
  );
  const [dias, setDias] = useState(initialData?.materia?.dias ?? []);
  const [salonesPermitidos, setSalonesPermitidos] = useState(
    (initialData?.materia?.salonesPermitidos ?? []).join(", "),
  );
  const [disponibilidad, setDisponibilidad] = useState(() => {
    if (initialData?.disponibilidad) {
      return Object.entries(initialData.disponibilidad).map(
        ([id, franjas]) => ({
          id,
          franjas: franjas.map((f) => ({ dia: f[0], inicio: f[1], fin: f[2] })),
        }),
      );
    }
    return [{ id: "", franjas: [{ dia: 0, inicio: 700, fin: 1800 }] }];
  });

  const toggleDia = (idx) =>
    setDias((prev) =>
      prev.includes(idx)
        ? prev.filter((d) => d !== idx)
        : [...prev, idx].sort(),
    );

  const addFranja = (di) =>
    setDisponibilidad((prev) => {
      const copy = prev.map((d) => ({ ...d, franjas: [...d.franjas] }));
      copy[di].franjas.push({ dia: 0, inicio: 700, fin: 1800 });
      return copy;
    });

  const removeFranja = (di, fi) =>
    setDisponibilidad((prev) => {
      const copy = prev.map((d) => ({ ...d, franjas: [...d.franjas] }));
      copy[di].franjas.splice(fi, 1);
      return copy;
    });

  const updateFranja = (di, fi, field, value) =>
    setDisponibilidad((prev) => {
      const copy = prev.map((d) => ({
        ...d,
        franjas: d.franjas.map((f) => ({ ...f })),
      }));
      copy[di].franjas[fi][field] = value;
      return copy;
    });

  const updateDispId = (di, value) =>
    setDisponibilidad((prev) => {
      const copy = prev.map((d) => ({ ...d }));
      copy[di].id = value;
      return copy;
    });

  const addDocente = () =>
    setDisponibilidad((prev) => [
      ...prev,
      { id: "", franjas: [{ dia: 0, inicio: 700, fin: 1800 }] },
    ]);

  const removeDocente = (idx) =>
    setDisponibilidad((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    const payload = {
      materia: {
        id: initialData?.materia?.id,
        docente: Number(docente),
        demanda: Number(demanda),
        duracion: Number(duracion),
        dias,
        salonesPermitidos: salonesPermitidos
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      disponibilidad: Object.fromEntries(
        disponibilidad.map((d) => [
          d.id,
          d.franjas.map((f) => [f.dia, f.inicio, f.fin]),
        ]),
      ),
    };
    onSave?.(payload);
    onClose?.();
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.18s ease" }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0 }              to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(16px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        .modal-scroll::-webkit-scrollbar       { width: 3px }
        .modal-scroll::-webkit-scrollbar-track { background: transparent }
        .modal-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px }
      `}</style>

      {/* Panel */}
      <div
        className="bg-[#0a0a0f] border border-slate-800 rounded-xl flex flex-col shadow-2xl"
        style={{
          width: "min(640px, 95vw)",
          maxHeight: "90vh",
          animation: "slideUp 0.2s ease",
          boxShadow: "0 0 0 1px #12121f, 0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div>
            <p className="text-[9px] tracking-[0.14em] text-slate-600 mb-0.5">
              OPTIMIZADOR
            </p>
            <h2 className="text-[15px] font-bold text-slate-100 leading-none">
              Configurar Restricciones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center bg-transparent border border-slate-800 rounded-lg text-slate-500 text-base cursor-pointer transition-all hover:border-slate-700 hover:text-slate-300"
          >
            ×
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="modal-scroll flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Sección: Materia */}
          <section>
            <p className="text-[9px] tracking-[0.12em] text-yellow-400 mb-3">
              DATOS DE LA MATERIA
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <RmLabel>ID / Código</RmLabel>
                <span className="text-slate-700 text-[10px] tracking-normal normal-case border border-slate-800 rounded-md  py-3.5 bg-[#0d0d18] block">
                  {initialData?.materia?.id}
                </span>
              </div>
              <div>
                <RmLabel>Docente (ID)</RmLabel>
                <RmInput
                  type="number"
                  value={docente}
                  onChange={(e) => setDocente(e.target.value)}
                  placeholder="Ej: 75879"
                />
              </div>
              <div>
                <RmLabel>Demanda (cupos)</RmLabel>
                <RmInput
                  type="number"
                  value={demanda}
                  onChange={(e) => setDemanda(e.target.value)}
                  placeholder="Ej: 40"
                />
              </div>
              <div>
                <RmLabel>Duración (horas)</RmLabel>
                <RmInput
                  type="number"
                  min={1}
                  max={6}
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="Ej: 2"
                />
              </div>
            </div>

            {/* Días */}
            <div className="mt-3.5">
              <RmLabel>Días de clase</RmLabel>
              <div className="flex gap-1.5 flex-wrap">
                {DIAS_MAP.map((d) => {
                  const active = dias.includes(d.idx);
                  return (
                    <button
                      key={d.idx}
                      onClick={() => toggleDia(d.idx)}
                      title={d.fullLabel}
                      className={`w-[34px] h-7 rounded-md border text-[10px] font-bold cursor-pointer transition-all
                        ${
                          active
                            ? "bg-yellow-400/15 border-yellow-400/50 text-yellow-400"
                            : "bg-transparent border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400"
                        }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
              {dias.length > 0 && (
                <p className="text-[10px] text-slate-600 mt-1.5">
                  {dias
                    .map((d) => DIAS_MAP.find((x) => x.idx === d)?.fullLabel)
                    .join(", ")}
                </p>
              )}
            </div>

            {/* Salones */}
            <div className="mt-3.5">
              <RmLabel>
                Salones permitidos{" "}
                <span className="text-slate-700 normal-case font-normal tracking-normal">
                  — separados por coma, vacío = todos
                </span>
              </RmLabel>
              <RmInput
                value={salonesPermitidos}
                onChange={(e) => setSalonesPermitidos(e.target.value)}
                placeholder="Ej: MELB07-612, VIRTUAL_1"
              />
            </div>
          </section>

          <hr className="border-slate-800" />

          {/* Sección: Disponibilidad */}
          <section>
            <p className="text-[9px] tracking-[0.12em] text-yellow-400 mb-3">
              DISPONIBILIDAD DE DOCENTES
            </p>

            <div className="space-y-2.5">
              {disponibilidad.map((disp, di) => (
                <div
                  key={di}
                  className="bg-[#0d0d18] border border-slate-800 rounded-lg p-3"
                >
                  {/* Docente ID row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] text-slate-600 shrink-0">
                      ID Docente
                    </span>
                    <RmInput
                      className="max-w-[120px]!"
                      value={disp.id}
                      onChange={(e) => updateDispId(di, e.target.value)}
                      placeholder="75879"
                    />
                    {disponibilidad.length > 1 && (
                      <button
                        onClick={() => removeDocente(di)}
                        className="ml-auto text-slate-600 hover:text-red-400 text-xs border border-transparent hover:border-red-400/30 rounded px-1.5 py-0.5 cursor-pointer transition-all bg-transparent"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <p className="text-[9px] tracking-[0.08em] text-slate-700 mb-2">
                    FRANJAS HORARIAS · [día, inicio, fin]
                  </p>

                  {/* Column labels */}
                  <div className="grid grid-cols-[80px_1fr_1fr_24px] gap-1.5 mb-1">
                    <RmLabel>Día</RmLabel>
                    <RmLabel>Desde</RmLabel>
                    <RmLabel>Hasta</RmLabel>
                    <div />
                  </div>

                  <div className="space-y-1.5">
                    {disp.franjas.map((f, fi) => (
                      <div
                        key={fi}
                        className="grid grid-cols-[80px_1fr_1fr_24px] gap-1.5 items-center"
                      >
                        <RmSelect
                          value={f.dia}
                          onChange={(e) =>
                            updateFranja(di, fi, "dia", Number(e.target.value))
                          }
                        >
                          {DIAS_MAP.map((d) => (
                            <option key={d.idx} value={d.idx}>
                              {d.label}
                            </option>
                          ))}
                        </RmSelect>

                        <RmSelect
                          value={f.inicio}
                          onChange={(e) =>
                            updateFranja(
                              di,
                              fi,
                              "inicio",
                              Number(e.target.value),
                            )
                          }
                        >
                          {HORAS.map((h) => (
                            <option key={h.value} value={h.value}>
                              {h.label}
                            </option>
                          ))}
                        </RmSelect>

                        <RmSelect
                          value={f.fin}
                          onChange={(e) =>
                            updateFranja(di, fi, "fin", Number(e.target.value))
                          }
                        >
                          {HORAS.map((h) => (
                            <option key={h.value} value={h.value}>
                              {h.label}
                            </option>
                          ))}
                        </RmSelect>

                        <button
                          onClick={() => removeFranja(di, fi)}
                          disabled={disp.franjas.length <= 1}
                          className="flex items-center justify-center text-slate-700 hover:text-red-400 border border-transparent hover:border-red-400/30 rounded text-base cursor-pointer transition-all bg-transparent disabled:opacity-20 disabled:cursor-default disabled:hover:text-slate-700 disabled:hover:border-transparent"
                        >
                          −
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addFranja(di)}
                    className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-400 border border-slate-800 hover:border-slate-700 rounded-md px-2.5 py-1 cursor-pointer transition-all bg-transparent"
                  >
                    <span className="text-sm leading-none">+</span>
                    Agregar franja
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addDocente}
              className="mt-2 w-full flex items-center justify-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-400 border border-slate-800 hover:border-slate-700 rounded-lg py-2 cursor-pointer transition-all bg-transparent"
            >
              <span className="text-sm leading-none">+</span>
              Agregar otro docente
            </button>
          </section>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-[#0a0a0f] rounded-b-xl shrink-0">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300 rounded-lg px-4 py-2 cursor-pointer transition-all bg-transparent"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="text-xs font-bold tracking-wide text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/40 hover:border-yellow-400/70 rounded-lg px-5 py-2 cursor-pointer transition-all"
          >
            Guardar restricciones
          </button>
        </div>
      </div>
    </div>
  );
}
