package com.tic.optimizacionespacios.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.enums.TipoAula;
import com.tic.optimizacionespacios.models.entities.Aula;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByActivoTrue();

    List<Aula> findByTipoAulaAndActivoTrue(TipoAula tipoAula);

    List<Aula> findByEstadoAulaAndActivoTrue(EstadoAula estadoAula);

    List<Aula> findByCapacidadMaximaGreaterThanEqualAndActivoTrue(Integer capacidad);

    // boolean existsByCodigo(String codigo);
}
