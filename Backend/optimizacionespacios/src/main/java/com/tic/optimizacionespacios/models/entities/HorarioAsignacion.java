package com.tic.optimizacionespacios.models.entities;

import com.tic.optimizacionespacios.models.enums.EstadoMateria;
import com.tic.optimizacionespacios.models.enums.TipoSesion;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Table(name = "horarios_asignacion")
public class HorarioAsignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int nrc;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @ManyToOne
    @JoinColumn(name = "aula_id", nullable = false)
    private Aula aula;

    @ManyToOne
    @JoinColumn(name = "profesor_id", nullable = false)
    private Profesor profesor;

    @Column(nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private LocalDate fechaFin;

    @OneToMany(
            mappedBy = "horarioAsignacion",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<DiaHorario> dias;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private Integer duracionMinutos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSesion tipoSesion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoMateria estado;


    //Dice de donde vien, si de Banner, o de algun administrativo
    @Column(nullable = false)
    private String origen;

}
