package com.tic.optimizacionespacios.dto.aula;

import java.util.List;

import lombok.Data;

@Data
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
