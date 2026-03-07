package com.tic.optimizacionespacios.services.interfaces;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public interface DisponibilidadProfesorService {
    boolean profesorDisponible(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );
}
