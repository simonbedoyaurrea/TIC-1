package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.DiaHorario;
import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;
import com.tic.optimizacionespacios.models.enums.EstadoMateria;
import com.tic.optimizacionespacios.repositories.AulaRepository;
import com.tic.optimizacionespacios.repositories.HorarioAsignacionRepository;
import com.tic.optimizacionespacios.repositories.ProfesorRepository;
import com.tic.optimizacionespacios.services.interfaces.HorarioAsignacionService;
import com.tic.optimizacionespacios.services.interfaces.ProfesorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@Transactional
public class HorarioAsignacionServiceImpl implements HorarioAsignacionService {
    private final HorarioAsignacionRepository horarioRepo;
    private final ProfesorRepository profesorRepo;
    private final ProfesorService profesorService;
    private final AulaRepository aulaRepo;

    //Inyeccion dependencias
    public HorarioAsignacionServiceImpl(
            HorarioAsignacionRepository horarioRepo,
            ProfesorRepository profesorRepo,
            ProfesorService profesorService,
            AulaRepository aulaRepo
    ) {
        this.horarioRepo = horarioRepo;
        this.profesorRepo = profesorRepo;
        this.profesorService = profesorService;
        this.aulaRepo = aulaRepo;
    }

    @Override
    public HorarioAsignacion crearHorario(HorarioAsignacion horario) {

        validarAula(horario);
        validarConflictos(horario);

        horario.setEstado(EstadoMateria.PROPUESTO);

        return horarioRepo.save(horario);
    }

    //Cambiar estado a Validado
    @Override
    public HorarioAsignacion validarHorario(Long horarioId) {
        HorarioAsignacion horario = obtenerHorario(horarioId);
        horario.setEstado(EstadoMateria.VALIDADO);
        return horarioRepo.save(horario);
    }

    //Cambiar estado a Aprobado
    @Override
    public HorarioAsignacion aprobarHorario(Long horarioId) {
        HorarioAsignacion horario = obtenerHorario(horarioId);

        if (!"VALIDADO".equals(horario.getEstado())) {
            throw new IllegalStateException("El horario debe estar VALIDADO para aprobarse");
        }

        horario.setEstado(EstadoMateria.APROBADO);
        return horarioRepo.save(horario);
    }

    // Cambiar estado a Cancelado
    @Override
    public void cancelarHorario(Long horarioId) {
        HorarioAsignacion horario = obtenerHorario(horarioId);
        horario.setEstado(EstadoMateria.CANCELADO);
        horarioRepo.save(horario);
    }


    @Override
    public boolean existeConflictoAula(
            Long aulaId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ){
        return horarioRepo.existeConflictoAula(aulaId, dia, horaInicio, horaFin, fechaInicio, fechaFin);
    }

    @Override
    public boolean existeConflictoProfesor(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ) {
        return horarioRepo.existeConflictoProfesor(
                profesorId, dia, horaInicio, horaFin, fechaInicio, fechaFin
        );
    }


    // ===============================
    // MÉTODOS PRIVADOS (LIMPIEZA)
    // ===============================
    private HorarioAsignacion obtenerHorario(Long id) {
        return horarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
    }


    private void validarAula(HorarioAsignacion horario) {
        aulaRepo.findById(horario.getAula().getId())
                .orElseThrow(() -> new RuntimeException("Aula no existe"));
    }

    private void validarConflictos(HorarioAsignacion horario) {
        for (DiaHorario dia : horario.getDias()) {

            if (existeConflictoAula(
                    horario.getAula().getId(),
                    dia.getDiaSemana(),
                    horario.getHoraInicio(),
                    horario.getHoraFin(),
                    horario.getFechaInicio(),
                    horario.getFechaFin()
            )) {
                throw new RuntimeException("Conflicto de aula en " + dia.getDiaSemana());
            }

            if (existeConflictoProfesor(
                    horario.getProfesor().getId(),
                    dia.getDiaSemana(),
                    horario.getHoraInicio(),
                    horario.getHoraFin(),
                    horario.getFechaInicio(),
                    horario.getFechaFin()
            )) {
                throw new RuntimeException("Conflicto de profesor en " + dia.getDiaSemana());
            }

            boolean disponible = profesorService.estaDisponible(
                    horario.getProfesor().getId(),
                    dia.getDiaSemana(),
                    horario.getHoraInicio(),
                    horario.getHoraFin()
            );

            if (!disponible) {
                throw new RuntimeException(
                        "El profesor no está disponible el " + dia.getDiaSemana()
                );
            }
        }
    }
}
