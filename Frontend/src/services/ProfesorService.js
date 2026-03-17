import apiClient from "../apis/apiClient";

export const profesorService = {
  obtenerProfesores: async () => {
    const response = await apiClient.get("/profesores");
    return response.data;
  },

  filtrarProfesores: async (profesores, nombre) => {
    //Limpieza busqueda
    const busqueda = nombre?.toLowerCase().trim();

    const filtrados = busqueda
      ? profesores.filter((profe) =>
          profe.nombre.toLowerCase().includes(busqueda),
        )
      : profesores;

    return filtrados;
  },
};
