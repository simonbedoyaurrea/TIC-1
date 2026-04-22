package com.tic.optimizacionespacios.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.models.entities.MateriaSimulacion;

@Repository
public interface MateriaSimulacionRepository extends JpaRepository<MateriaSimulacion, Long> {
}
