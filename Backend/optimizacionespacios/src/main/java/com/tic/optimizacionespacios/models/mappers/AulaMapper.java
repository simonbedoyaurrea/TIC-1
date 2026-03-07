package com.tic.optimizacionespacios.models.mappers;

import java.util.Collections;
import java.util.List;

import com.tic.optimizacionespacios.dto.AulaRequestDTO;
import com.tic.optimizacionespacios.dto.AulaResponseDTO;
import com.tic.optimizacionespacios.dto.RecursoResponseDTO;
import com.tic.optimizacionespacios.enums.EstadoAula;
import com.tic.optimizacionespacios.enums.TipoAula;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;


public class AulaMapper {

    private AulaMapper() {}

    // REQUEST → ENTITY (los recursos se asignan en el service)
    // RequestDTO -> Entity
    public static Aula toEntity(AulaRequestDTO dto, Ubicacion ubicacion){

        Aula aula = new Aula();

        aula.setCapacidadMaxima(dto.getCapacidad());
        aula.setTipoDeAula(TipoAula.valueOf(dto.getTipo()));
        aula.setEstadoAula(EstadoAula.valueOf(dto.getEstado()));
        aula.setObservaciones(dto.getObservaciones());
        aula.setUbicacion(ubicacion);
        aula.setActivo(true);

        return aula;
    }

    // ENTITY → RESPONSE
    public static AulaResponseDTO toResponse(Aula aula) {

        List<RecursoResponseDTO> recursosDTO = aula.getRecursos() == null
                ? Collections.emptyList()
                : aula.getRecursos().stream()
                        .map(r -> new RecursoResponseDTO(
                                r.getId(),
                                r.getNombre(),
                                r.getDescripcion(),
                                r.getActivo()))
                        .toList();
        
        return new AulaResponseDTO(
                aula.getId(),
                aula.getCapacidadMaxima(),
                aula.getTipoDeAula().name(),
                aula.getEstadoAula().name(),
                aula.getUbicacion(),
                recursosDTO,
                aula.getObservaciones()
        );
    }
}