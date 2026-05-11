package com.tic.optimizacionespacios.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.enums.TipoAula;
import com.tic.optimizacionespacios.models.entities.Aula;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByActivoTrue();

    List<Aula> findByTipoDeAulaAndActivoTrue(TipoAula tipoDeAula);

    List<Aula> findByEstadoAulaAndActivoTrue(EstadoAula estadoAula);

    List<Aula> findByCapacidadMaximaGreaterThanEqualAndActivoTrue(Integer capacidad);

    @Query("SELECT a FROM Aula a LEFT JOIN FETCH a.recursos WHERE a.id = :id")
    Aula findByIdWithRecursos(@Param("id") Long id);

    @Query("SELECT DISTINCT a FROM Aula a LEFT JOIN FETCH a.recursos WHERE a.ubicacion.id = :idUbicacion")
    List<Aula> findAulasConRecursosByUbicacion(@Param("idUbicacion") Long idUbicacion);

    //boolean existsByCodigo(String codigo);
}
