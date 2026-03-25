package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.RecursoResponseDTO;
import com.tic.optimizacionespacios.dto.UbicacionRequestDTO;
import com.tic.optimizacionespacios.dto.UbicacionResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;

public class UbicacionMapper {

    private UbicacionMapper() {}

    public static Ubicacion toEntity(UbicacionRequestDTO dto) {
        Ubicacion ubicacion = new Ubicacion();

        ubicacion.setBloque(dto.getBloque());
        ubicacion.setNombre(dto.getNombre());
        ubicacion.setImagenUrl(dto.getImagenUrl());
        ubicacion.setPisos(dto.getPisos());

        return ubicacion;
    }

    public static UbicacionResponseDTO toResponse(Ubicacion ubicacion){
        return new UbicacionResponseDTO(
                ubicacion.getId(),
                ubicacion.getBloque(),
                ubicacion.getNombre(),
                ubicacion.getImagenUrl(),
                ubicacion.getPisos(),
                ubicacion.getAulas().
                        stream().
                        map(Aula::getId).
                        toList()

        );
    }
}
