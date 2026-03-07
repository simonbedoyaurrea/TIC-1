package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.DisponibilidadProfesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Repository
public interface DisponibilidadProfesorRepository extends JpaRepository<DisponibilidadProfesor, Long> {
    // ¿Existe alguna disponibilidad que cubra el horario?
    @Query("""
        SELECT COUNT(d) > 0
        FROM DisponibilidadProfesor d
        WHERE d.profesor.id = :profesorId
          AND d.diaSemana = :dia
          AND :horaInicio >= d.horaInicio
          AND :horaFin <= d.horaFin
    """)
    boolean existeDisponibilidad(
            @Param("profesorId") Long profesorId,
            @Param("dia") DayOfWeek dia,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    // Evitar disponibilidades solapadas
    @Query("""
        SELECT COUNT(d) > 0
        FROM DisponibilidadProfesor d
        WHERE d.profesor.id = :profesorId
          AND d.diaSemana = :dia
          AND :horaInicio < d.horaFin
          AND :horaFin > d.horaInicio
    """)
    boolean existeConflictoDisponibilidad(
            @Param("profesorId") Long profesorId,
            @Param("dia") DayOfWeek dia,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );
}
