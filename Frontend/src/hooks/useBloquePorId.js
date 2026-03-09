import { ubicacionService } from "../services/UbicacionService";
import { useEffect, useState } from "react";

export const useBloquePorId = (id) => {
  const [bloque, setBloque] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await ubicacionService.obtenerPorId(id);
        console.log(data);
        setBloque(data);
      } catch (error) {
        console.error("Error cargando aulas", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  return { bloque, loading };
};
