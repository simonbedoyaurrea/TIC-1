package com.tic.optimizacionespacios.dto;

public class AulaRequestDTO {
    private Integer piso;
    private Integer numeroAula;
    private Integer capacidad;
    private String tipo;   // AULA | LABORATORIO
    private String estado; // DISPONIBLE | MANTENIMIENTO | NO_DISPONIBLE
    private Long idUbicacion;

    public Integer getCapacidad() {
        return capacidad;
    }

    public String getTipo() {
        return tipo;
    }

    public String getEstado() {
        return estado;
    }

    public Long getIdUbicacion(){
        return idUbicacion;
    }

    public Integer getPiso() {
        return piso;
    }

    public Integer getNumeroAula() {
        return numeroAula;
    }
}