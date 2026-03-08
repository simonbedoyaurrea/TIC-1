import api from "../apis/axiosConfig";

export const aulaService = {

  obtenerTodas: async () => {
    const response = await api.get("/aulas");
    return response.data;
  },

  obtenerPorBloque: async (bloque) => {
    const response = await api.get(`/aulas/bloque/${bloque}`);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/aulas/${id}`);
    return response.data;
  },

  //CUIDADO !!
  filtrarPorPiso: async (bloque, piso) => {
    const aulas = await aulaService.obtenerPorBloque(bloque);
    return aulas.filter(aula => aula.piso === piso);
  }

};