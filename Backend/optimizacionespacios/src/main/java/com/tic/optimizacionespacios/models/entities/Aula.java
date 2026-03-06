package com.tic.optimizacionespacios.models.entities;


import com.tic.optimizacionespacios.models.enums.EstadoAula;
import com.tic.optimizacionespacios.models.enums.TipoAula;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;


//FALTA IMPLEMENTAR INVENTARIO AULA
@Entity
@Data
@Table(name = "aulas")
public class Aula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Se puede cambiar a numero de sillas
    @Column(nullable = false)
    private int capacidadMaxima;


    @ManyToOne
    @JoinColumn(name = "ubicacion_id", nullable = false)
    private Ubicacion ubicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAula tipoDeAula;

    @ManyToMany
    @JoinTable(
            name = "aula_recursos",
            joinColumns = @JoinColumn(name = "aula_id"),
            inverseJoinColumns = @JoinColumn(name = "recurso_id")
    )
    private Set<Recurso> recursos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAula estadoAula;

    private String observaciones;

    //Atributo para soft delete,
    //Si se necesita eliminar un aula solo la desabilita
    @Column(nullable = false)
    private Boolean activo;

}