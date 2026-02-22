package com.tic.optimizacionespacios.models;


import com.tic.optimizacionespacios.models.enums.EstadoAula;
import com.tic.optimizacionespacios.models.enums.TipoAula;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "aulas")
public class Aula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Se puede cambiar a numero de sillas
    @Column(nullable = false)
    private int capacidad_maxima;

    @ManyToOne
    @JoinColumn(name = "ubicacion_id", nullable = false)
    private Ubicacion ubicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAula tipoDeAula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAula estadoAula;

    private String observaciones;

    //Atributo para soft delete,
    //Si se necesita eliminar un aula solo la desabilita
    @Column(nullable = false)
    private Boolean activo;

}