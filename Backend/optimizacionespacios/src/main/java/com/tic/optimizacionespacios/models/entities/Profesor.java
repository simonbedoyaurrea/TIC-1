package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

import com.tic.optimizacionespacios.enums.TipoProfesor;

@Entity
@Data
@Table(name = "profesores")
public class Profesor {
    @Id
    private Long id;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(nullable = false, unique = true)
    private String emailInstitucional;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoProfesor tipoProfesor;

    @ManyToMany
    @JoinTable(
            name = "profesor_materia",
            joinColumns = @JoinColumn(name = "profesor_id"),
            inverseJoinColumns = @JoinColumn(name = "materia_id")
    )
    private List<Materia> materias;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(length = 500)
    private String observaciones;

    //CUIDADO, puede hacer un json ciclico, necesita DTO
    @OneToMany(mappedBy = "profesor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DisponibilidadProfesor> disponibilidades;

}
