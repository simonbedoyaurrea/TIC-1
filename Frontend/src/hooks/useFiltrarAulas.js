import { useState, useEffect, useMemo } from "react";
import { aulaService } from "../services/AulaService";

export const useFiltrarAulas = (nombre) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aulaService
      .obtenerTodas()
      .then(setAulas)
      .finally(() => setLoading(false));
  }, []);

  const aulasFiltradas = useMemo(() => {
    const busqueda = nombre?.toLowerCase().trim();

    if (!busqueda) return aulas;

    return aulas.filter((aula) => {
      const codigoAula = `bloque ${aula.ubicacion} ${aula.piso}${aula.numeroAula>10?aula.numeroAula:"0"+aula.numeroAula}`;
      return codigoAula.toLowerCase().includes(busqueda);
    });
  }, [nombre, aulas]); // Solo recalcula si uno de estos dos cambia

  return { aulasFiltradas, loading };
};
