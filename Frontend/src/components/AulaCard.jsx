import { Circle, UserPen, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AulaCard({ aula }) {
  const disponible = aula.estado === "DISPONIBLE";
  const navigate = useNavigate();

  const handleClick = (id) => {
    console.log("CLICK REAL", aula.id);
    navigate(`/aula/${id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 gap-2 cursor-pointer"
      onClick={() => handleClick(aula.id)}
    >
      <div className="w-full flex flex-row p-3 gap-2">
        <div className="bg-black w-11 flex justify-center items-center rounded">
          <span className="text-white">
            {aula.piso}
            {aula.id < 10 ? "0" + aula.id : aula.id}
          </span>
        </div>

        <h1>{aula.tipo}</h1>
      </div>

      <div className="bg-[#E0C4A3] w-full flex justify-items-start items-center gap-2 p-2">
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
      <div className="w-full flex justify-between p-4">
        <div className="flex gap-3">
          <ClipboardList />
          <span>Recursos</span>
        </div>
        <div className="flex gap-3">
          {aula.recursos.map((recurso) => (
            <span key={recurso.id}>{recurso.nombre}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AulaCard;
