package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.enums.EstadoAula;
import com.tic.optimizacionespacios.models.enums.TipoAula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByActivoTrue();

    List<Aula> findByTipoAulaAndActivoTrue(TipoAula tipoAula);

    List<Aula> findByEstadoAulaAndActivoTrue(EstadoAula estadoAula);

    List<Aula> findByCapacidadMaximaGreaterThanEqualAndActivoTrue(Integer capacidad);

    boolean existsByCodigo(String codigo);
}
