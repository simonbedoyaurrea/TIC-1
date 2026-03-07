package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Aula;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DisponibilidadAulaService {
    List<Aula> obtenerAulasDisponibles(
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer capacidadMinima,
            Boolean requiereComputadores,
            Boolean requiereProyector
    );

    boolean aulaDisponible(
            Long aulaId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
            );
}
