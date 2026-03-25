package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    @Query("SELECT DISTINCT m FROM Materia m LEFT JOIN FETCH m.recursosNecesarios")
    List<Materia> findAllConRecursos();
}
