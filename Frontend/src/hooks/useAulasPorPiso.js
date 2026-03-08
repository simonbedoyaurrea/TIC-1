import { aulaService } from "../services/AulaService";
import { useEffect, useState } from "react";

export const useAulasPorPiso = (bloque, piso) => {

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const cargar = async () => {
      setLoading(true);

      try {
        const data = await aulaService.obtenerPorBloque(bloque);

        const filtradas = piso
          ? data.filter((aula) => aula.piso === piso)
          : data;

        setAulas(filtradas);

      } catch (error) {
        console.error("Error cargando aulas", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();

  }, [bloque, piso]);

  return { aulas, loading };
};