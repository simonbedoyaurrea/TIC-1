package com.tic.optimizacionespacios.dto;

import java.util.List;

public class UbicacionRequestDTO {
    private int bloque;
    private String nombre;
    private int pisos;
    private List<Long> aulas;

    public UbicacionRequestDTO(){}

    public int getBloque() {
        return bloque;
    }

    public String getNombre() {
        return nombre;
    }

    public int getPisos() {
        return pisos;
    }

    public List<Long> getAulas() {
        return aulas;
    }
}
