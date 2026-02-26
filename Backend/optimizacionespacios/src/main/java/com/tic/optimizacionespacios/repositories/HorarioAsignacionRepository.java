package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface HorarioAsignacionRepository extends JpaRepository<HorarioAsignacion, Long> {

    // Todos los horarios de un aula
    List<HorarioAsignacion> findByAulaId(Long aulaId);

    // Horarios de un aula en una fecha
    List<HorarioAsignacion> findByAulaIdAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
        Long aulaId,
        LocalDate fecha,
        LocalDate fecha2
    );

    // Validar conflicto de horario
    @Query("""
        SELECT h FROM HorarioAsignacion h
        WHERE h.aula.id = :aulaId
        AND :horaInicio < h.horaFin
        AND :horaFin > h.horaInicio
        AND :fecha BETWEEN h.fechaInicio AND h.fechaFin
    """)
    List<HorarioAsignacion> findConflictosHorario(
            @Param("aulaId") Long aulaId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("""
        SELECT COUNT(h) > 0
        FROM HorarioAsignacion h
        JOIN h.dias d
        WHERE h.aula.id = :aulaId
          AND d.diaSemana = :dia
          AND :horaInicio < h.horaFin
          AND :horaFin > h.horaInicio
          AND :fechaInicio <= h.fechaFin
          AND :fechaFin >= h.fechaInicio
          AND h.estado <> 'CANCELADO'
    """)
    boolean existeConflictoAula(
            @Param("aulaId") Long aulaId,
            @Param("dia") DayOfWeek dia,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin
    );

    @Query("""
        SELECT COUNT(h) > 0
        FROM HorarioAsignacion h
        JOIN h.dias d
        WHERE h.profesor.id = :profesorId
          AND d.diaSemana = :dia
          AND :horaInicio < h.horaFin
          AND :horaFin > h.horaInicio
          AND :fechaInicio <= h.fechaFin
          AND :fechaFin >= h.fechaInicio
          AND h.estado <> 'CANCELADO'
    """)
    boolean existeConflictoProfesor(
            @Param("profesorId") Long profesorId,
            @Param("dia") DayOfWeek dia,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin
    );

}
