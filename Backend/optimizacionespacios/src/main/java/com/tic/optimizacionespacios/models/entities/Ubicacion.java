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


}
