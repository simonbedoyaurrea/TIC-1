import { useState, useEffect } from 'react'
import {useDebounce} from '../hooks/useDebounce'
import {useFiltrarProfesores} from '../hooks/useFiltrarProfesores'

import {SearchBar} from '../components/SearchBar'

export const FormularioPage = () => {
  const [queryProfesor, setQueryProfesor] = useState("");
  const [queryAula, setQueryAula] = useState("");
  const [queryMateria, setQueryMateria] = useState("");

  const debouncedProfesor = useDebounce(queryProfesor);
  const debouncedAula = useDebounce(queryAula);
  const debouncedMateria = useDebounce(queryMateria);

  const { profesoresFiltrados, loading: loadingProfesor } = useFiltrarProfesores(debouncedProfesor);
//   const { aulasFiltradas, loading: loadingAula } = useFiltrarAulas(debouncedAula);
//   const { materiasFiltradas, loading: loadingMateria } = useFiltrarMaterias(debouncedMateria);

  return (
    <form>
      <SearchBar
        value={queryProfesor}
        onChange={setQueryProfesor}
        results={profesoresFiltrados}
        loading={loadingProfesor}
        placeholder="Buscar profesor..."
        keyExtractor={(p) => p.id}
        renderItem={(p) => p.nombre}
        onSelect={(p) => console.log("Profesor seleccionado:", p)}
      />

      

      {/* Igual para Materia */}
    </form>
  );
};