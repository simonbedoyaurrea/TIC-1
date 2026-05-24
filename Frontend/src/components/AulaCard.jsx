import {
  Circle,
  UserPen,
  ClipboardList,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function AulaCard({ aula }) {
  const disponible =
    aula.estado === "DISPONIBLE";

  const navigate = useNavigate();

  const handleClick = (id) => {
    console.log("CLICK REAL", aula.id);
    navigate(`/aula/${id}`);
  };

  return (
    <div
      className="
        group
        rounded-2xl
        overflow-hidden
        border
        border-[var(--border-subtle)]
        bg-[var(--bg-card)]/90
        backdrop-blur-xl
        shadow-xl
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:border-[var(--accent-yellow)]
        hover:shadow-2xl
        hover:shadow-black/20
        cursor-pointer
        text-[var(--text-primary)]
      "
      onClick={() => handleClick(aula.id)}
    >
      {/* ═══════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════ */}

      <div
        className="
          w-full
          flex
          items-center
          gap-3
          p-4
          border-b
          border-[var(--border-subtle)]
        "
      >
        {/* ROOM ID */}
        <div
          className="
            min-w-12
            h-10
            px-2
            rounded-lg
            flex
            items-center
            justify-center
            font-black
            text-sm
            bg-[var(--accent-red)]
            text-white
            shadow-md
          "
        >
          {aula.piso}
          {aula.id < 10
            ? "0" + aula.id
            : aula.id}
        </div>

        {/* TYPE */}
        <h1
          className="
            font-bold
            tracking-wide
            uppercase
            text-[var(--text-primary)]
            group-hover:text-[var(--accent-yellow)]
            transition-colors
          "
        >
          {aula.tipo}
        </h1>
      </div>

      {/* ═══════════════════════════════ */}
      {/* STATUS */}
      {/* ═══════════════════════════════ */}

      <div
        className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          border-b
          border-[var(--border-subtle)]
          bg-[var(--accent-yellow-dim)]
        "
      >
        <Circle
          size={16}
          fill={
            disponible
              ? "#4ade80"
              : "#ef4444"
          }
          color={
            disponible
              ? "#4ade80"
              : "#ef4444"
          }
        />

        <span
          className="
            font-semibold
            tracking-wide
            text-sm
          "
        >
          {aula.estado}
        </span>
      </div>

      {/* ═══════════════════════════════ */}
      {/* CAPACITY */}
      {/* ═══════════════════════════════ */}

      <div
        className="
          w-full
          flex
          justify-between
          items-center
          px-4
          py-4
          border-b
          border-[var(--border-subtle)]
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-[var(--text-secondary)]
          "
        >
          <UserPen size={18} />

          <span className="font-medium">
            Capacidad
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            font-semibold
          "
        >
          <span>{aula.capacidad}</span>

          <span
            className="
              text-[var(--text-secondary)]
            "
          >
            Est.
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════ */}
      {/* RESOURCES */}
      {/* ═══════════════════════════════ */}

      <div
        className="
          w-full
          flex
          justify-between
          items-start
          gap-4
          px-4
          py-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-[var(--text-secondary)]
          "
        >
          <ClipboardList size={18} />

          <span className="font-medium">
            Recursos
          </span>
        </div>

        <div
          className="
            flex
            flex-wrap
            justify-end
            gap-2
          "
        >
          {aula.recursos.map(
            (recurso) => (
              <span
                key={recurso.id}
                className="
                  px-2
                  py-1
                  rounded-md
                  text-xs
                  font-semibold
                  bg-[var(--bg-secondary)]
                  border
                  border-[var(--border-subtle)]
                  text-[var(--text-secondary)]
                "
              >
                {recurso.nombre}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AulaCard;