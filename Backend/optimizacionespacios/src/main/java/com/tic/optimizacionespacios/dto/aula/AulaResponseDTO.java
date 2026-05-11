package com.tic.optimizacionespacios.dto.aula;

import java.util.List;



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
