package com.tic.optimizacionespacios.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

import lombok.Data;

@Data
public class DisponibilidadProfesorDTO {
    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

  
}
