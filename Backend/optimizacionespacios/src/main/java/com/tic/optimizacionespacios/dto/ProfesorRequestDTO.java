package com.tic.optimizacionespacios.dto;

import java.util.Set;

public class ProfesorRequestDTO {
    private String nombre;
    private String email;
    private String tipo;
    private Set<Long> materiasIds;

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getTipo() {
        return tipo;
    }

    public Set<Long> getMateriasIds() {
        return materiasIds;
    }
}
