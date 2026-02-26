package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.models.enums.EstadoMateria;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record HorarioAsignacionResponseDTO (
     Long id,
     Long aulaId,
     Long profesorId,
     String nombreProfesor,
     LocalDate fechaInicio,
     LocalDate fechaFin,
     LocalTime horaInicio,
     LocalTime horaFin,
     Integer duracionMinutos,
     String tipoSesion,
     EstadoMateria estado,
     List<DayOfWeek> diasSemana
) {}
