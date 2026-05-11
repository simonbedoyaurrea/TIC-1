import { useState } from "react";
import { aulaService } from "../services/AulaService";

export const useAula = () => {
  const [aula, setAula] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const obtenerPorId = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aulaService.obtenerPorId(id);
      console.log(data);
      setAula(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al intentar obtener un aula");
      }
    } finally {
      setLoading(false);
    }
  };

  return { aula, loading, error, obtenerPorId };
};
