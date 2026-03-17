import {
  UserRound,
  BookMarked,
  Building2,
  CalendarDays,
  BookAlert,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFiltrarProfesores } from "../hooks/useFiltrarProfesores";
import { useFiltrarMaterias } from "../hooks/useFiltrarMaterias";

import { SearchBar } from "../components/SearchBar";

export const FormularioPage = () => {
  const [queryProfesor, setQueryProfesor] = useState("");
  const [queryAula, setQueryAula] = useState("");
  const [queryMateria, setQueryMateria] = useState("");

  const debouncedProfesor = useDebounce(queryProfesor);
  const debouncedAula = useDebounce(queryAula);
  const debouncedMateria = useDebounce(queryMateria);

  const { profesoresFiltrados, loading: loadingProfesor } = useFiltrarProfesores(debouncedProfesor);
  const { materiasFiltradas, loading: loadingMateria } = useFiltrarMaterias(debouncedMateria);
  //   const { aulasFiltradas, loading: loadingAula } = useFiltrarAulas(debouncedAula);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg justify-center">
      <header className="bg-[#1E1E1E] w-full flex justify-between gap-2 py-2">
        <span className="text-white text-2xl font-bold">
          Logica Programacion
        </span>
        <span className="text-[#d2d2d2] text-2xl font-bold">Bloq 11 202</span>
        <hr />
      </header>
      <form action="" className="px-10 py-5">
        <div>
          <div className=" flex ">
            <span className="text-2xl ">Profesor</span>
          </div>
          <div className="flex flex-row justify-center items-center">
            <UserRound size={40} />
            <SearchBar
              value={queryProfesor}
              onChange={setQueryProfesor}
              results={profesoresFiltrados}
              loading={loadingProfesor}
              placeholder="Buscar profesor..."
              keyExtractor={(p) => p.id}
              renderItem={(p) => p.nombre}
              onSelect={(item) => {
                console.log("Profesor seleccionado:", item);
                setQueryProfesor(item.nombre);
              }}
            />
          </div>
        </div>
        <div>
          <div className=" flex ">
            <span className="text-2xl ">Materia</span>
          </div>
          <div className="flex flex-row justify-center items-center">
            <BookMarked size={40} />
            <SearchBar
              value={queryMateria}
              onChange={setQueryMateria}
              results={materiasFiltradas}
              loading={loadingMateria}
              placeholder="Buscar materia..."
              keyExtractor={(m) => m.id}
              renderItem={(m) => m.nombre}
              onSelect={(item) => {
                console.log("Materia seleccionada:", item);
                setQueryMateria(item.nombre);
              }}
            />
          </div>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </form>
    </div>
  );
};
