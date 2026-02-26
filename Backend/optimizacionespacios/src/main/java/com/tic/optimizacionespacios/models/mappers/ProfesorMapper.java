package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.ProfesorRequestDTO;
import com.tic.optimizacionespacios.dto.ProfesorResponseDTO;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.enums.TipoProfesor;

public class ProfesorMapper {
    private ProfesorMapper() {}

    // ENTITY → RESPONSE DTO
    public static ProfesorResponseDTO toResponse(Profesor profesor) {
        return new ProfesorResponseDTO(
                profesor.getId(),
                profesor.getNombreCompleto(),
                profesor.getEmailInstitucional(),
                profesor.getTipoProfesor().name(),
                profesor.getActivo()
        );
    }

    // REQUEST DTO → ENTITY
    public static Profesor toEntity(ProfesorRequestDTO dto) {
        Profesor profesor = new Profesor();
        profesor.setNombreCompleto(dto.getNombre());
        profesor.setEmailInstitucional(dto.getEmail());
        profesor.setTipoProfesor(TipoProfesor.valueOf(dto.getTipo()));
        profesor.setActivo(true);
        return profesor;
    }
}
