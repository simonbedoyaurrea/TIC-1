package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.RecursoRequestDTO;
import com.tic.optimizacionespacios.dto.RecursoResponseDTO;
import com.tic.optimizacionespacios.models.entities.Recurso;

public class RecursoMapper {

    private RecursoMapper(){}

    public static Recurso toEntity(RecursoRequestDTO recursoRequestDTO){
        Recurso recurso = new Recurso();

        recurso.setNombre(recursoRequestDTO.getNombre());
        recurso.setDescripcion(recursoRequestDTO.getDescripcion());

        return recurso;
    }

    public static RecursoResponseDTO toResponse (Recurso recurso){
        return new RecursoResponseDTO(
                recurso.getId(),
                recurso.getNombre(),
                recurso.getDescripcion(),
                recurso.getActivo()
        );
    }
}
