package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Aula;

import java.util.List;

public interface AulaService {
    Aula crear(Aula aula);

    Aula actualizar(Long id, Aula aula);

    Aula obtenerPorId(Long id);

    List<Aula> listar();

    void agregarRecurso(Long aulaId, Long recursoId);

    void eliminarRecurso(Long aulaId, Long recursoId);

    void eliminar(Long id);
}
