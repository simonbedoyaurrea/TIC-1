import { ubicacionService } from "../services/UbicacionService";
import { useEffect, useState } from "react";

export const useAulasPorPiso = (bloque, piso) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);

      try {
        const data = await ubicacionService.obtenerAulasBloque(bloque);
        console.log(data);

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
