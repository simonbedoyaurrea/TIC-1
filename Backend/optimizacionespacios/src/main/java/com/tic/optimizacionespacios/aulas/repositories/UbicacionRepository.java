package com.tic.optimizacionespacios.aulas.repositories;

import com.tic.optimizacionespacios.aulas.entities.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {

    List<Ubicacion> findByBloque(String bloque);

}
