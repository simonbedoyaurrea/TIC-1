package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.AulaRequestDTO;
import com.tic.optimizacionespacios.dto.AulaResponseDTO;
import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.enums.TipoAula;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.models.entities.Ubicacion;


public class AulaMapper {

    private AulaMapper() {}

    // REQUEST → ENTITY
    public static Aula toEntity(AulaRequestDTO dto, Ubicacion ubicacion) {
        Aula aula = new Aula();
        aula.setCapacidadMaxima(dto.getCapacidad());
        aula.setTipoDeAula(TipoAula.valueOf(dto.getTipo()));
        aula.setEstadoAula(EstadoAula.valueOf(dto.getEstado()));
        aula.setUbicacion(ubicacion);
        return aula;
    }

    // ENTITY → RESPONSE
    public static AulaResponseDTO toResponse(Aula aula) {
        return new AulaResponseDTO(
                aula.getId(),
                aula.getCapacidadMaxima(),
                aula.getTipoDeAula().name(),
                aula.getEstadoAula().name(),
                aula.getUbicacion(),
                aula.getRecursos()
                        .stream()
                        .map(Recurso::getId)
                        .toList()
        );
    }
}
