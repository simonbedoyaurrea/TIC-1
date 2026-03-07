package com.tic.optimizacionespacios.dto;

import java.util.List;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

public record AulaResponseDTO(
        Long id,
        Integer capacidad,
        String tipo,
        String estado,
        Ubicacion ubicacion,
        List<Long> recursos
) {}
