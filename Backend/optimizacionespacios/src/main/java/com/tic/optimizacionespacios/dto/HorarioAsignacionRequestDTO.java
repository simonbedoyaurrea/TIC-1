package com.tic.optimizacionespacios.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class HorarioAsignacionRequestDTO {

    private Long aulaId;
    private Long profesorId;
    private Long materiaId;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    private LocalTime horaInicio;
    private LocalTime horaFin;

    private Integer duracionMinutos;

    private String tipoSesion;

    private List<DayOfWeek> diasSemana;

    private String origen; // MANUAL | OPTIMIZADOR

    
}
