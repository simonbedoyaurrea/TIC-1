package com.tic.optimizacionespacios.services.interfaces;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;

public interface HorarioAsignacionService {
    HorarioAsignacion crearHorario(HorarioAsignacion horario);

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
