import mapa from "../assets/mapa.jpeg";

export default function CampusMap({ onBuildingClick }) {
  const buildingPositions = {
    1: { x: 36, y: 64 },
    2: { x: 42, y: 67 },
    3: { x: 44, y: 58 },
    4: { x: 25, y: 60 },
    5: { x: 16, y: 50 },
    6: { x: 40, y: 45 },
    7: { x: 47, y: 38 },
    8: { x: 53, y: 32 },
    9: { x: 60, y: 21 },
    10: { x: 65, y: 14 },
    11: { x: 76, y: 27 },
    12: { x: 77, y: 56 },
    13: { x: 68, y: 60 },
    14: { x: 56, y: 70 },
    15: { x: 70, y: 45 },
    16: { x: 50, y: 42 },
    17: { x: 75, y: 35 },
    18: { x: 86, y: 40 },
    19: { x: 62, y: 38 },
  };

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="map-wrapper">
        <img src={mapa} alt="Mapa del Campus" className="map-image" />
        <div className="map-overlay">
          {Object.entries(buildingPositions).map(([id, pos]) => (
            <div
              key={id}
              className="building-marker"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onBuildingClick(Number(id))}
            >
              <div className="marker-pulse" />
              <div className="marker-button">{id}</div>
              <div className="marker-label">Bloque {id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
