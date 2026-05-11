package com.tic.optimizacionespacios.dto;

import java.util.List;

import com.tic.optimizacionespacios.dto.aula.RecursoResponseDTO;

public record MateriaResponseDTO(
    Long id,
    String nombre,
    List<RecursoResponseDTO> recursosNecesarios,
    Integer creditos

) {}
