package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Recurso;

import java.util.List;

public interface RecursoService {
    Recurso crearRecurso(Recurso recurso);

    Recurso obtenerRecurso(Long idRecurso);

    List<Recurso> obtenerRecursos();

    Recurso actualizarRecurso(Long idRecurso, Recurso recurso);

    void eliminarRecurso(Long idRecurso);

}
