package com.tic.optimizacionespacios.dto.profesor;

import java.util.List;

public record ProfesorResponseDTO(
        Long id,
        String nombre,
        String email,
        String tipo,
        Boolean activo,
        List<Long> materias
) {}
