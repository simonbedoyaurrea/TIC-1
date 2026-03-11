import { useState, useEffect, useMemo } from "react";
import { profesorService } from "../services/ProfesorService";

export const useFiltrarProfesores = (nombre) => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profesorService
      .obtenerProfesores()
      .then(setProfesores)
      .finally(() => setLoading(false));
  }, []);

  const profesoresFiltrados = useMemo(() => {
    const busqueda = nombre?.toLowerCase().trim();

    if (!busqueda) return profesores;

    return profesores.filter((profe) =>
      profe.nombre.toLowerCase().includes(busqueda),
    );
  }, [nombre, profesores]); // Solo recalcula si uno de estos dos cambia

  return { profesoresFiltrados, loading };
};
