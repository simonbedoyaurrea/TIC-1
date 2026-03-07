package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de SALIDA: lo que el backend devuelve al frontend o al panel admin.
 * Nunca exponemos la entidad directamente (buena práctica).
 */
@Data
@Builder
public class ReporteResponseDTO {

    private Long id;

    // Quién
    private Rol    rol;
    private String contacto;

    // Dónde
    private Integer numeroBloque;
    private String  nombreBloque;
    private String  salon;
    private String  piso;
    private boolean inhabilitado;

    // Qué
    private String   categoria;
    private String   subcategoria;
    private String   descripcion;
    private Urgencia urgencia;

    // Estado del reporte
    private EstadoReporte estado;
    private String        notaAdmin;

    // Archivos adjuntos (rutas)
    private List<String> evidencias;

    // Fechas
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDateTime fechaResolucion;
}
