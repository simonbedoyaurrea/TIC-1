import { getToken } from "./AuthService";

const API_URL = "http://localhost:8080/api/reportes";

function buildQuery(params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

export async function enviarReporte(reporteDto, archivos = []) {
  try {
    const fd = new FormData();
    fd.append("reporte", new Blob([JSON.stringify(reporteDto)], { type: "application/json" }));
    if (archivos && archivos.length) {
      archivos.forEach((f) => fd.append("archivos", f));
    }

    const headers = {};
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resp = await fetch(API_URL, {
      method: "POST",
      headers,
      body: fd,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Error al enviar reporte");
    }

    return await resp.json();
  } catch (err) {
    throw err;
  }
}

export async function listarReportes(filters = {}) {
  const qs = buildQuery(filters);
  const resp = await fetch(`${API_URL}${qs}`);
  if (!resp.ok) throw new Error("Error al listar reportes");
  return await resp.json();
}

export async function obtenerReporte(id) {
  const resp = await fetch(`${API_URL}/${id}`);
  if (!resp.ok) throw new Error("Reporte no encontrado");
  return await resp.json();
}

export async function obtenerEstadisticas() {
  const resp = await fetch(`${API_URL}/estadisticas`);
  if (!resp.ok) throw new Error("Error al obtener estadísticas");
  return await resp.json();
}

export async function actualizarEstado(id, dto) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${API_URL}/${id}/estado`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(dto),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(t || "Error al actualizar estado");
  }
  return await resp.json();
}

export async function eliminarReporte(id) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const resp = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(t || "Error al eliminar reporte");
  }
  return true;
}
