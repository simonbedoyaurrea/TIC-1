package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.DisponibilidadProfesor;
import com.tic.optimizacionespacios.models.entities.Materia;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.repositories.DisponibilidadProfesorRepository;
import com.tic.optimizacionespacios.repositories.ProfesorRepository;
import com.tic.optimizacionespacios.services.interfaces.MateriaService;
import com.tic.optimizacionespacios.services.interfaces.ProfesorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.time.DayOfWeek;

@Service
@Transactional
public class ProfesorServiceImpl implements ProfesorService {
    private final ProfesorRepository profesorRepo;
    private final DisponibilidadProfesorRepository disponibilidadRepo;
    private final MateriaService materiaService;


    public ProfesorServiceImpl(
            ProfesorRepository profesorRepo,
            DisponibilidadProfesorRepository disponibilidadRepo,
            MateriaService materiaService
    ) {
        this.profesorRepo = profesorRepo;
        this.disponibilidadRepo = disponibilidadRepo;
        this.materiaService = materiaService;
    }

    @Override
    public Profesor crearProfesor(Profesor profesor) {
        return profesorRepo.save(profesor);
    }

    @Override
    public Profesor actualizarProfesor(Long id, Profesor profesor) {
        Profesor existente = obtenerProfesorPorId(id);

        existente.setNombreCompleto(profesor.getNombreCompleto());
        existente.setTipoProfesor(profesor.getTipoProfesor());
        existente.setEmailInstitucional(profesor.getEmailInstitucional());
        existente.setActivo(profesor.getActivo());

        return profesorRepo.save(existente);
    }

    @Override
    public Profesor obtenerProfesorPorId(Long id) {
        return profesorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
    }

    @Override
    public List<Profesor> listarProfesores() {
        return profesorRepo.findAll();
    }

    @Override
    public void agregarMateria(Long idProfesor, Long idMateria){
        Profesor profesor = obtenerProfesorPorId(idProfesor);
        Materia materia = materiaService.obtenerMateria(idMateria);

        profesor.getMaterias().add(materia);
        profesorRepo.save(profesor);
    }

    @Override
    public void eliminarMateria(Long idProfesor, Long idMateria){
        Profesor profesor = obtenerProfesorPorId(idProfesor);
        Materia materia = materiaService.obtenerMateria(idMateria);

        profesor.getMaterias().remove(materia);
        profesorRepo.save(profesor);
    }


    @Override
    public void eliminarProfesor(Long id) {
        Profesor profesor = obtenerProfesorPorId(id);
        profesor.setActivo(false); // borrado lógico
        profesorRepo.save(profesor);
    }

    @Override
    public void agregarDisponibilidad(
            Long profesorId,
            DisponibilidadProfesor disponibilidad
    ) {
        Profesor profesor = obtenerProfesorPorId(profesorId);

        disponibilidad.setProfesor(profesor);

        // Validar solapamiento de disponibilidad
        validarConflictoDisponibilidad(profesor, disponibilidad);

        disponibilidadRepo.save(disponibilidad);
    }

    @Override
    public void eliminarDisponibilidad(
            Long profesorId,
            Long disponibilidadId
    ) {
        Profesor profesor = obtenerProfesorPorId(profesorId);

        DisponibilidadProfesor disp = disponibilidadRepo.findById(disponibilidadId)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));

        if (!disp.getProfesor().getId().equals(profesor.getId())) {
            throw new RuntimeException("La disponibilidad no pertenece al profesor");
        }

        disponibilidadRepo.delete(disp);
    }

    @Override
    public boolean estaDisponible(
            Long profesorId,
            DayOfWeek dia,
            LocalTime horaInicio,
            LocalTime horaFin
    ) {
        return disponibilidadRepo.existeDisponibilidad(
                profesorId, dia, horaInicio, horaFin
        );
    }

    // ===============================
    // MÉTODOS PRIVADOS
    // ===============================
    private void validarConflictoDisponibilidad(
            Profesor profesor,
            DisponibilidadProfesor nueva
    ) {
        boolean existeConflicto =
                disponibilidadRepo.existeConflictoDisponibilidad(
                        profesor.getId(),
                        nueva.getDiaSemana(),
                        nueva.getHoraInicio(),
                        nueva.getHoraFin()
                );

        if (existeConflicto) {
            throw new RuntimeException("La disponibilidad se cruza con otra existente");
        }
    }
}
