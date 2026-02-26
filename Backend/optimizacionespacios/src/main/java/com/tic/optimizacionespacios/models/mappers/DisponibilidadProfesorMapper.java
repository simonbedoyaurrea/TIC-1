package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.DisponibilidadProfesorDTO;
import com.tic.optimizacionespacios.models.entities.DisponibilidadProfesor;

public class DisponibilidadProfesorMapper {

    private DisponibilidadProfesorMapper() {}

    public static DisponibilidadProfesor toEntity(DisponibilidadProfesorDTO dto) {
        DisponibilidadProfesor d = new DisponibilidadProfesor();
        d.setDiaSemana(dto.getDiaSemana());
        d.setHoraInicio(dto.getHoraInicio());
        d.setHoraFin(dto.getHoraFin());
        return d;
    }

    public static DisponibilidadProfesorDTO toDTO(DisponibilidadProfesor entity) {
        DisponibilidadProfesorDTO dto = new DisponibilidadProfesorDTO();
        dto.setDiaSemana(entity.getDiaSemana());
        dto.setHoraInicio(entity.getHoraInicio());
        dto.setHoraFin(entity.getHoraFin());
        return dto;
    }
}
