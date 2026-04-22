package com.tic.optimizacionespacios.models.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reportes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
