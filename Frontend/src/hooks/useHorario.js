import { useState, useMemo } from "react";
import { horarioService } from "../services/HorarioService";
import { horariosToEvents } from "../utils/horarioMapper";

export const useHorario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [eventos, setEventos] = useState([]);
  const [rawHorarios, setRawHorarios] = useState([]);

  // const obtenerPorId = async (id) => {
  //   setHorario([]);
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const data = await horarioService.obtenerPorId(id);
  //     setHorario(data);
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       setError(err.message);
  //     } else {
  //       setError("Error desconocido al intentar obtener un horario por ID");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const obtenerHorariosAula = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await horarioService.obtenerHorariosAula(id);
      console.log("RAW RESPONSE:", response);
      console.log("IS ARRAY?", Array.isArray(response));
      setRawHorarios(response || []);
      setEventos(horariosToEvents(response));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al intentar obtener un horario por ID");
      }
    } finally {
      setLoading(false);
    }
  };

  return { eventos, rawHorarios, loading, error, obtenerHorariosAula };
};
