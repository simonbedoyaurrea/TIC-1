import { Circle, UserPen } from "lucide-react";

function AulaCard({ aula }) {

  const disponible = aula.estado === "DISPONIBLE";

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 gap-2">

      <div className="w-full flex flex-row p-3 gap-2">

        <div className="bg-black w-11 flex justify-center items-center rounded">
          <span className="text-white">{aula.id}</span>
        </div>

        <h1>{aula.tipo}</h1>

      </div>

      <div className="bg-[#E0C4A3] w-full flex justify-center items-center gap-2 py-1">

        <Circle style={{ color: disponible ? "lightgreen" : "red" }} />

        <span>{aula.estado}</span>

      </div>

      <div className="w-full flex justify-between p-4">

        <div className="flex gap-3">
          <UserPen />
          <span>Capacidad</span>
        </div>

        <div className="flex gap-2">
          <span>{aula.capacidad}</span>
          <span className="text-gray-700">Est.</span>
        </div>

      </div>

    </div>
  );
}

export default AulaCard;