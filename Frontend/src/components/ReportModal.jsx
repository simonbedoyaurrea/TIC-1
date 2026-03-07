export default function ReportModal({ onClose }) {
  const [formData, setFormData] = useState({
    block: "",
    floor: "",
    room: "",
    type: "",
    otherDamage: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reporte enviado:", {
      ...formData,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box report-modal">
        <div className="modal-header red">
          <h2>
            <span>⚠️</span>
            <span>Reportar Daño</span>
          </h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {submitted ? (
            <div className="success-message">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3>¡Reporte Enviado Exitosamente!</h3>
              <p>Gracias por ayudarnos a mejorar el campus.</p>
              <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                Tu reporte ha sido registrado y será atendido a la brevedad
                posible.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Bloque *</label>
                  <select
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar bloque</option>
                    {Array.from({ length: 19 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Bloque {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Piso *</label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar piso</option>
                    {Array.from({ length: 7 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Piso {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de Salón/Laboratorio *</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="Ej: 501"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Daño *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="videobeam">📽️ Videobeam</option>
                    <option value="computador">💻 Computador</option>
                    <option value="furniture">🪑 Sillas o Mesas</option>
                    <option value="lighting">💡 Iluminación</option>
                    <option value="ac">❄️ Aire Acondicionado</option>
                    <option value="audio">🔊 Sistema de Audio</option>
                    <option value="screen">🖥️ Pantalla</option>
                    <option value="other">✏️ Otro</option>
                  </select>
                </div>
              </div>

              {formData.type === "other" && (
                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label>Especificar Otro Tipo de Daño</label>
                  <input
                    type="text"
                    name="otherDamage"
                    value={formData.otherDamage}
                    onChange={handleChange}
                    placeholder="Describe el tipo de daño"
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label>Descripción del Problema *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe brevemente el daño encontrado..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Adjuntar Imagen (Opcional)</label>
                <label className="file-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontSize: "2.5rem" }}>📷</span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-light)",
                      fontWeight: 500,
                    }}
                  >
                    Haz clic para seleccionar una imagen
                  </span>
                </label>
                {imagePreview && (
                  <div className="img-preview">
                    <img src={imagePreview} alt="Vista previa" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  <span>Enviar Reporte</span>
                  <span>📤</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
