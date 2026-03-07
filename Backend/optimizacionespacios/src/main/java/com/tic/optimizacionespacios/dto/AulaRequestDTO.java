package com.tic.optimizacionespacios.dto;
import java.util.List;

public class AulaRequestDTO {
    private Integer capacidad;
    private String tipo;   // AULA | LABORATORIO
    private String estado; // DISPONIBLE | MANTENIMIENTO | NO_DISPONIBLE
    private Long idUbicacion;
    private List<Long> recursoIds;  // NUEVO - IDs de recursos técnicos asignados al aula
    private String observaciones;   // NUEVO - Observaciones del aula

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

    public List<Long> getRecursoIds(){
        return recursoIds;
    
    }
    public String getObservaciones(){
        return observaciones; 
    }
}