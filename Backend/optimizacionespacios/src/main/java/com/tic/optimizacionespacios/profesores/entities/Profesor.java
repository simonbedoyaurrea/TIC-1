package com.tic.optimizacionespacios.profesores.entities;

import com.tic.optimizacionespacios.profesores.enums.TipoProfesor;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(length = 500)
    private String observaciones;

    //CUIDADO, puede hacer un json ciclico
    @OneToMany(mappedBy = "profesor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DisponibilidadProfesor> disponibilidades;

}
