package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Materia;

import java.util.List;

public interface MateriaService {

    Materia crearMateria(Materia materia);

    Materia obtenerMateria(Long idMateria);

    List<Materia> obtenerMaterias();

    void agregarRecurso(Long idMateria, Long idRecurso);

    void eliminarRecurso(Long idMateria, Long idRecurso);

    Materia actualizarMateria(Long idMateria, Materia materia);

    void eliminarMateria(Long idMateria);

}
