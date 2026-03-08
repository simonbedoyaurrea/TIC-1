import { useEffect, useState } from "react";
import { aulaService } from "../services/AulaService";

export const useAulasPorId = (id) => {

  const [aula, setAula] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await aulaService.obtenerPorId(id);
        setAula(data);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  return { aula, loading };
};