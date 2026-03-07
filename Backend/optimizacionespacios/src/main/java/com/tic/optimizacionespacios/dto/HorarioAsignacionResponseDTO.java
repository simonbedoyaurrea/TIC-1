package com.tic.optimizacionespacios.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.tic.optimizacionespacios.enums.EstadoMateria;

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
