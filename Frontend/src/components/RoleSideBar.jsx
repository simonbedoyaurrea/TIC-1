// export default function RoleSidebar({
//   currentRole,
//   onRoleSelect,
//   onReportClick,
// }) {
//   const roleNames = {
//     student: "🎓 Estudiante",
//     teacher: "👨‍🏫 Docente",
//     admin: "🛠️ Administrador",
//   };
//   const roleFeaturesData = {
//     student: [
//       { icon: "🔍", text: "Consultar disponibilidad de salones" },
//       { icon: "📚", text: "Ver información de aulas y laboratorios" },
//       { icon: "⚠️", text: "Reportar daños en espacios" },
//     ],
//     teacher: [
//       { icon: "🔍", text: "Consultar salones y laboratorios" },
//       { icon: "📊", text: "Ver capacidad y recursos tecnológicos" },
//       { icon: "⚠️", text: "Reportar daños en espacios asignados" },
//       { icon: "📅", text: "Gestionar reservas de aulas" },
//     ],
//     admin: [
//       { icon: "🏢", text: "Acceso completo a todos los bloques" },
//       { icon: "⚙️", text: "Gestión de salones y laboratorios" },
//       { icon: "📋", text: "Visualizar todos los reportes de daños" },
//       { icon: "🔧", text: "Actualizar estado de espacios" },
//       { icon: "📊", text: "Análisis y estadísticas del campus" },
//     ],
//   };

//   return (
//     <div className="sidebar-card">
//       <div className="sidebar-header">
//         <h3>Control de Acceso</h3>
//         <p>Selecciona tu rol para acceder</p>
//       </div>

//       <div className="role-selector">
//         <button
//           className={`role-button ${currentRole === "student" ? "active" : ""}`}
//           onClick={() => onRoleSelect("student")}
//         >
//           <div className="role-icon student">🎓</div>
//           <div className="role-info">
//             <h4>Estudiante</h4>
//             <p>Consultar salones</p>
//           </div>
//         </button>
//         <button
//           className={`role-button ${currentRole === "teacher" ? "active" : ""}`}
//           onClick={() => onRoleSelect("teacher")}
//         >
//           <div className="role-icon teacher">👨‍🏫</div>
//           <div className="role-info">
//             <h4>Docente</h4>
//             <p>Gestionar espacios</p>
//           </div>
//         </button>
//         <button
//           className={`role-button ${currentRole === "admin" ? "active" : ""}`}
//           onClick={() => onRoleSelect("admin")}
//         >
//           <div className="role-icon admin">🛠️</div>
//           <div className="role-info">
//             <h4>Administrador</h4>
//             <p>Control total</p>
//           </div>
//         </button>
//       </div>

//       <div className="role-features">
//         <div className="selected-role-badge">
//           {currentRole ? roleNames[currentRole] : "Selecciona un rol"}
//         </div>
//         <div className="features-list">
//           {currentRole ? (
//             roleFeaturesData[currentRole].map((f, i) => (
//               <div key={i} className="feature-item">
//                 <div className="feature-icon">{f.icon}</div>
//                 <span>{f.text}</span>
//               </div>
//             ))
//           ) : (
//             <p className="features-placeholder">
//               Elige tu rol para ver las funcionalidades disponibles
//             </p>
//           )}
//         </div>
//       </div>

//       <button className="report-btn" onClick={onReportClick}>
//         <span style={{ fontSize: "1.5rem" }}>⚠️</span>
//         <span>Reportar Daño</span>
//       </button>
//     </div>
//   );
// }
