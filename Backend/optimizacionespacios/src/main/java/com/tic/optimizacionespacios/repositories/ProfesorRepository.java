package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {

    // Trae todos los profesores con sus materias inicializadas
    @Query("SELECT DISTINCT p FROM Profesor p LEFT JOIN FETCH p.materias")
    List<Profesor> findAllConMaterias();

}
