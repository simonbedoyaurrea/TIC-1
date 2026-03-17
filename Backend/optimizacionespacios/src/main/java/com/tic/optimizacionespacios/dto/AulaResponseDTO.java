package com.tic.optimizacionespacios.dto;

import java.util.List;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

public record AulaResponseDTO(
        Long id,
        Integer piso,
        Integer numeroAula,
        Integer capacidad,
        String tipo,
        String estado,
        Long ubicacion,
        List<RecursoResponseDTO> recursos
) {}
