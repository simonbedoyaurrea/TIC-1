package com.tic.optimizacionespacios.dto;

public class UbicacionRequestDTO {
    private Long id;
    private int bloque;
    private int piso;

    public UbicacionRequestDTO(){}

    public Long getId() {
        return id;
    }

    public int getBloque() {
        return bloque;
    }

    public int getPiso() {
        return piso;
    }
}
