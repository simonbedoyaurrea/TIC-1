package com.tic.optimizacionespacios.dto;

public record RecursoResponseDTO(
        Long id,
        String nombre,
        String descripcion,
        Boolean activo
){}
