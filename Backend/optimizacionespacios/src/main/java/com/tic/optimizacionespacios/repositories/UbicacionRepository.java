package com.tic.optimizacionespacios.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {
    @Query("SELECT u FROM Ubicacion u LEFT JOIN FETCH u.aulas WHERE u.id = :id")
    Optional<Ubicacion> findByIdWithAulas(@Param("id") Long id);
}
 