package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {

}
