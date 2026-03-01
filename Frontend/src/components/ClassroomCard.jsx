// export default function ClassroomCard({ classroom }) {
//   const statusClass =
//     classroom.status === "available" ? "status-available" : "status-occupied";
//   const statusText =
//     classroom.status === "available" ? "✓ Disponible" : "⚠ Ocupado";

//   const equipmentIcons = {
//     Videobeam: "📽️",
//     Computador: "💻",
//     Pantalla: "🖥️",
//     Audio: "🔊",
//     "Pizarra Digital": "📱",
//   };

//   return (
//     <div className="classroom-card">
//       <div className="classroom-header">
//         <div className="classroom-number">{classroom.number}</div>
//         <div className="floor-badge">Piso {classroom.floor}</div>
//       </div>
//       <div className="classroom-info">
//         <div className="info-item">
//           <div className="info-icon">👥</div>
//           <div>
//             <div className="info-label">Capacidad</div>
//             <div className="info-value">{classroom.capacity} estudiantes</div>
//           </div>
//         </div>
//         <div className="info-item">
//           <div className="info-icon">🪑</div>
//           <div>
//             <div className="info-label">Mobiliario</div>
//             <div className="info-value">{classroom.furniture}</div>
//           </div>
//         </div>
//         <div className="info-item">
//           <div className="info-icon">
//             {classroom.status === "available" ? "✅" : "⚠️"}
//           </div>
//           <div>
//             <div className="info-label">Estado</div>
//             <div className={`info-value ${statusClass}`}>{statusText}</div>
//           </div>
//         </div>
//       </div>
//       <div className="equipment-list">
//         <div className="equipment-title">Equipamiento Tecnológico</div>
//         <div className="equipment-items">
//           {classroom.equipment.map((item) => (
//             <span key={item} className="equipment-tag">
//               {equipmentIcons[item] || "✨"} {item}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function ClassroomCard({ classroom }) {
  const isAvailable = classroom.status === "available";

  const equipmentIcons = {
    Videobeam: "📽️",
    Computador: "💻",
    Pantalla: "🖥️",
    Audio: "🔊",
    "Pizarra Digital": "📱",
  };

  return (
    <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_#facc15] hover:translate-y-[-3px] transition-all">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-black text-black">
          {classroom.number}
        </div>
        <div className="text-xs font-black uppercase bg-red-600 text-white px-2 py-1 border-2 border-black">
          Piso {classroom.floor}
        </div>
      </div>

      {/* Tipo de espacio */}
      <div className="mb-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
          Tipo de Espacio
        </span>
        <div className="text-sm font-bold text-black">
          {classroom.type}
        </div>
      </div>

      {/* Capacidad */}
      <div className="mb-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
          Capacidad
        </span>
        <div className="text-sm font-bold text-black">
          {classroom.capacity} estudiantes
        </div>
      </div>

      {/* Recursos */}
      <div className="mb-4">
        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
          Recursos Técnicos
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {classroom.equipment.map((item) => (
            <span
              key={item}
              className="bg-yellow-400 text-black text-xs font-black px-2 py-1 border-2 border-black"
            >
              {equipmentIcons[item] || "✨"} {item}
            </span>
          ))}
        </div>
      </div>

      {/* Estado */}
      <div className={`text-sm font-black uppercase border-2 border-black px-3 py-2 text-center ${
        isAvailable
          ? "bg-yellow-400 text-black"
          : "bg-red-600 text-white"
      }`}>
        {isAvailable ? "Disponible" : "Ocupado"}
      </div>
    </div>
  );
}