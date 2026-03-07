package com.tic.optimizacionespacios.services.interfaces;

import java.util.List;

import com.tic.optimizacionespacios.models.entities.Aula;

public interface AulaService {
    Aula crear(Aula aula, List<Long> recursoIds);

    Aula actualizar(Long id, Aula aula, List<Long> recursoIds);

    Aula obtenerPorId(Long id);

    List<Aula> listar();

    void actualizarEstado(Long id, String estado);

    void agregarRecurso(Long aulaId, Long recursoId);

    void eliminarRecurso(Long aulaId, Long recursoId);

    void eliminar(Long id);
}
