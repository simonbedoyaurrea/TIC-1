package com.tic.optimizacionespacios.dto;

import java.util.Set;

import lombok.Data;

@Data
public class ProfesorRequestDTO {
    private String nombre;
    private String email;
    private String tipo;
    private Set<Long> materiasIds;

   
}
