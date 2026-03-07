package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.DayOfWeek;

@Entity
@Data
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
