export default function ClassroomCard({ classroom }) {
  const statusClass =
    classroom.status === "available" ? "status-available" : "status-occupied";
  const statusText =
    classroom.status === "available" ? "✓ Disponible" : "⚠ Ocupado";

  const equipmentIcons = {
    Videobeam: "📽️",
    Computador: "💻",
    Pantalla: "🖥️",
    Audio: "🔊",
    "Pizarra Digital": "📱",
  };

  return (
    <div className="classroom-card">
      <div className="classroom-header">
        <div className="classroom-number">{classroom.number}</div>
        <div className="floor-badge">Piso {classroom.floor}</div>
      </div>
      <div className="classroom-info">
        <div className="info-item">
          <div className="info-icon">👥</div>
          <div>
            <div className="info-label">Capacidad</div>
            <div className="info-value">{classroom.capacity} estudiantes</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">🪑</div>
          <div>
            <div className="info-label">Mobiliario</div>
            <div className="info-value">{classroom.furniture}</div>
          </div>
        </div>
        <div className="info-item">
          <div className="info-icon">
            {classroom.status === "available" ? "✅" : "⚠️"}
          </div>
          <div>
            <div className="info-label">Estado</div>
            <div className={`info-value ${statusClass}`}>{statusText}</div>
          </div>
        </div>
      </div>
      <div className="equipment-list">
        <div className="equipment-title">Equipamiento Tecnológico</div>
        <div className="equipment-items">
          {classroom.equipment.map((item) => (
            <span key={item} className="equipment-tag">
              {equipmentIcons[item] || "✨"} {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
