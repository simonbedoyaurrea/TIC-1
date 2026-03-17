import { Circle, UserPen, ClipboardList } from "lucide-react";

function HorarioModal({ horario }) {
  const disponible = aula.estado === "DISPONIBLE";

  return (
    <div>
      <header>
        <div>
          <span>Logica de programacion</span>
          <span>Bloq 11 202</span>
        </div>
        <hr />
      </header>
      <form onSubmit={() => console.log("Se a hecho submmit")}>
        <div>
          <span>Profesor</span>
          <div>
            <Circle />
            <div></div>
          </div>
        </div>
        <label>
          Profesor
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Tu mensaje aquí..."
          />
        </label>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </form>
    </div>
  );
}

export default AulaCard;
