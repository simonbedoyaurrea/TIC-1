package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {

}
