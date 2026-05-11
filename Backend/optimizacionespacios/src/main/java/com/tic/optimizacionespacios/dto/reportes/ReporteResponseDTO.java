package com.tic.optimizacionespacios.dto.reportes;

import java.time.LocalDateTime;
import java.util.List;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;

import lombok.Builder;
import lombok.Data;


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
