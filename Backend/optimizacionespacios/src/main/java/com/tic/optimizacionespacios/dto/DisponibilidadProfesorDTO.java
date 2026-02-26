package com.tic.optimizacionespacios.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class DisponibilidadProfesorDTO {
    private DayOfWeek diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = diaSemana;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
}
