package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "materias_cargadas")
@Getter
@Setter
public class MateriaSimulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String termCod;
    private String nombre;
    private String subjectCourseCode;
    private int creditos;
    private String metodoAsistencia;
    private String modoCalificacion;
    private String curriculos;
    private int vacantes;
    private int crn;
}
