package com.tic.optimizacionespacios.dto;

import java.util.List;

public record MateriaResponseDTO(
    Long id,
    String nombre,
    List<RecursoResponseDTO> recursosNecesarios,
    Integer creditos

) {}
