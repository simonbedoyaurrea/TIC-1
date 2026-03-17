import apiClient from "../apis/apiClient";

export const materiaService = {
  obtenerMaterias: async () => {
    const response = await apiClient.get("/materias");
    return response.data;
  },

  filtrarMaterias: async (materias, nombre) => {
    //Limpieza busqueda
    const busqueda = nombre?.toLowerCase().trim();

    const filtradas = busqueda
      ? materias.filter((materia) =>
          materia.nombre.toLowerCase().includes(busqueda),
        )
      : materias;

    return filtradas;
  },
};
