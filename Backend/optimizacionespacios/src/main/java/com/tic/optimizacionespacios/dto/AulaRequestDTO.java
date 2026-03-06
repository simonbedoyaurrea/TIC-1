package com.tic.optimizacionespacios.dto;

public class AulaRequestDTO {
    private Integer capacidad;
    private String tipo;   // AULA | LABORATORIO
    private String estado; // DISPONIBLE | MANTENIMIENTO | NO_DISPONIBLE

    public Integer getCapacidad() {
        return capacidad;
    }

    public String getTipo() {
        return tipo;
    }

    public String getEstado() {
        return estado;
    }

}
