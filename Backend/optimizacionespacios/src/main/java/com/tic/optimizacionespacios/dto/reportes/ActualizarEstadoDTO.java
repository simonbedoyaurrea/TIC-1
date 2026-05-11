package com.tic.optimizacionespacios.dto.reportes;

import com.tic.optimizacionespacios.enums.EstadoReporte;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ActualizarEstadoDTO {

    @NotNull(message = "El estado es obligatorio")
    private EstadoReporte estado;

    // Nota interna opcional del técnico o administrador
    private String notaAdmin;
}
