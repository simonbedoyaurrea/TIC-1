package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.repositories.AulaRepository;
import com.tic.optimizacionespacios.repositories.HorarioAsignacionRepository;
import com.tic.optimizacionespacios.services.interfaces.DisponibilidadAulaService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DisponibilidadAulaServiceImpl implements DisponibilidadAulaService {
    private final AulaRepository aulaRepo;
    private final HorarioAsignacionRepository horarioRepo;

    public DisponibilidadAulaServiceImpl(
            AulaRepository aulaRepo,
            HorarioAsignacionRepository horarioRepo
    ) {
        this.aulaRepo = aulaRepo;
        this.horarioRepo = horarioRepo;
    }

    @Override
    public List<Aula> obtenerAulasDisponibles(
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin,
            Integer capacidadMinima,
            Boolean requiereComputadores,
            Boolean requiereProyector
    ) {

        List<Aula> aulas = aulaRepo.findAll();

        return aulas.stream()
                .filter(aula -> cumpleRequisitos(aula,
                        capacidadMinima,
                        requiereComputadores,
                        requiereProyector))
                .filter(aula -> !existeConflicto(aula.getId(),
                        dia,
                        horaInicio,
                        horaFin,
                        fechaInicio,
                        fechaFin))
                .toList();
    }


    @Override
    public boolean aulaDisponible(
            Long aulaId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ){
        return !existeConflicto(aulaId, dia, horaInicio, horaFin, fechaInicio, fechaFin);
    }

    // MÉTODOS PRIVADOS
    private boolean cumpleRequisitos(
            Aula aula,
            Integer capacidadMinima,
            Boolean requiereComputadores,
            Boolean requiereProyector
    ) {

        if (capacidadMinima != null && aula.getCapacidadMaxima() < capacidadMinima) {
            return false;
        }

//        if (requiereComputadores != null &&
//                requiereComputadores &&
//                !aula.isTieneComputadores()) {
//            return false;
//        }

//        if (requiereProyector != null &&
//                requiereProyector &&
//                !aula.isTieneProyector()) {
//            return false;
//        }

        return true;
    }

    private boolean existeConflicto(
            Long aulaId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ) {
        return horarioRepo.existeConflictoAula(
                aulaId,
                dia,
                horaInicio,
                horaFin,
                fechaInicio,
                fechaFin
        );
    }


}
