import apiClient from "../apis/apiClient";

export const obtenerEstado = async (id) => {
  const res = await apiClient.get(`/simulacion/estado/${id}`);
  return res;
};

export const obtenerResultado = async (id) => {
  const res = await apiClient.get(`/simulacion/resultado/${id}`);
  return res;
};

export const agregarHorarioService = async (payload) => {
  const response = await apiClient.post(
    "/simulacion/horarios/agregar",
    payload,
  );

  return response.data;
};

export const BuscarHorariosService = async (payload) => {
  const response = await apiClient.post(
    "/simulacion/horarios/horario",
    payload,
  );

  return response.data;
};

export const obtenerMateriasService = async () => {
  const response = await apiClient.get("/simulacion/materias");

  return response.data;
};
