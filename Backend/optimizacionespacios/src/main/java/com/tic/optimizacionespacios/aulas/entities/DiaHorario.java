package com.tic.optimizacionespacios.aulas.entities;

import jakarta.persistence.*;

import java.time.DayOfWeek;

@Entity
@Table(name = "dias_horario")
public class DiaHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horario_id", nullable = false)
    private HorarioAsignacion horarioAsignacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek diaSemana;

}
