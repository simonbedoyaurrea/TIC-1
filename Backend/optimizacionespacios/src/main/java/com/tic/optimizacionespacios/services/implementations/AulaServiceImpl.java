package com.tic.optimizacionespacios.services.implementations;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.repositories.AulaRepository;
import com.tic.optimizacionespacios.services.interfaces.AulaService;
import com.tic.optimizacionespacios.services.interfaces.RecursoService;
import com.tic.optimizacionespacios.services.interfaces.UbicacionService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AulaServiceImpl implements AulaService {

    private final AulaRepository aulaRepo;
    private final UbicacionService ubicacionService;
    private final RecursoService recursoService;

    public AulaServiceImpl(
            AulaRepository aulaRepo,
            UbicacionService ubicacionService,
            RecursoService recursoService
    ) {
        this.aulaRepo = aulaRepo;
        this.ubicacionService = ubicacionService;
        this.recursoService = recursoService;
    }

    // ─── CREAR ───────────────────────────────────────────────────────────────
    @Override
    public Aula crear(Aula aula, List<Long> recursoIds) {

        // Validar que la ubicación exista
        Ubicacion ubicacion = ubicacionService.obtenerPorId(
                aula.getUbicacion().getId()
        );

        aula.setUbicacion(ubicacion);

        // Asignar recursos técnicos si se enviaron
        if (recursoIds != null && !recursoIds.isEmpty()) {
            Set<Recurso> recursos = resolverRecursos(recursoIds);
            aula.setRecursos(recursos);
        } else {
            aula.setRecursos(new HashSet<>());
        }

        return aulaRepo.save(aula);
    }

    // ─── ACTUALIZAR ──────────────────────────────────────────────────────────
    @Override
    public Aula actualizar(Long id, Aula aula, List<Long> recursoIds) {

        Aula existente = obtenerPorId(id);

        existente.setCapacidadMaxima(aula.getCapacidadMaxima());
        existente.setTipoDeAula(aula.getTipoDeAula());
        existente.setEstadoAula(aula.getEstadoAula());
        existente.setObservaciones(aula.getObservaciones());

        // Actualizar ubicación si cambió
        if (aula.getUbicacion() != null) {
            Ubicacion ubicacion = ubicacionService.obtenerPorId(
                    aula.getUbicacion().getId()
            );
            existente.setUbicacion(ubicacion);
        }

        // Reemplazar set de recursos con los nuevos
        if (recursoIds != null) {
            Set<Recurso> recursos = resolverRecursos(recursoIds);
            existente.setRecursos(recursos);
        }

        return aulaRepo.save(existente);
    }

    // ─── ACTUALIZAR SOLO EL ESTADO ────────────────────────────────────────────
    @Override
    public void actualizarEstado(Long id, String estado) {
        Aula aula = obtenerPorId(id);
        aula.setEstadoAula(EstadoAula.valueOf(estado));
        aulaRepo.save(aula);
    }

    // ─── OBTENER POR ID ──────────────────────────────────────────────────────
    @Override
    public Aula obtenerPorId(Long id) {
        return aulaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Aula no encontrada con ID: " + id));
    }

    // ─── LISTAR (solo activas) ───────────────────────────────────────────────
    @Override
    public List<Aula> listar() {
        return aulaRepo.findByActivoTrue();
    }

    // ─── AGREGAR RECURSO INDIVIDUAL ──────────────────────────────────────────
    @Override
    public void agregarRecurso(Long aulaId, Long recursoId) {
        Aula aula = obtenerPorId(aulaId);
        Recurso recurso = recursoService.obtenerRecurso(recursoId);
        aula.getRecursos().add(recurso);
        aulaRepo.save(aula);
    }

    // ─── QUITAR RECURSO INDIVIDUAL ───────────────────────────────────────────
    @Override
    public void eliminarRecurso(Long aulaId, Long recursoId) {
        Aula aula = obtenerPorId(aulaId);
        Recurso recurso = recursoService.obtenerRecurso(recursoId);
        aula.getRecursos().remove(recurso);
        aulaRepo.save(aula);
    }

    // ─── ELIMINAR (soft delete) ───────────────────────────────────────────────
    @Override
    public void eliminar(Long id) {
        Aula aula = obtenerPorId(id);
        aula.setActivo(false);
        aulaRepo.save(aula);
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────
    private Set<Recurso> resolverRecursos(List<Long> ids) {
        return ids.stream()
                .map(recursoService::obtenerRecurso)
                .collect(Collectors.toSet());
    }

}
