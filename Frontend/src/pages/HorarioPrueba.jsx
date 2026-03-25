import {
  UserRound,
  BookMarked,
  Building2,
  CalendarDays,
  BookAlert,
} from "lucide-react";

import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFiltrarProfesores } from "../hooks/useFiltrarProfesores";
import { useFiltrarMaterias } from "../hooks/useFiltrarMaterias";
import { useFiltrarAulas } from "../hooks/useFiltrarAulas";

import { HorarioInput } from "../components/HorarioInput";
import { SearchBar } from "../components/SearchBar";
import { EstadoInput } from "../components/EstadoInput";

export const FormularioPage = () => {
  const [queryProfesor, setQueryProfesor] = useState("");
  const [queryMateria, setQueryMateria] = useState("");
  const [queryAula, setQueryAula] = useState("");
  const [estado, setEstado] = useState("");

  const debouncedProfesor = useDebounce(queryProfesor);
  const debouncedAula = useDebounce(queryAula);
  const debouncedMateria = useDebounce(queryMateria);

  const [horario, setHorario] = useState({
    dia: "",
    horaInicio: "",
    horaFin: "",
  });

  const { profesoresFiltrados, loading: loadingProfesor } =
    useFiltrarProfesores(debouncedProfesor);
  const { materiasFiltradas, loading: loadingMateria } =
    useFiltrarMaterias(debouncedMateria);
  const { aulasFiltradas, loading: loadingAula } =
    useFiltrarAulas(debouncedAula);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg justify-center">
      <header className="bg-[#1E1E1E] w-full flex flex-col justify-center gap-2 p-2">
        <div className="flex justify-between gap-2 py-2">
          <span className="text-white text-2xl font-bold">
            Logica Programacion
          </span>
          <span className="text-[#d2d2d2] text-2xl font-bold">Bloq 11 202</span>
        </div>

        <hr className="h-px w-auto border-white" />
      </header>
      <form action="" className="px-10 py-5">
        <div>
          <div className=" flex ">
            <span className="text-2xl ">Profesor</span>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
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
          <div className="flex flex-row justify-center items-center gap-2">
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
        <div>
          <div className=" flex ">
            <span className="text-2xl ">Aula</span>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <Building2 size={40} />

            <SearchBar
              value={queryAula}
              onChange={setQueryAula}
              results={aulasFiltradas}
              loading={loadingAula}
              placeholder="Buscar aula..."
              keyExtractor={(aula) => aula.id}
              renderItem={(aula) => {
                const numeroSalon = `${aula.piso}${aula.numeroAula > 10 ? aula.numeroAula : "0" + aula.numeroAula}`;
                return `Bloque ${aula.ubicacion} ${numeroSalon}`;
              }}
              onSelect={(item) => {
                console.log("Aula seleccionada:", item);
                setQueryAula(item.numeroAula);
              }}
            />
          </div>
        </div>
        <div>
          <span className="text-2xl ">Horario</span>
          <div>
            <HorarioInput value={horario} onChange={setHorario} />
          </div>
          <pre className="mt-6 bg-gray-100 p-4 rounded">
            {JSON.stringify(horario, null, 2)}
          </pre>
        </div>
        <div>
          <span className="text-2xl ">Estado</span>
          <div className="flex flex-row justify-center items-center gap-2">
            <Building2 size={40} />
            <EstadoInput
              value={estado}
              onChange={(value) => setEstado(value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
