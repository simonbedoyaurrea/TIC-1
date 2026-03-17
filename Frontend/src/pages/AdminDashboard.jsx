import { useState, useEffect, useCallback } from "react";

// ── Paleta y estilos globales ─────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;600&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; color: #f0f0f0; font-family: 'Barlow Condensed', sans-serif; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #e63946; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes slideIn { from{transform:translateX(100%);} to{transform:translateX(0);} }
`;

// ── Constantes ────────────────────────────────────────────────
const API = "http://localhost:8081/api";

const ESTADO_CONFIG = {
  PENDIENTE:  { label: "Pendiente",  color: "#f59e0b", bg: "#1c1400" },
  EN_PROCESO: { label: "En Proceso", color: "#3b82f6", bg: "#00091c" },
  RESUELTO:   { label: "Resuelto",   color: "#22c55e", bg: "#001408" },
  CANCELADO:  { label: "Cancelado",  color: "#6b7280", bg: "#111" },
};

const URGENCIA_CONFIG = {
  LOW:      { label: "Baja",    color: "#22c55e", dot: "🟢" },
  MEDIUM:   { label: "Media",   color: "#f59e0b", dot: "🟡" },
  HIGH:     { label: "Alta",    color: "#e63946", dot: "🔴" },
  CRITICAL: { label: "Crítica", color: "#ff0055", dot: "💥" },
};

const BLOQUES_UPB = {
  1:"Templo Universitario",2:"Aula Magna",3:"Bloque Rectoral",4:"Colegio UPB Primaria",
  5:"Colegio UPB Bachillerato",6:"Economía y Administración",7:"Ciencias Sociales",
  8:"Centro Audiovisual CPA",9:"Postgrados",10:"Arquitectura y Diseño",
  11:"Laboratorios / FORUM",12:"Derecho y Ciencias Políticas",13:"Editorial y Librería",
  14:"Bienestar Universitario",15:"Biblioteca Central",16:"Canchas Sintéticas",
  18:"Polideportivo",19:"Parqueaderos",24:"Puestos de Estudio",
  50:"Centro de Familia",51:"Casa de Institutos",52:"Conciliación y Arbitraje",
  53:"Casa de Transferencia",54:"Casa Bioingeniería",55:"Casa GIA",
};

// ── Datos mock para demo sin backend ─────────────────────────
const MOCK_REPORTES = [
  { id:1, rol:"ESTUDIANTE", contacto:"ana@upb.edu.co", numeroBloque:6, nombreBloque:"Economía y Administración", salon:"301", piso:"3", inhabilitado:true, categoria:"Eléctrico", subcategoria:"Lámpara / Bombillo", descripcion:"Tres lámparas del salón 301 están quemadas, la clase queda completamente a oscuras.", urgencia:"HIGH", estado:"PENDIENTE", notaAdmin:null, evidencias:[], fechaCreacion:"2026-03-05T08:30:00", fechaActualizacion:"2026-03-05T08:30:00", fechaResolucion:null },
  { id:2, rol:"DOCENTE", contacto:"prof@upb.edu.co", numeroBloque:10, nombreBloque:"Arquitectura y Diseño", salon:"Lab 2", piso:"1", inhabilitado:false, categoria:"Tecnología", subcategoria:"Proyector / Video beam", descripcion:"El videobeam del laboratorio 2 no enciende desde hace una semana.", urgencia:"CRITICAL", estado:"EN_PROCESO", notaAdmin:"Técnico asignado, revisión programada.", evidencias:[], fechaCreacion:"2026-03-04T14:00:00", fechaActualizacion:"2026-03-06T09:00:00", fechaResolucion:null },
  { id:3, rol:"ADMINISTRATIVO", contacto:null, numeroBloque:15, nombreBloque:"Biblioteca Central", salon:"Sala Silencio", piso:"2", inhabilitado:false, categoria:"Sanitario", subcategoria:"Grifo con fuga", descripcion:"El grifo del baño de la sala de silencio tiene fuga constante.", urgencia:"MEDIUM", estado:"RESUELTO", notaAdmin:"Reparado por fontanero el 06/03.", evidencias:[], fechaCreacion:"2026-03-01T10:00:00", fechaActualizacion:"2026-03-06T16:00:00", fechaResolucion:"2026-03-06T16:00:00" },
  { id:4, rol:"ESTUDIANTE", contacto:null, numeroBloque:6, nombreBloque:"Economía y Administración", salon:"201", piso:"2", inhabilitado:true, categoria:"Infraestructura", subcategoria:"Techo / Goteras", descripcion:"Hay una gotera grande en el techo del salón 201 cuando llueve.", urgencia:"CRITICAL", estado:"PENDIENTE", notaAdmin:null, evidencias:[], fechaCreacion:"2026-03-06T07:45:00", fechaActualizacion:"2026-03-06T07:45:00", fechaResolucion:null },
  { id:5, rol:"DOCENTE", contacto:"carlos@upb.edu.co", numeroBloque:11, nombreBloque:"Laboratorios / FORUM", salon:"Lab Redes", piso:"1", inhabilitado:false, categoria:"Tecnología", subcategoria:"Red WiFi", descripcion:"Sin señal WiFi en el laboratorio de redes desde el lunes.", urgencia:"HIGH", estado:"PENDIENTE", notaAdmin:null, evidencias:[], fechaCreacion:"2026-03-06T09:15:00", fechaActualizacion:"2026-03-06T09:15:00", fechaResolucion:null },
  { id:6, rol:"ESTUDIANTE", contacto:null, numeroBloque:14, nombreBloque:"Bienestar Universitario", salon:"Cafetería", piso:"1", inhabilitado:false, categoria:"Limpieza / Higiene", subcategoria:"Basura acumulada", descripcion:"Contenedores desbordados en la cafetería desde hace 2 días.", urgencia:"MEDIUM", estado:"EN_PROCESO", notaAdmin:"Personal de aseo notificado.", evidencias:[], fechaCreacion:"2026-03-05T12:00:00", fechaActualizacion:"2026-03-06T08:00:00", fechaResolucion:null },
];

// ── Componente principal ──────────────────────────────────────
export default function AdminDashboard() {
  const [vista, setVista] = useState("dashboard");
  const [reportes, setReportes] = useState(MOCK_REPORTES);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({ estado:"", urgencia:"", bloque:"", categoria:"" });
  const [cargando, setCargando] = useState(false);
  const [notif, setNotif] = useState(null);
  const [modoOnline, setModoOnline] = useState(false);

  // Intentar conectar con backend real
  useEffect(() => {
    fetch(`${API}/reportes/estadisticas`)
      .then(r => r.json())
      .then(() => { setModoOnline(true); cargarReportes(); })
      .catch(() => setModoOnline(false));
  }, []);

  const cargarReportes = useCallback(async () => {
    if (!modoOnline) return;
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtros.estado)    params.append("estado", filtros.estado);
      if (filtros.urgencia)  params.append("urgencia", filtros.urgencia);
      if (filtros.bloque)    params.append("bloque", filtros.bloque);
      if (filtros.categoria) params.append("categoria", filtros.categoria);
      const r = await fetch(`${API}/reportes?${params}`);
      setReportes(await r.json());
    } catch(e) { mostrarNotif("Error al cargar reportes", "error"); }
    finally { setCargando(false); }
  }, [modoOnline, filtros]);

  const mostrarNotif = (msg, tipo="ok") => {
    setNotif({ msg, tipo });
    setTimeout(() => setNotif(null), 3000);
  };

  const actualizarEstado = async (id, estado, notaAdmin) => {
    if (modoOnline) {
      try {
        await fetch(`${API}/reportes/${id}/estado`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado, notaAdmin }),
        });
        await cargarReportes();
      } catch(e) { mostrarNotif("Error al actualizar", "error"); return; }
    } else {
      setReportes(prev => prev.map(r => r.id === id
        ? { ...r, estado, notaAdmin, fechaResolucion: estado==="RESUELTO" ? new Date().toISOString() : r.fechaResolucion }
        : r));
    }
    setReporteSeleccionado(prev => prev ? {...prev, estado, notaAdmin} : null);
    mostrarNotif("Estado actualizado correctamente");
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este reporte?")) return;
    if (modoOnline) {
      try { await fetch(`${API}/reportes/${id}`, { method: "DELETE" }); await cargarReportes(); }
      catch(e) { mostrarNotif("Error al eliminar", "error"); return; }
    } else {
      setReportes(prev => prev.filter(r => r.id !== id));
    }
    setReporteSeleccionado(null);
    mostrarNotif("Reporte eliminado");
  };

  const reportesFiltrados = modoOnline ? reportes : reportes.filter(r => {
    if (filtros.estado && r.estado !== filtros.estado) return false;
    if (filtros.urgencia && r.urgencia !== filtros.urgencia) return false;
    if (filtros.bloque && r.numeroBloque !== parseInt(filtros.bloque)) return false;
    if (filtros.categoria && !r.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: reportes.length,
    pendientes: reportes.filter(r => r.estado==="PENDIENTE").length,
    enProceso: reportes.filter(r => r.estado==="EN_PROCESO").length,
    resueltos: reportes.filter(r => r.estado==="RESUELTO").length,
    criticos: reportes.filter(r => r.urgencia==="CRITICAL").length,
    inhabilitados: reportes.filter(r => r.inhabilitado && ["PENDIENTE","EN_PROCESO"].includes(r.estado)).length,
  };

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ minHeight:"100vh", background:"#0a0a0a" }}>

        {/* HEADER */}
        <header style={{ background:"#111", borderBottom:"3px solid #e63946", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ fontFamily:"Bebas Neue", fontSize:26, color:"#e63946", letterSpacing:2 }}>UPB</span>
            <span style={{ fontFamily:"Bebas Neue", fontSize:20, color:"#f0f0f0", letterSpacing:1 }}>CAMPUS ALERT</span>
            <span style={{ background:"#e63946", color:"#fff", fontSize:10, fontFamily:"IBM Plex Mono", padding:"2px 8px", fontWeight:600 }}>ADMIN</span>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[
              { id:"dashboard", label:"📊 Dashboard" },
              { id:"lista",     label:"📋 Reportes" },
              { id:"mapa",      label:"🗺 Mapa" },
            ].map(v => (
              <button key={v.id} onClick={() => setVista(v.id)} style={{ background: vista===v.id ? "#e63946":"transparent", color: vista===v.id ? "#fff":"#aaa", border: vista===v.id ? "none":"1px solid #333", padding:"6px 14px", fontFamily:"Barlow Condensed", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:0.5 }}>
                {v.label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, fontFamily:"IBM Plex Mono", color: modoOnline?"#22c55e":"#f59e0b" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background: modoOnline?"#22c55e":"#f59e0b", display:"inline-block", animation:"pulse 2s infinite" }}/>
            {modoOnline ? "CONECTADO" : "MODO DEMO"}
          </div>
        </header>

        {/* NOTIFICACIÓN */}
        {notif && (
          <div style={{ position:"fixed", top:64, right:20, zIndex:999, background: notif.tipo==="error"?"#e63946":"#22c55e", color:"#fff", padding:"10px 20px", fontFamily:"IBM Plex Mono", fontSize:13, fontWeight:600, animation:"slideIn 0.3s ease", boxShadow:"0 4px 20px rgba(0,0,0,0.5)" }}>
            {notif.tipo==="error" ? "✗" : "✓"} {notif.msg}
          </div>
        )}

        <main style={{ padding:"24px", maxWidth:1400, margin:"0 auto" }}>
          {vista==="dashboard" && <VistaDashboard stats={stats} reportes={reportes} setVista={setVista} />}
          {vista==="lista"     && <VistaLista reportes={reportesFiltrados} filtros={filtros} setFiltros={setFiltros} onSeleccionar={setReporteSeleccionado} cargando={cargando} />}
          {vista==="mapa"      && <VistaMapa reportes={reportes} onSeleccionar={r => { setReporteSeleccionado(r); }} />}
        </main>

        {/* PANEL DETALLE */}
        {reporteSeleccionado && (
          <PanelDetalle
            reporte={reporteSeleccionado}
            onCerrar={() => setReporteSeleccionado(null)}
            onActualizar={actualizarEstado}
            onEliminar={eliminar}
          />
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
//  VISTA DASHBOARD
// ══════════════════════════════════════════════════════════════
function VistaDashboard({ stats, reportes, setVista }) {
  const porCategoria = reportes.reduce((acc, r) => {
    acc[r.categoria] = (acc[r.categoria] || 0) + 1; return acc;
  }, {});
  const porBloque = reportes.reduce((acc, r) => {
    const k = `Bloque ${r.numeroBloque}`; acc[k] = (acc[k] || 0) + 1; return acc;
  }, {});

  const maxCat = Math.max(...Object.values(porCategoria), 1);
  const maxBlq = Math.max(...Object.values(porBloque), 1);

  const urgentes = reportes.filter(r => ["CRITICAL","HIGH"].includes(r.urgencia) && r.estado==="PENDIENTE").slice(0,4);

  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:40, letterSpacing:2, color:"#f0f0f0" }}>PANEL DE CONTROL</h1>
        <p style={{ color:"#666", fontFamily:"IBM Plex Mono", fontSize:12 }}>Sistema de gestión de daños — Universidad Pontificia Bolivariana</p>
      </div>

      {/* TARJETAS STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:28 }}>
        {[
          { label:"TOTAL",         valor:stats.total,       color:"#f0f0f0", bg:"#161616" },
          { label:"PENDIENTES",    valor:stats.pendientes,  color:"#f59e0b", bg:"#1c1400" },
          { label:"EN PROCESO",    valor:stats.enProceso,   color:"#3b82f6", bg:"#00091c" },
          { label:"RESUELTOS",     valor:stats.resueltos,   color:"#22c55e", bg:"#001408" },
          { label:"CRÍTICOS",      valor:stats.criticos,    color:"#ff0055", bg:"#1a0010" },
          { label:"INHABILITADOS", valor:stats.inhabilitados, color:"#fbbf24", bg:"#1a1000" },
        ].map(c => (
          <div key={c.label} style={{ background:c.bg, border:`1px solid ${c.color}33`, padding:"20px 16px", position:"relative", overflow:"hidden" }}>
            <div style={{ fontFamily:"Bebas Neue", fontSize:52, color:c.color, lineHeight:1 }}>{c.valor}</div>
            <div style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#888", marginTop:4, letterSpacing:1 }}>{c.label}</div>
            <div style={{ position:"absolute", right:-10, top:-10, fontFamily:"Bebas Neue", fontSize:80, color:c.color, opacity:0.05, lineHeight:1 }}>{c.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:28 }}>
        {/* GRÁFICA POR CATEGORÍA */}
        <div style={{ background:"#111", border:"1px solid #222", padding:20 }}>
          <h3 style={{ fontFamily:"Bebas Neue", fontSize:18, letterSpacing:1, color:"#e63946", marginBottom:16 }}>DAÑOS POR CATEGORÍA</h3>
          {Object.entries(porCategoria).sort((a,b)=>b[1]-a[1]).map(([cat, n]) => (
            <div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Barlow Condensed", fontSize:13, fontWeight:600, color:"#ccc", marginBottom:4 }}>
                <span>{cat}</span><span style={{ color:"#e63946" }}>{n}</span>
              </div>
              <div style={{ height:6, background:"#222", borderRadius:0 }}>
                <div style={{ height:"100%", width:`${(n/maxCat)*100}%`, background:`linear-gradient(90deg,#e63946,#ff6b6b)`, transition:"width 0.6s ease" }}/>
              </div>
            </div>
          ))}
        </div>

        {/* GRÁFICA POR BLOQUE */}
        <div style={{ background:"#111", border:"1px solid #222", padding:20 }}>
          <h3 style={{ fontFamily:"Bebas Neue", fontSize:18, letterSpacing:1, color:"#f59e0b", marginBottom:16 }}>REPORTES POR BLOQUE</h3>
          {Object.entries(porBloque).sort((a,b)=>b[1]-a[1]).map(([blq, n]) => (
            <div key={blq} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Barlow Condensed", fontSize:13, fontWeight:600, color:"#ccc", marginBottom:4 }}>
                <span>{blq}</span><span style={{ color:"#f59e0b" }}>{n}</span>
              </div>
              <div style={{ height:6, background:"#222" }}>
                <div style={{ height:"100%", width:`${(n/maxBlq)*100}%`, background:`linear-gradient(90deg,#f59e0b,#fbbf24)`, transition:"width 0.6s ease" }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORTES URGENTES */}
      {urgentes.length > 0 && (
        <div style={{ background:"#1a0010", border:"1px solid #e6394633", padding:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontFamily:"Bebas Neue", fontSize:18, letterSpacing:1, color:"#ff0055" }}>⚡ REQUIEREN ATENCIÓN INMEDIATA</h3>
            <button onClick={() => setVista("lista")} style={{ background:"transparent", border:"1px solid #e63946", color:"#e63946", padding:"4px 12px", fontFamily:"Barlow Condensed", fontSize:13, fontWeight:700, cursor:"pointer" }}>VER TODOS →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
            {urgentes.map(r => (
              <div key={r.id} style={{ background:"#0a0a0a", border:"1px solid #e6394644", padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"#666" }}>#{r.id}</span>
                  <span style={{ fontSize:11, fontFamily:"IBM Plex Mono", color: URGENCIA_CONFIG[r.urgencia].color, fontWeight:600 }}>{URGENCIA_CONFIG[r.urgencia].dot} {URGENCIA_CONFIG[r.urgencia].label}</span>
                </div>
                <div style={{ fontFamily:"Barlow Condensed", fontSize:15, fontWeight:700, color:"#f0f0f0", marginBottom:4 }}>Bloque {r.numeroBloque} — {r.salon}</div>
                <div style={{ fontFamily:"Barlow Condensed", fontSize:13, color:"#888" }}>{r.categoria} · {r.subcategoria}</div>
                {r.inhabilitado && <div style={{ marginTop:6, fontSize:11, fontFamily:"IBM Plex Mono", color:"#f59e0b" }}>⚠ ESPACIO INHABILITADO</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  VISTA LISTA
// ══════════════════════════════════════════════════════════════
function VistaLista({ reportes, filtros, setFiltros, onSeleccionar, cargando }) {
  const inputStyle = { background:"#161616", border:"1px solid #333", color:"#f0f0f0", padding:"7px 12px", fontFamily:"Barlow Condensed", fontSize:14, outline:"none", width:"100%" };

  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"Bebas Neue", fontSize:36, letterSpacing:2, color:"#f0f0f0" }}>REPORTES DE DAÑOS</h1>
          <p style={{ color:"#666", fontFamily:"IBM Plex Mono", fontSize:11 }}>{reportes.length} registros encontrados</p>
        </div>
        {cargando && <span style={{ fontFamily:"IBM Plex Mono", fontSize:12, color:"#f59e0b", animation:"pulse 1s infinite" }}>⟳ CARGANDO...</span>}
      </div>

      {/* FILTROS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20, background:"#111", border:"1px solid #222", padding:16 }}>
        <div>
          <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:4, letterSpacing:1 }}>ESTADO</label>
          <select style={inputStyle} value={filtros.estado} onChange={e => setFiltros(p=>({...p,estado:e.target.value}))}>
            <option value="">Todos</option>
            {Object.entries(ESTADO_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:4, letterSpacing:1 }}>URGENCIA</label>
          <select style={inputStyle} value={filtros.urgencia} onChange={e => setFiltros(p=>({...p,urgencia:e.target.value}))}>
            <option value="">Todas</option>
            {Object.entries(URGENCIA_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.dot} {v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:4, letterSpacing:1 }}>BLOQUE</label>
          <select style={inputStyle} value={filtros.bloque} onChange={e => setFiltros(p=>({...p,bloque:e.target.value}))}>
            <option value="">Todos</option>
            {Object.entries(BLOQUES_UPB).map(([n,nom]) => <option key={n} value={n}>Bloque {n} — {nom}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:4, letterSpacing:1 }}>CATEGORÍA</label>
          <input style={inputStyle} placeholder="Buscar categoría..." value={filtros.categoria} onChange={e => setFiltros(p=>({...p,categoria:e.target.value}))} />
        </div>
      </div>

      {/* TABLA */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"Barlow Condensed" }}>
          <thead>
            <tr style={{ background:"#e63946", color:"#fff" }}>
              {["#","ROL","BLOQUE / SALÓN","CATEGORÍA","URGENCIA","ESTADO","INHABILITADO","FECHA","ACCIÓN"].map(h => (
                <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:12, fontWeight:700, letterSpacing:1, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportes.length === 0 && (
              <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:"#444", fontFamily:"IBM Plex Mono", fontSize:13 }}>No hay reportes que coincidan con los filtros</td></tr>
            )}
            {reportes.map((r, i) => {
              const ec = ESTADO_CONFIG[r.estado] || ESTADO_CONFIG.PENDIENTE;
              const uc = URGENCIA_CONFIG[r.urgencia] || URGENCIA_CONFIG.LOW;
              return (
                <tr key={r.id} style={{ background: i%2===0?"#111":"#141414", borderBottom:"1px solid #1e1e1e", cursor:"pointer", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#1a1a1a"}
                  onMouseLeave={e => e.currentTarget.style.background= i%2===0?"#111":"#141414"}
                  onClick={() => onSeleccionar(r)}>
                  <td style={{ padding:"10px 12px", color:"#555", fontSize:12, fontFamily:"IBM Plex Mono" }}>#{r.id}</td>
                  <td style={{ padding:"10px 12px", fontSize:13, fontWeight:600, color:"#ccc" }}>{r.rol}</td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#f0f0f0" }}>Bloque {r.numeroBloque} — {r.salon}</div>
                    <div style={{ fontSize:12, color:"#666" }}>{r.nombreBloque}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#ccc" }}>{r.categoria}</div>
                    <div style={{ fontSize:12, color:"#666" }}>{r.subcategoria}</div>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ color:uc.color, fontWeight:700, fontSize:13 }}>{uc.dot} {uc.label}</span>
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <span style={{ background:ec.bg, color:ec.color, border:`1px solid ${ec.color}55`, padding:"3px 10px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>{ec.label}</span>
                  </td>
                  <td style={{ padding:"10px 12px", textAlign:"center" }}>
                    {r.inhabilitado ? <span style={{ color:"#f59e0b", fontSize:16 }}>⚠</span> : <span style={{ color:"#333" }}>—</span>}
                  </td>
                  <td style={{ padding:"10px 12px", color:"#666", fontSize:12, fontFamily:"IBM Plex Mono", whiteSpace:"nowrap" }}>
                    {new Date(r.fechaCreacion).toLocaleDateString("es-CO")}
                  </td>
                  <td style={{ padding:"10px 12px" }}>
                    <button onClick={e => { e.stopPropagation(); onSeleccionar(r); }} style={{ background:"#e63946", color:"#fff", border:"none", padding:"5px 12px", fontFamily:"Barlow Condensed", fontSize:13, fontWeight:700, cursor:"pointer", letterSpacing:0.5 }}>
                      GESTIONAR
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  VISTA MAPA
// ══════════════════════════════════════════════════════════════
function VistaMapa({ reportes, onSeleccionar }) {
  const [bloqueHover, setBloqueHover] = useState(null);

  const porBloque = reportes.reduce((acc, r) => {
    if (!acc[r.numeroBloque]) acc[r.numeroBloque] = [];
    acc[r.numeroBloque].push(r); return acc;
  }, {});

  const colorBloque = (num) => {
    const rs = porBloque[num] || [];
    if (rs.length === 0) return "#1a1a1a";
    if (rs.some(r => r.urgencia === "CRITICAL" && r.estado !== "RESUELTO")) return "#e63946";
    if (rs.some(r => r.urgencia === "HIGH" && r.estado !== "RESUELTO")) return "#c0392b";
    if (rs.some(r => r.estado === "PENDIENTE")) return "#f59e0b";
    if (rs.every(r => r.estado === "RESUELTO")) return "#22c55e";
    return "#3b82f6";
  };

  const bloques = Object.entries(BLOQUES_UPB).map(([num, nombre]) => ({
    num: parseInt(num), nombre, reportes: porBloque[parseInt(num)] || [],
    color: colorBloque(parseInt(num))
  }));

  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"Bebas Neue", fontSize:36, letterSpacing:2, color:"#f0f0f0" }}>MAPA DEL CAMPUS</h1>
        <p style={{ color:"#666", fontFamily:"IBM Plex Mono", fontSize:11 }}>Estado de daños por bloque — haz clic para ver reportes</p>
      </div>

      {/* LEYENDA */}
      <div style={{ display:"flex", gap:20, marginBottom:20, flexWrap:"wrap" }}>
        {[
          { color:"#e63946", label:"Crítico" },
          { color:"#f59e0b", label:"Pendiente" },
          { color:"#3b82f6", label:"En proceso" },
          { color:"#22c55e", label:"Resuelto" },
          { color:"#1a1a1a", label:"Sin reportes" },
        ].map(l => (
          <div key={l.label} style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"Barlow Condensed", fontSize:14, color:"#aaa" }}>
            <div style={{ width:16, height:16, background:l.color, border:"1px solid #333" }}/>
            {l.label}
          </div>
        ))}
      </div>

      {/* GRID DE BLOQUES */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:8 }}>
        {bloques.map(b => (
          <div key={b.num}
            onMouseEnter={() => setBloqueHover(b.num)}
            onMouseLeave={() => setBloqueHover(null)}
            style={{ background: bloqueHover===b.num ? b.color : `${b.color}33`, border:`2px solid ${b.color}`, padding:12, cursor: b.reportes.length>0?"pointer":"default", transition:"all 0.2s", position:"relative", minHeight:90 }}
            onClick={() => b.reportes.length > 0 && onSeleccionar(b.reportes[0])}>
            <div style={{ fontFamily:"Bebas Neue", fontSize:28, color: bloqueHover===b.num ? "#fff" : b.color, lineHeight:1 }}>{b.num}</div>
            <div style={{ fontFamily:"Barlow Condensed", fontSize:11, color: bloqueHover===b.num ? "#fff" : "#888", lineHeight:1.3, marginTop:4 }}>{b.nombre}</div>
            {b.reportes.length > 0 && (
              <div style={{ position:"absolute", top:8, right:8, background:b.color, color:"#fff", fontFamily:"IBM Plex Mono", fontSize:11, fontWeight:600, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%" }}>
                {b.reportes.length}
              </div>
            )}
            {b.reportes.some(r => r.inhabilitado && r.estado !== "RESUELTO") && (
              <div style={{ marginTop:6, fontFamily:"IBM Plex Mono", fontSize:10, color:"#f59e0b" }}>⚠ INHABILITADO</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PANEL DETALLE (DRAWER)
// ══════════════════════════════════════════════════════════════
function PanelDetalle({ reporte, onCerrar, onActualizar, onEliminar }) {
  const [nuevoEstado, setNuevoEstado] = useState(reporte.estado);
  const [nota, setNota] = useState(reporte.notaAdmin || "");
  const [guardando, setGuardando] = useState(false);

  const ec = ESTADO_CONFIG[reporte.estado] || ESTADO_CONFIG.PENDIENTE;
  const uc = URGENCIA_CONFIG[reporte.urgencia] || URGENCIA_CONFIG.LOW;

  const guardar = async () => {
    setGuardando(true);
    await onActualizar(reporte.id, nuevoEstado, nota);
    setGuardando(false);
  };

  const inputStyle = { background:"#0a0a0a", border:"1px solid #333", color:"#f0f0f0", padding:"8px 12px", fontFamily:"Barlow Condensed", fontSize:14, outline:"none", width:"100%" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
      {/* Overlay */}
      <div style={{ flex:1, background:"rgba(0,0,0,0.7)" }} onClick={onCerrar}/>
      {/* Panel */}
      <div style={{ width:480, background:"#111", borderLeft:"3px solid #e63946", overflowY:"auto", animation:"slideIn 0.3s ease", display:"flex", flexDirection:"column" }}>

        {/* Header del panel */}
        <div style={{ background:"#e63946", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0 }}>
          <div>
            <div style={{ fontFamily:"Bebas Neue", fontSize:22, letterSpacing:1, color:"#fff" }}>REPORTE #{reporte.id}</div>
            <div style={{ fontFamily:"IBM Plex Mono", fontSize:11, color:"rgba(255,255,255,0.7)" }}>{new Date(reporte.fechaCreacion).toLocaleString("es-CO")}</div>
          </div>
          <button onClick={onCerrar} style={{ background:"rgba(0,0,0,0.3)", border:"none", color:"#fff", width:32, height:32, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:20, display:"flex", flexDirection:"column", gap:16, flex:1 }}>

          {/* Badges urgencia / estado */}
          <div style={{ display:"flex", gap:10 }}>
            <span style={{ background:ec.bg, color:ec.color, border:`1px solid ${ec.color}55`, padding:"4px 14px", fontFamily:"Barlow Condensed", fontSize:14, fontWeight:700 }}>{ec.label}</span>
            <span style={{ color:uc.color, fontFamily:"Barlow Condensed", fontSize:14, fontWeight:700, padding:"4px 0" }}>{uc.dot} {uc.label}</span>
            {reporte.inhabilitado && <span style={{ background:"#1c1400", color:"#f59e0b", border:"1px solid #f59e0b55", padding:"4px 14px", fontFamily:"IBM Plex Mono", fontSize:11, fontWeight:600 }}>⚠ INHABILITADO</span>}
          </div>

          {/* Info básica */}
          <Seccion titulo="UBICACIÓN">
            <Fila label="Bloque" valor={`${reporte.numeroBloque} — ${reporte.nombreBloque}`} />
            <Fila label="Salón" valor={reporte.salon} />
            {reporte.piso && <Fila label="Piso" valor={reporte.piso} />}
          </Seccion>

          <Seccion titulo="DAÑO REPORTADO">
            <Fila label="Categoría" valor={reporte.categoria} />
            <Fila label="Elemento" valor={reporte.subcategoria} />
            <div style={{ background:"#0a0a0a", border:"1px solid #222", padding:12, marginTop:8 }}>
              <div style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#555", letterSpacing:1, marginBottom:6 }}>DESCRIPCIÓN</div>
              <p style={{ fontFamily:"Barlow Condensed", fontSize:15, color:"#ddd", lineHeight:1.5 }}>{reporte.descripcion}</p>
            </div>
          </Seccion>

          <Seccion titulo="REPORTANTE">
            <Fila label="Rol" valor={reporte.rol} />
            <Fila label="Contacto" valor={reporte.contacto || "No proporcionado"} />
          </Seccion>

          {/* GESTIÓN ADMIN */}
          <div style={{ background:"#0a0a0a", border:"1px solid #e6394633", padding:16 }}>
            <div style={{ fontFamily:"Bebas Neue", fontSize:16, letterSpacing:1, color:"#e63946", marginBottom:14 }}>GESTIÓN ADMINISTRATIVA</div>

            <div style={{ marginBottom:12 }}>
              <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:6, letterSpacing:1 }}>CAMBIAR ESTADO</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
                  <button key={k} onClick={() => setNuevoEstado(k)}
                    style={{ background: nuevoEstado===k ? v.bg : "transparent", border:`2px solid ${nuevoEstado===k ? v.color : "#333"}`, color: nuevoEstado===k ? v.color : "#555", padding:"8px 6px", fontFamily:"Barlow Condensed", fontSize:13, fontWeight:700, cursor:"pointer", letterSpacing:0.5, transition:"all 0.15s" }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#666", display:"block", marginBottom:6, letterSpacing:1 }}>NOTA INTERNA</label>
              <textarea value={nota} onChange={e => setNota(e.target.value)} rows={3}
                placeholder="Agregar nota para el equipo técnico..."
                style={{ ...inputStyle, resize:"vertical", lineHeight:1.5 }}/>
            </div>

            <button onClick={guardar} disabled={guardando}
              style={{ width:"100%", background: guardando?"#333":"#e63946", color:"#fff", border:"none", padding:"12px", fontFamily:"Bebas Neue", fontSize:18, letterSpacing:2, cursor: guardando?"not-allowed":"pointer", transition:"background 0.2s" }}>
              {guardando ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </div>

          {/* ELIMINAR */}
          <button onClick={() => onEliminar(reporte.id)}
            style={{ background:"transparent", color:"#e63946", border:"1px solid #e6394655", padding:"10px", fontFamily:"Barlow Condensed", fontSize:14, fontWeight:700, cursor:"pointer", letterSpacing:1, marginTop:"auto" }}>
            🗑 ELIMINAR REPORTE
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componentes auxiliares ────────────────────────────────────
function Seccion({ titulo, children }) {
  return (
    <div>
      <div style={{ fontFamily:"IBM Plex Mono", fontSize:10, color:"#555", letterSpacing:2, marginBottom:8, borderBottom:"1px solid #1e1e1e", paddingBottom:4 }}>{titulo}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>{children}</div>
    </div>
  );
}

function Fila({ label, valor }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Barlow Condensed", fontSize:14 }}>
      <span style={{ color:"#555", minWidth:80 }}>{label}</span>
      <span style={{ color:"#ddd", textAlign:"right", maxWidth:280 }}>{valor}</span>
    </div>
  );
}