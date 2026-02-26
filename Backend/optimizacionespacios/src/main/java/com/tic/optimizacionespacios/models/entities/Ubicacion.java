package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ubicaciones")
public class Ubicacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int bloque;

    @Column(nullable = false)
    private int piso;

    //Sirve para que los estudiantes y docentes se ubiquen mas facilmente
    //Ejemplo: cerca de la biblioteca, frente a los ascensores etc
    @Column(length = 255)
    private String referencia;

    //latitud y longitud son datos opcionales que ayudan a crear el mapa dinamico
    //Si se busca hacer que los salones esten lo mas pegado posibles
    private double latitud;

    private double longitud;

}
