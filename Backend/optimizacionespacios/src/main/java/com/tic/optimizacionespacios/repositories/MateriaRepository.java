package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
}
