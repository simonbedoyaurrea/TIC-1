package com.tic.optimizacionespacios.dto.aula;

import java.util.List;

public record UbicacionResponseDTO(
        Long id,
        Integer bloque,
        String nombre,
        Integer pisos,
        List<Long>aulas
) {
}
