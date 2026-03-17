import apiClient from '../apis/apiClient'

export const aulaService = {

  obtenerTodas: async () => {
    const response = await apiClient.get("/aulas");
    return response.data;
  },

  obtenerPorBloque: async (bloque) => {
    const response = await apiClient.get(`/aulas/bloque/${bloque}`);
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await apiClient.get(`/aulas/${id}`);
    return response.data;
  },

  //CUIDADO !!
  filtrarPorPiso: async (bloque, piso) => {
    const aulas = await aulaService.obtenerPorBloque(bloque);
    return aulas.filter(aula => aula.piso === piso);
  }

};