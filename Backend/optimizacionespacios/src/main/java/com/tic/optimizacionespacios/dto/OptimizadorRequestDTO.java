package com.tic.optimizacionespacios.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class OptimizadorRequestDTO {
    private NuevaMateriaDTO materia;

    private Map<Integer, List<List<Integer>>> disponibilidad;
}
