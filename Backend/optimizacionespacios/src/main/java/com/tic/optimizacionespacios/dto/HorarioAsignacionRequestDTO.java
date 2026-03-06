package com.tic.optimizacionespacios.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public List<DayOfWeek> getDiasSemana() {
        return diasSemana;
    }

    public String getTipoSesion() {
        return tipoSesion;
    }

    public String getOrigen() {
        return origen;
    }
}
