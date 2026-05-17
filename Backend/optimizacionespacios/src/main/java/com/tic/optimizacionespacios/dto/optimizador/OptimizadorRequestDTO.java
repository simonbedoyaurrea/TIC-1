package com.tic.optimizacionespacios.dto.optimizador;

import java.util.List;
import java.util.Map;

import com.tic.optimizacionespacios.dto.materia.NuevaMateriaDTO;

import lombok.Data;

@Data
public class OptimizadorRequestDTO {
    private NuevaMateriaDTO materia;

    private Map<Integer, List<List<Integer>>> disponibilidad;
}
