package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para que el administrador cambie el estado de un reporte.
 * Ejemplo de body:
 * {
 *   "estado": "EN_PROCESO",
 *   "notaAdmin": "Técnico asignado, visita programada para el martes"
 * }
 */
@Data
public class ActualizarEstadoDTO {

    @NotNull(message = "El estado es obligatorio")
    private EstadoReporte estado;

    // Nota interna opcional del técnico o administrador
    private String notaAdmin;
}
