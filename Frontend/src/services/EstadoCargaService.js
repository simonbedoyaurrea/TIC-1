// services/estadoCarga.js
import apiClient from "../apis/apiClient";

export const getEstadoCarga = () =>
  apiClient.get("/simulacion/estado").then((r) => r.data);
