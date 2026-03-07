package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Data
@Table(name = "materia")
public class Materia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @ManyToMany
    @JoinTable(
            name = "materia_recursos",
            joinColumns = @JoinColumn(name = "materia_id"),
            inverseJoinColumns = @JoinColumn(name = "recurso_id")
    )
    private Set<Recurso> recursosNecesarios;

    private String codigo; // opcional (ej: INF101)

    private Integer creditos;

    private Boolean activo;
}
