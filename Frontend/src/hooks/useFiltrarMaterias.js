import { useState, useEffect, useMemo } from "react";
import { materiaService } from "../services/MateriaService";

export const useFiltrarMaterias = (nombre) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    materiaService
      .obtenerMaterias()
      .then(setMaterias)
      .finally(() => setLoading(false));
  }, []);

  const materiasFiltradas = useMemo(() => {
    const busqueda = nombre?.toLowerCase().trim();

    if (!busqueda) return materias;

    return materias.filter((materia) =>
      materia.nombre.toLowerCase().includes(busqueda),
    );
  }, [nombre, materias]); // Solo recalcula si uno de estos dos cambia

  return { materiasFiltradas, loading };
};
