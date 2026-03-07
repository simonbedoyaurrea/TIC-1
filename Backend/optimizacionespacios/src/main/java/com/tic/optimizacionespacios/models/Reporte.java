package com.tic.optimizacionespacios.models;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reportes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reporte {

    // ── Identificador ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Quién reporta ──────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    // Correo opcional para notificar al reportante
    @Column(length = 150)
    private String contacto;

    // ── Dónde está el daño ─────────────────────────────────────
    @Column(name = "numero_bloque", nullable = false)
    private Integer numeroBloque;

    // El nombre del bloque lo resuelve el backend (no lo manda el frontend)
    @Column(name = "nombre_bloque", length = 200)
    private String nombreBloque;

    @Column(name = "salon", nullable = false, length = 100)
    private String salon;

    @Column(name = "piso", length = 50)
    private String piso;

    // Si el espacio ya no se puede usar por este daño
    @Column(name = "inhabilitado", nullable = false)
    private boolean inhabilitado;

    // ── Qué daño es ────────────────────────────────────────────
    @Column(name = "categoria", nullable = false, length = 100)
    private String categoria;

    @Column(name = "subcategoria", nullable = false, length = 150)
    private String subcategoria;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Urgencia urgencia;

    // ── Gestión del reporte (admin) ────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoReporte estado = EstadoReporte.PENDIENTE;

    // Nota interna del técnico o administrativo
    @Column(name = "nota_admin", columnDefinition = "TEXT")
    private String notaAdmin;

    // ── Archivos de evidencia ──────────────────────────────────
    // Se guardan como rutas relativas en el servidor
    @ElementCollection
    @CollectionTable(
            name = "reporte_evidencias",
            joinColumns = @JoinColumn(name = "reporte_id")
    )
    @Column(name = "ruta_archivo")
    @Builder.Default
    private List<String> evidencias = new ArrayList<>();

    // ── Fechas automáticas ─────────────────────────────────────
    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Se llena automáticamente cuando el estado pasa a RESUELTO
    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;
}
