import apiClient from "../apis/apiClient";

export const cargaDatosOptimizadorService = async (
  formDataMaterias,
  formDataHorarios,
) => {
  const [resMaterias, resHorarios] = await Promise.all([
    apiClient.post("/simulacion/materias/carga", formDataMaterias, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

    apiClient.post("/simulacion/horarios/carga", formDataHorarios, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  ]);

  return {
    materias: resMaterias.data,
    horarios: resHorarios.data,
  };
};

export const cargaDatosSimuladorService = async (formData) => {
  const response = await apiClient.post("/simulacion/carga", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
