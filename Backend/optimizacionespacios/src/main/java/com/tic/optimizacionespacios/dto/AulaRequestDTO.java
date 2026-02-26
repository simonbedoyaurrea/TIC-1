package com.tic.optimizacionespacios.dto;

public class AulaRequestDTO {
    private String nombre;
    private Integer capacidad;
    private String tipo;   // AULA | LABORATORIO
    private String estado; // DISPONIBLE | MANTENIMIENTO | NO_DISPONIBLE
    private Long ubicacionId;

    public String getNombre() {
        return nombre;
    }

    public Integer getCapacidad() {
        return capacidad;
    }

    public String getTipo() {
        return tipo;
    }

    public String getEstado() {
        return estado;
    }

    public Long getUbicacionId() {
        return ubicacionId;
    }
}
