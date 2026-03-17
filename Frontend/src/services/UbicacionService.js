import api from "../apis/apiClient";

export const ubicacionService = {

  obtenerTodas: async () => {
    const response = await api.get("/bloques");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/bloques/${id}`);
    return response.data;
  },

  obtenerAulasBloque: async (id) => {
    const response = await api.get(`/bloques/aulas/${id}`);
    return response.data;
  }


};