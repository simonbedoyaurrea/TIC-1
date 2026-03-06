package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.models.entities.Ubicacion;

import java.util.List;
import java.util.Set;

public record AulaResponseDTO(
        Long id,
        Integer capacidad,
        String tipo,
        String estado,
        Ubicacion ubicacion,
        List<Long> recursos
) {}
