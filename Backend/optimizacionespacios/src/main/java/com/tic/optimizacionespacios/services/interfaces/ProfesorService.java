package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.DisponibilidadProfesor;
import com.tic.optimizacionespacios.models.entities.Profesor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface ProfesorService {
    Profesor crearProfesor(Profesor profesor);

    Profesor actualizarProfesor(Long id, Profesor profesor);

    Profesor obtenerProfesorPorId(Long id);

    List<Profesor> listarProfesores();

    void eliminarProfesor(Long id);


    void agregarDisponibilidad(
            Long profesorId,
            DisponibilidadProfesor disponibilidad
    );

    void eliminarDisponibilidad(
            Long profesorId,
            Long disponibilidadId
    );

    boolean estaDisponible(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin
    );
}
