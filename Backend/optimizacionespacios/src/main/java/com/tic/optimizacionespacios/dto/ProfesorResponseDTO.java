package com.tic.optimizacionespacios.dto;

public record ProfesorResponseDTO(
        Long id,
        String nombre,
        String email,
        String tipo,
        boolean activo
) {}
