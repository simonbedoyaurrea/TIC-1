package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.models.entities.Recurso;

import java.util.Set;

public class MateriaRequestDTO{
    private String nombre;
    private Set<Long> recursosNecesarios;
    private String codigo;
    private Integer creditos;

    public String getNombre() {
        return nombre;
    }

    public Set<Long> getRecursosNecesarios() {
        return recursosNecesarios;
    }

    public Integer getCreditos() {
        return creditos;
    }

    public String getCodigo() {
        return codigo;
    }
}
