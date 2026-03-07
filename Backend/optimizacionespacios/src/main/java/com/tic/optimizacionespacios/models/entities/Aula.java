package com.tic.optimizacionespacios.models.entities;


import java.util.Set;

import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.enums.TipoAula;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


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