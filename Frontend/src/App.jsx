// import { useEffect, useState } from "react";
// import CampusMap from "./components/CampusMap";
// import RoleSidebar from "./components/RoleSideBar";
// import BuildingModal from "./components/BuildingModal";
// import ReportModal from "./components/ReportModal";

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

//   * { margin: 0; padding: 0; box-sizing: border-box; }

//   :root {
//     --primary: #2563eb;
//     --primary-dark: #1e40af;
//     --primary-light: #60a5fa;
//     --secondary: #10b981;
//     --accent: #f59e0b;
//     --background: #f8fafc;
//     --surface: #ffffff;
//     --text: #0f172a;
//     --text-light: #64748b;
//     --border: #e2e8f0;
//     --shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
//     --shadow-lg: 0 20px 25px -5px rgba(0,0,0,0.1);
//   }

//   body { font-family: 'Outfit', sans-serif; }

//   .campus-root {
//     font-family: 'Outfit', sans-serif;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     min-height: 100vh;
//     color: var(--text);
//   }

//   /* Header */
//   .campus-header {
//     background: rgba(255,255,255,0.95);
//     backdrop-filter: blur(10px);
//     padding: 1.5rem 2rem;
//     box-shadow: var(--shadow);
//     position: sticky;
//     top: 0;
//     z-index: 1000;
//   }
//   .header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
//   .logo { display: flex; align-items: center; gap: 1rem; }
//   .logo-icon {
//     width: 48px; height: 48px;
//     background: linear-gradient(135deg, var(--primary), var(--primary-light));
//     border-radius: 12px; display: flex; align-items: center;
//     justify-content: center; font-size: 1.5rem;
//   }
//   .logo-text h1 { font-size: 1.5rem; font-weight: 700; color: var(--text); }
//   .logo-text p { font-size: 0.875rem; color: var(--text-light); }

//   /* Layout */
//   .main-container { max-width: 1600px; margin: 2rem auto; padding: 0 2rem; }
//   .content-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; }
//   .left-content { min-width: 0; }
//   .right-sidebar { position: sticky; top: 100px; height: fit-content; }

//   /* Cards */
//   .card {
//     background: white; border-radius: 20px; padding: 2rem;
//     box-shadow: var(--shadow-lg); margin-bottom: 2rem;
//   }
//   .card h2 { font-size: 1.75rem; margin-bottom: 0.5rem; color: var(--primary); }
//   .card p { color: var(--text-light); line-height: 1.6; }

//   /* Legend */
//   .legend { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
//   .legend-item { display: flex; align-items: center; gap: 0.75rem; }
//   .legend-icon {
//     width: 40px; height: 40px; border-radius: 10px;
//     display: flex; align-items: center; justify-content: center;
//     font-weight: 700; font-size: 1.125rem; color: white;
//   }
//   .legend-icon.vehicular { background: linear-gradient(135deg, #ef4444, #dc2626); }
//   .legend-icon.peatonal { background: linear-gradient(135deg, #10b981, #059669); }
//   .legend-icon.banos { background: linear-gradient(135deg, #f59e0b, #d97706); }

//   /* Map */
//   .map-wrapper {
//     position: relative; width: 100%;
//     background: #f1f5f9; border-radius: 16px;
//     overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
//   }
//   .map-image { width: 100%; height: auto; display: block; }
//   .map-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }

//   /* Building Markers */
//   .building-marker {
//     position: absolute; pointer-events: all; cursor: pointer;
//     transform: translate(-50%, -50%);
//     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//   }
//   .building-marker:hover { transform: translate(-50%, -50%) scale(1.15); z-index: 10; }
//   .marker-button {
//     background: linear-gradient(135deg, var(--primary), var(--primary-dark));
//     color: white; border: 3px solid white; border-radius: 50%;
//     width: 50px; height: 50px;
//     display: flex; align-items: center; justify-content: center;
//     font-weight: 700; font-size: 1.125rem;
//     box-shadow: 0 4px 12px rgba(37,99,235,0.4);
//     position: relative; transition: box-shadow 0.3s;
//   }
//   .building-marker:hover .marker-button { box-shadow: 0 8px 24px rgba(37,99,235,0.6); }
//   .marker-pulse {
//     position: absolute; top: 50%; left: 50%;
//     width: 100%; height: 100%; border-radius: 50%;
//     background: var(--primary); opacity: 0;
//     transform: translate(-50%, -50%);
//     animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
//   }
//   @keyframes pulse {
//     0%, 100% { opacity: 0; transform: translate(-50%,-50%) scale(1); }
//     50% { opacity: 0.3; transform: translate(-50%,-50%) scale(1.5); }
//   }
//   .marker-label {
//     position: absolute; bottom: -35px; left: 50%;
//     transform: translateX(-50%);
//     background: rgba(15,23,42,0.9); color: white;
//     padding: 0.375rem 0.75rem; border-radius: 8px;
//     font-size: 0.75rem; font-weight: 600; white-space: nowrap;
//     opacity: 0; pointer-events: none; transition: all 0.3s ease;
//   }
//   .building-marker:hover .marker-label { opacity: 1; bottom: -40px; }

//   /* Sidebar */
//   .sidebar-card { background: white; border-radius: 20px; padding: 2rem; box-shadow: var(--shadow-lg); }
//   .sidebar-header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border); }
//   .sidebar-header h3 { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
//   .sidebar-header p { font-size: 0.875rem; color: var(--text-light); }

//   /* Role Buttons */
//   .role-selector { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
//   .role-button {
//     background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//     border: 2px solid var(--border); border-radius: 16px; padding: 1.25rem;
//     display: flex; align-items: center; gap: 1rem; cursor: pointer;
//     transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
//     position: relative; overflow: hidden; width: 100%;
//   }
//   .role-button:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
//   .role-button.active {
//     background: linear-gradient(135deg, var(--primary), var(--primary-dark));
//     border-color: var(--primary); color: white;
//   }
//   .role-button.active .role-info h4,
//   .role-button.active .role-info p { color: white; }
//   .role-icon {
//     width: 56px; height: 56px; border-radius: 12px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 2rem; flex-shrink: 0;
//   }
//   .role-icon.student { background: linear-gradient(135deg, #3b82f6, #2563eb); }
//   .role-icon.teacher { background: linear-gradient(135deg, #10b981, #059669); }
//   .role-icon.admin { background: linear-gradient(135deg, #f59e0b, #d97706); }
//   .role-info { flex: 1; text-align: left; }
//   .role-info h4 { font-size: 1.125rem; font-weight: 600; color: var(--text); margin-bottom: 0.25rem; }
//   .role-info p { font-size: 0.875rem; color: var(--text-light); }

//   /* Role Features */
//   .role-features { background: #f8fafc; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
//   .selected-role-badge {
//     display: inline-block;
//     background: linear-gradient(135deg, var(--primary), var(--primary-dark));
//     color: white; padding: 0.5rem 1rem; border-radius: 8px;
//     font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;
//   }
//   .features-list { display: flex; flex-direction: column; gap: 0.75rem; }
//   .feature-item {
//     display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem;
//     background: white; border-radius: 8px; font-size: 0.875rem; color: var(--text);
//   }
//   .feature-icon {
//     width: 32px; height: 32px;
//     background: linear-gradient(135deg, var(--primary-light), var(--primary));
//     border-radius: 8px; display: flex; align-items: center;
//     justify-content: center; flex-shrink: 0;
//   }
//   .features-placeholder { text-align: center; color: var(--text-light); font-size: 0.875rem; font-style: italic; padding: 1rem; }

//   /* Report Button */
//   .report-btn {
//     width: 100%;
//     background: linear-gradient(135deg, #ef4444, #dc2626);
//     border: none; color: white; padding: 1rem 1.5rem; border-radius: 12px;
//     font-size: 1rem; font-weight: 600; cursor: pointer;
//     display: flex; align-items: center; justify-content: center; gap: 0.75rem;
//     transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(239,68,68,0.3);
//     font-family: 'Outfit', sans-serif;
//   }
//   .report-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(239,68,68,0.4); }

//   /* Modal */
//   .modal-backdrop {
//     position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//     background: rgba(15,23,42,0.75); backdrop-filter: blur(8px);
//     z-index: 2000; display: flex; align-items: center; justify-content: center;
//     padding: 2rem; animation: fadeIn 0.3s ease;
//   }
//   @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//   @keyframes slideUp {
//     from { opacity: 0; transform: translateY(30px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   .modal-box {
//     background: white; border-radius: 24px; max-width: 1200px; width: 100%;
//     max-height: 90vh; overflow-y: auto;
//     box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
//     animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1);
//   }
//   .modal-box.report-modal { max-width: 700px; }
//   .modal-header {
//     background: linear-gradient(135deg, var(--primary), var(--primary-dark));
//     color: white; padding: 2rem; border-radius: 24px 24px 0 0;
//     display: flex; justify-content: space-between; align-items: center;
//   }
//   .modal-header.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
//   .modal-header h2 { font-size: 2rem; font-weight: 700; display: flex; align-items: center; gap: 1rem; }
//   .building-number {
//     background: rgba(255,255,255,0.2); padding: 0.5rem 1rem;
//     border-radius: 12px; font-family: 'Space Mono', monospace;
//   }
//   .close-btn {
//     background: rgba(255,255,255,0.2); border: none; color: white;
//     width: 40px; height: 40px; border-radius: 10px; cursor: pointer;
//     font-size: 1.5rem; display: flex; align-items: center; justify-content: center;
//     transition: all 0.3s ease;
//   }
//   .close-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }
//   .modal-body { padding: 2rem; }

//   /* Classrooms Grid */
//   .classrooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//   .classroom-card {
//     background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
//     border-radius: 16px; padding: 1.5rem; border: 2px solid var(--border);
//     transition: all 0.3s ease;
//   }
//   .classroom-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--primary-light); }
//   .classroom-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
//   .classroom-number { font-size: 1.5rem; font-weight: 700; color: var(--primary); font-family: 'Space Mono', monospace; }
//   .floor-badge {
//     background: linear-gradient(135deg, var(--secondary), #059669);
//     color: white; padding: 0.375rem 0.75rem; border-radius: 8px;
//     font-size: 0.875rem; font-weight: 600;
//   }
//   .classroom-info { display: flex; flex-direction: column; gap: 0.75rem; }
//   .info-item { display: flex; align-items: center; gap: 0.75rem; }
//   .info-icon {
//     width: 36px; height: 36px; background: white; border-radius: 8px;
//     display: flex; align-items: center; justify-content: center;
//     font-size: 1.25rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); flex-shrink: 0;
//   }
//   .info-label { font-size: 0.75rem; color: var(--text-light); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
//   .info-value { font-size: 0.9375rem; font-weight: 600; color: var(--text); }
//   .status-available { color: #065f46; background: linear-gradient(135deg,#d1fae5,#a7f3d0); padding: 0.125rem 0.5rem; border-radius: 4px; }
//   .status-occupied { color: #991b1b; background: linear-gradient(135deg,#fee2e2,#fecaca); padding: 0.125rem 0.5rem; border-radius: 4px; }
//   .equipment-list { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
//   .equipment-title { font-size: 0.75rem; color: var(--text-light); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.75rem; }
//   .equipment-items { display: flex; flex-wrap: wrap; gap: 0.5rem; }
//   .equipment-tag {
//     background: white; padding: 0.375rem 0.75rem; border-radius: 6px;
//     font-size: 0.8125rem; font-weight: 500; color: var(--text);
//     display: flex; align-items: center; gap: 0.375rem;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//   }

//   /* Form */
//   .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.25rem; }
//   .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
//   .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text); }
//   .form-group input,
//   .form-group select,
//   .form-group textarea {
//     padding: 0.75rem 1rem; border: 2px solid var(--border); border-radius: 10px;
//     font-size: 0.9375rem; font-family: 'Outfit', sans-serif;
//     transition: all 0.3s ease; background: white;
//   }
//   .form-group input:focus,
//   .form-group select:focus,
//   .form-group textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
//   .form-group textarea { resize: vertical; min-height: 100px; }
//   .file-upload-label {
//     display: flex; flex-direction: column; align-items: center; justify-content: center;
//     gap: 0.75rem; padding: 2rem; border: 2px dashed var(--border);
//     border-radius: 12px; background: #f8fafc; cursor: pointer; transition: all 0.3s ease;
//   }
//   .file-upload-label:hover { border-color: var(--primary); background: #eff6ff; }
//   .form-actions {
//     display: flex; gap: 1rem; justify-content: flex-end;
//     margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid var(--border);
//   }
//   .btn-primary {
//     padding: 0.875rem 1.75rem; border-radius: 10px; font-size: 1rem; font-weight: 600;
//     cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;
//     gap: 0.5rem; border: none; font-family: 'Outfit', sans-serif;
//     background: linear-gradient(135deg, var(--primary), var(--primary-dark));
//     color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3);
//   }
//   .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(37,99,235,0.4); }
//   .btn-secondary {
//     padding: 0.875rem 1.75rem; border-radius: 10px; font-size: 1rem; font-weight: 600;
//     cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center;
//     gap: 0.5rem; font-family: 'Outfit', sans-serif;
//     background: #f1f5f9; color: var(--text); border: 2px solid var(--border);
//   }
//   .btn-secondary:hover { background: #e2e8f0; }

//   /* Success */
//   .success-message {
//     background: linear-gradient(135deg, #d1fae5, #a7f3d0);
//     border: 2px solid #10b981; border-radius: 16px; padding: 2rem;
//     text-align: center; animation: slideUp 0.4s ease;
//   }
//   .success-message h3 { color: #065f46; font-size: 1.25rem; margin-bottom: 0.5rem; }
//   .success-message p { color: #047857; font-size: 0.9375rem; }

//   /* Image Preview */
//   .img-preview img { width: 100%; max-height: 200px; object-fit: contain; border-radius: 10px; border: 2px solid var(--border); margin-top: 1rem; }

//   /* Responsive */
//   @media (max-width: 768px) {
//     .content-grid { grid-template-columns: 1fr; }
//     .right-sidebar { position: static; }
//     .main-container { padding: 0 1rem; }
//     .campus-header { padding: 1rem; }
//     .classrooms-grid { grid-template-columns: 1fr; }
//     .form-grid { grid-template-columns: 1fr; }
//     .modal-header h2 { font-size: 1.5rem; }
//   }
// `;

// function App() {
//   const [selectedBuilding, setSelectedBuilding] = useState(null);
//   const [showReport, setShowReport] = useState(false);
//   const [currentRole, setCurrentRole] = useState(null);

//   // Inject styles once
//   useEffect(() => {
//     const id = "campus-styles";
//     if (!document.getElementById(id)) {
//       const tag = document.createElement("style");
//       tag.id = id;
//       tag.textContent = styles;
//       document.head.appendChild(tag);
//     }
//   }, []);

//   // ESC key to close modals
//   useEffect(() => {
//     const handler = (e) => {
//       if (e.key === "Escape") {
//         setSelectedBuilding(null);
//         setShowReport(false);
//       }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, []);

//   const handleReportClick = () => {
//     if (!currentRole) {
//       alert("Por favor, selecciona tu rol antes de reportar un daño.");
//       return;
//     }
//     if (currentRole === "admin") {
//       alert(
//         "Como administrador, puedes acceder a todos los reportes. Esta función es principalmente para estudiantes y docentes.",
//       );
//       return;
//     }
//     setShowReport(true);
//   };

//   return (
//     <div className="campus-root">
//       {/* Header */}
//       <header className="campus-header">
//         <div className="header-content">
//           <div className="logo">
//             <div className="logo-icon">🎓</div>
//             <div className="logo-text">
//               <h1>Campus Interactivo</h1>
//               <p>Sistema de Consulta de Salones</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <div className="main-container">
//         <div className="content-grid">
//           <div className="left-content">
//             {/* Intro */}
//             <div className="card">
//               <h2>Explora Nuestro Campus</h2>
//               <p>
//                 Haz clic en cualquier bloque del mapa para conocer los salones
//                 disponibles, su capacidad, equipamiento tecnológico y ubicación
//                 exacta. Navega de forma intuitiva y encuentra el espacio
//                 perfecto para tu clase o actividad académica.
//               </p>
//               <div className="legend">
//                 <div className="legend-item">
//                   <div className="legend-icon vehicular">V</div>
//                   <span>Ingreso Vehicular</span>
//                 </div>
//                 <div className="legend-item">
//                   <div className="legend-icon peatonal">P</div>
//                   <span>Ingreso Peatonal</span>
//                 </div>
//                 <div className="legend-item">
//                   <div className="legend-icon banos">B</div>
//                   <span>Baños</span>
//                 </div>
//               </div>
//             </div>

//             {/* Map */}
//             <CampusMap onBuildingClick={setSelectedBuilding} />
//           </div>

//           {/* Sidebar */}
//           <div className="right-sidebar">
//             <RoleSidebar
//               currentRole={currentRole}
//               onRoleSelect={setCurrentRole}
//               onReportClick={handleReportClick}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {selectedBuilding !== null && (
//         <BuildingModal
//           buildingId={selectedBuilding}
//           onClose={() => setSelectedBuilding(null)}
//         />
//       )}
//       {showReport && <ReportModal onClose={() => setShowReport(false)} />}
//     </div>
//   );
// }

// export default App;



// import React from "react";
// import Login from "./pages/Login";
// import AlertForm from "./components/AlertForm";

// export default function App() {
//   return (
//     <div>
//       <AlertForm />
//     </div>
//   );
// }


import ClassroomCard from "./components/ClassroomCard";

export default function App() {
  const testClassroom = {
    number: "101",
    floor: 1,
    type: "Laboratorio",
    capacity: 40,
    equipment: ["Videobeam", "Computador", "Pantalla"],
    status: "available",
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <ClassroomCard classroom={testClassroom} />
    </div>
  );
}