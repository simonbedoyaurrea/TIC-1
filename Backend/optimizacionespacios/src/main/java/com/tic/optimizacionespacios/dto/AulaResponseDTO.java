package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

public record AulaResponseDTO(
        Long id,
        Integer capacidad,
        String tipo,
        String estado,
        Ubicacion ubicacion
) {}
