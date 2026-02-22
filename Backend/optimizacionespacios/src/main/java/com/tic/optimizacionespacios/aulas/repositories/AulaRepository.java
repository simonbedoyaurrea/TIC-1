package com.tic.optimizacionespacios.aulas.repositories;

import com.tic.optimizacionespacios.aulas.entities.Aula;
import com.tic.optimizacionespacios.aulas.enums.EstadoAula;
import com.tic.optimizacionespacios.aulas.enums.TipoAula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByActivoTrue();

    List<Aula> findByTipoAulaAndActivoTrue(TipoAula tipoAula);

    List<Aula> findByEstadoAulaAndActivoTrue(EstadoAula estadoAula);

    List<Aula> findByCapacidadMaximaGreaterThanEqualAndActivoTrue(Integer capacidad);

    boolean existsByCodigo(String codigo);
}
