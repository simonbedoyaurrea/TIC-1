package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.repositories.HorarioAsignacionRepository;
import com.tic.optimizacionespacios.repositories.ProfesorRepository;
import com.tic.optimizacionespacios.services.interfaces.DisponibilidadProfesorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@Transactional
public class DisponibilidadProfesorServiceImpl implements DisponibilidadProfesorService {
    private final ProfesorRepository profesorRepo;
    private final HorarioAsignacionRepository horarioRepo;

    public DisponibilidadProfesorServiceImpl(
            ProfesorRepository profesorRepo,
            HorarioAsignacionRepository horarioRepo
    ) {
        this.profesorRepo = profesorRepo;
        this.horarioRepo = horarioRepo;
    }

    @Override
    public boolean profesorDisponible(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ) {

        Profesor profesor = profesorRepo.findById(profesorId)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

        //Validar disponibilidad declarada del profesor
        boolean disponiblePorAgenda = profesor.getDisponibilidades().stream()
                .anyMatch(d ->
                        d.getDiaSemana().equals(dia) &&
                                !horaInicio.isBefore(d.getHoraInicio()) &&
                                !horaFin.isAfter(d.getHoraFin())
                );

        if (!disponiblePorAgenda) {
            return false;
        }

        //Validar conflictos con horarios ya asignados
        boolean conflicto = horarioRepo.existeConflictoProfesor(
                profesorId,
                dia,
                horaInicio,
                horaFin,
                fechaInicio,
                fechaFin
        );

        return !conflicto;
    }

}
