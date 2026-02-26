package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "disponibilidad_profesor")
public class DisponibilidadProfesor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profesor_id", nullable = false)
    private Profesor profesor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek diaSemana;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(length = 255)
    private String observaciones;

}

