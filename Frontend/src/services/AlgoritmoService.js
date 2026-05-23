import apiClient from "../apis/apiClient";

export const obtenerEstado = async (id) => {
  const res = await apiClient.get(`/simulacion/estado/${id}`);
  return res.data;
};

export const obtenerResultado = async (id) => {
  const res = await apiClient.get(`/simulacion/resultado/${id}`, {
    responseType: "blob", // ← obligatorio para descargar Excel
  });
  return res.data;
};

export const agregarHorarioService = async (payload) => {
  const response = await apiClient.post(
    "/simulacion/horarios/agregar",
    payload,
  );

  return response.data;
};

export const descargarHorario = async () => {
  const response = await apiClient.get("/simulacion/horarios", {
    responseType: "blob", // axios entrega response.data como blob directamente
  });

  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = "horario.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
};

export const BuscarHorariosService = async (payload) => {
  const response = await apiClient.post(
    "/simulacion/horarios/optimizador",
    payload,
  );

  return response;
};

export const obtenerMateriasService = async () => {
  const response = await apiClient.get("/simulacion/materias");

  return response.data;
};
