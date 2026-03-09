import bloque11 from "/bloque11.jpg";
import { useState } from "react";
import { useParams } from "react-router-dom";


import { useAulasPorPiso } from "../hooks/useAulasPorPiso";
import { useBloquePorId } from "../hooks/useBloquePorId"; 

import AulaCard from "../components/AulaCard";
import PisoButton from "../components/PisoButton";


const Bloque = () => {

	const { idBloque } = useParams();

  const [pisoSeleccionado, setPisoSeleccionado] = useState(1);

  const { bloque, loading: bloqueLoading } = useBloquePorId(idBloque);

  const { aulas, loading: aulasLoading } =
    useAulasPorPiso(idBloque, pisoSeleccionado);

  if (bloqueLoading || aulasLoading) {
    return <div className="p-10 text-white">Cargando...</div>;
  }

  const pisos = Array.from({ length: bloque.pisos }, (_, i) => i + 1);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: `url(${bloque11})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      {/* ASIDE */}
      <aside className="relative z-10 bg-[#FFEBD1]/70 w-64 border-r p-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Bloque {bloque.bloque}
          </h1>

          <h2 className="text-[#262626] text-xl font-semibold">
            {bloque.nombre}
          </h2>
        </div>

        <h2 className="text-lg font-bold mb-4">Pisos</h2>

        <div className="flex flex-col gap-2">

          {pisos.map((piso) => (
            <PisoButton
              key={piso}
              piso={piso}
              activo={pisoSeleccionado === piso}
              onClick={setPisoSeleccionado}
            />
          ))}

        </div>
      </aside>

      {/* MAIN */}
      <section className="relative z-10 flex-1 p-6">

        <header className="mb-8 text-white">
          <h1 className="text-3xl font-bold">
            Aulas (Piso {pisoSeleccionado})
          </h1>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {aulas.map((aula) => (
            <AulaCard key={aula.id} aula={aula} />
          ))}

        </main>

      </section>
    </div>
  );
};

export default Bloque;