package com.tic.optimizacionespacios.dto;

import java.util.List;

public record UbicacionResponseDTO(
        Long id,
        Integer bloque,
        String nombre,
        Integer pisos,
        List<Long>aulas
) {
}
