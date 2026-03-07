package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;
import com.tic.optimizacionespacios.models.entities.Materia;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface HorarioAsignacionService {
    HorarioAsignacion crearHorario(HorarioAsignacion horario);

    List<HorarioAsignacion> obtenerHorarios();

    HorarioAsignacion obtenerHorario(Long id);

    HorarioAsignacion actualizar(Long id, HorarioAsignacion horarioAsignacion);

    HorarioAsignacion cambiarAula(Long horarioId, Long aulaId);

    HorarioAsignacion cambiarProfesor(Long horarioId, Long profesorId);

    HorarioAsignacion cambiarFecha(Long horarioId, LocalDate fechaInicio, LocalDate fechaFin);

    HorarioAsignacion validarHorario(Long horarioId);

    HorarioAsignacion aprobarHorario(Long horarioId);

    void cancelarHorario(Long horarioId);

    boolean existeConflictoAula(
            Long aulaId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

    boolean existeConflictoProfesor(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );

}
