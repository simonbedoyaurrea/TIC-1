package com.tic.optimizacionespacios.models.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@Table(name = "ubicaciones")
public class Ubicacion {

    public Ubicacion(int bloque, String nombre, int pisos, String referencia) {
        this.bloque = bloque;
        this.nombre = nombre;
        this.pisos = pisos;
        this.referencia = referencia;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int bloque;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private int pisos;

    @OneToMany(mappedBy = "ubicacion")
    private List<Aula> aulas;

    //Sirve para que los estudiantes y docentes se ubiquen mas facilmente
    //Ejemplo: cerca de la biblioteca, frente a los ascensores etc
    @Column(length = 255)
    private String referencia;
}