package com.tic.optimizacionespacios.repositories;

import java.util.List;
import java.util.Optional;

import com.tic.optimizacionespacios.models.entities.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {

    // Query 1: trae Ubicacion con sus Aulas
    @Query("SELECT DISTINCT u FROM Ubicacion u LEFT JOIN FETCH u.aulas WHERE u.id = :id")
    Optional<Ubicacion> findByIdConAulas(@Param("id") Long id);

    // Query 2: para cada Aula, inicializa sus recursos
    @Query("SELECT DISTINCT a FROM Aula a LEFT JOIN FETCH a.recursos WHERE a.ubicacion.id = :id")
    List<Aula> findAulasConRecursosByUbicacion(@Param("id") Long id);


    @Query("SELECT DISTINCT u FROM Ubicacion u LEFT JOIN FETCH u.aulas a LEFT JOIN FETCH a.recursos WHERE u.id = :id")
    Optional<Ubicacion> findByIdConAulasYRecursos(@Param("id") Long id);

}
 