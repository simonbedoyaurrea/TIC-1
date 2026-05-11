import apiClient from "../apis/apiClient";

export const horarioService = {
  obtenerTodos: async () => {
    const response = await apiClient.get("/horarios");
    console.log(response);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/horarios/${id}`);
    return response.data;
  },

  obtenerHorariosAula: async (id) => {
    const response = await apiClient.get(`/horarios/aula/${id}`);
    return response.data;
  },
};
