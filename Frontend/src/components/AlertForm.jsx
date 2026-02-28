import { useState } from "react";

const SALONES = [
  "Salón 101",
  "Salón 102",
  "Salón 103",
  "Salón 104",
  "Salón 201",
  "Salón 202",
  "Salón 203",
  "Salón 204",
  "Laboratorio A",
  "Laboratorio B",
  "Auditorio",
];

const TIPOS_DAÑO = [
  "Mobiliario (sillas/mesas)",
  "Pizarrón / Proyector",
  "Ventanas / Puertas",
  "Eléctrico / Iluminación",
  "Plomería",
  "Paredes / Techo / Piso",
  "Equipo de cómputo",
  "Otro",
];

const SEVERIDADES = [
  { label: "Leve", color: "bg-yellow-400 text-black" },
  { label: "Moderado", color: "bg-orange-500 text-white" },
  { label: "Grave", color: "bg-red-600 text-white" },
];

export default function AlertForm() {
  const [form, setForm] = useState({
    salon: "",
    tipo: "",
    severidad: "",
    descripcion: "",
    reportante: "",
    fecha: new Date().toISOString().split("T")[0],
    foto: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.salon) e.salon = "Selecciona un salón.";
    if (!form.tipo) e.tipo = "Selecciona el tipo de daño.";
    if (!form.severidad) e.severidad = "Indica la severidad.";
    if (!form.descripcion.trim()) e.descripcion = "Describe el daño.";
    if (!form.reportante.trim()) e.reportante = "Ingresa tu nombre.";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({
      salon: "",
      tipo: "",
      severidad: "",
      descripcion: "",
      reportante: "",
      fecha: new Date().toISOString().split("T")[0],
      foto: null,
    });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-white border-4 border-yellow-400 max-w-md w-full p-8 text-center shadow-[8px_8px_0px_#facc15]">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-black"
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
          <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-2">
            ¡Reporte Enviado!
          </h2>
          <p className="text-gray-600 mb-1">
            <span className="font-bold text-black">{form.salon}</span>
          </p>
          <p className="text-gray-600 mb-1">
            Daño: <span className="font-bold text-black">{form.tipo}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Severidad:{" "}
            <span
              className={`font-bold px-2 py-0.5 rounded text-sm ${
                SEVERIDADES.find((s) => s.label === form.severidad)?.color
              }`}
            >
              {form.severidad}
            </span>
          </p>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white font-black uppercase tracking-widest px-8 py-3 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors duration-150 cursor-pointer"
          >
            Nuevo Reporte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-10 bg-red-600" />
          <div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.3em]">
              Sistema de Reporte
            </p>
            <h1 className="text-white text-3xl font-black uppercase leading-none tracking-tight">
              Daños en Salones
            </h1>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2 pl-5">
          Completa el formulario para registrar un daño. El personal de
          mantenimiento será notificado.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white border-4 border-red-600 shadow-[6px_6px_0px_#facc15]"
      >
        {/* Top stripe */}
        <div className="h-2 bg-red-600 w-full" />

        <div className="p-6 space-y-5">
          {/* Fecha y Reportante */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
                className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-gray-50 focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-1">
                Nombre del Reportante <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                value={form.reportante}
                onChange={(e) => handleChange("reportante", e.target.value)}
                className={`w-full border-2 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-red-600 ${errors.reportante ? "border-red-600 bg-red-50" : "border-black"}`}
              />
              {errors.reportante && (
                <p className="text-red-600 text-xs mt-1 font-bold">
                  {errors.reportante}
                </p>
              )}
            </div>
          </div>

          {/* Salón */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-black mb-1">
              Salón Afectado <span className="text-red-600">*</span>
            </label>
            <select
              value={form.salon}
              onChange={(e) => handleChange("salon", e.target.value)}
              className={`w-full border-2 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-red-600 cursor-pointer ${errors.salon ? "border-red-600 bg-red-50" : "border-black"}`}
            >
              <option value="">— Selecciona un salón —</option>
              {SALONES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {errors.salon && (
              <p className="text-red-600 text-xs mt-1 font-bold">
                {errors.salon}
              </p>
            )}
          </div>

          {/* Tipo de Daño */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">
              Tipo de Daño <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS_DAÑO.map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => handleChange("tipo", tipo)}
                  className={`text-left text-xs font-bold px-3 py-2 border-2 transition-colors duration-100 cursor-pointer ${
                    form.tipo === tipo
                      ? "bg-black text-yellow-400 border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
            {errors.tipo && (
              <p className="text-red-600 text-xs mt-1 font-bold">
                {errors.tipo}
              </p>
            )}
          </div>

          {/* Severidad */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-black mb-2">
              Severidad <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-3">
              {SEVERIDADES.map(({ label, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleChange("severidad", label)}
                  className={`flex-1 py-2 text-sm font-black uppercase tracking-wider border-2 transition-all duration-100 cursor-pointer ${
                    form.severidad === label
                      ? `${color} border-black scale-105 shadow-[3px_3px_0px_#000]`
                      : "bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.severidad && (
              <p className="text-red-600 text-xs mt-1 font-bold">
                {errors.severidad}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-black mb-1">
              Descripción del Daño <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe con detalle el daño observado, ubicación exacta dentro del salón, etc."
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className={`w-full border-2 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-red-600 resize-none ${errors.descripcion ? "border-red-600 bg-red-50" : "border-black"}`}
            />
            {errors.descripcion && (
              <p className="text-red-600 text-xs mt-1 font-bold">
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Foto (opcional) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-black mb-1">
              Fotografía{" "}
              <span className="text-gray-400 font-normal normal-case tracking-normal">
                (opcional)
              </span>
            </label>
            <label className="flex items-center gap-3 border-2 border-dashed border-gray-400 hover:border-black px-4 py-3 cursor-pointer bg-gray-50 transition-colors">
              <svg
                className="w-5 h-5 text-gray-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                {form.foto
                  ? form.foto.name
                  : "Haz clic para adjuntar una imagen"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleChange("foto", e.target.files[0] || null)
                }
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-black text-sm uppercase tracking-widest py-4 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors duration-150 shadow-[4px_4px_0px_#000] hover:shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            Enviar Reporte de Daño
          </button>
        </div>

        {/* Bottom stripe */}
        <div className="h-2 bg-yellow-400 w-full" />
      </form>

      <p className="text-center text-gray-600 text-xs mt-6">
        Los reportes son atendidos en un plazo de 24 a 72 horas hábiles.
      </p>
    </div>
  );
}
