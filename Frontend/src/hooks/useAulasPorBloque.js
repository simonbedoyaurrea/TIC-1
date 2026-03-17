import { useEffect, useState } from "react";
import { obtenerAulasBloque } from "../services/UbicacionService";

export const useAulasPorBloque = (bloqueId) => {

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerAulasBloque(bloqueId);
        setAulas(data);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [bloqueId]);

  return { aulas, loading };
};