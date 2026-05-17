package com.tic.optimizacionespacios.dto.materia;

import java.util.Set;

import lombok.Data;

@Data
public class MateriaRequestDTO{
    private String nombre;
    private Set<Long> recursosNecesarios;
    private String codigo;
    private Integer creditos;

   
}
