package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.aula.UbicacionRequestDTO;
import com.tic.optimizacionespacios.dto.aula.UbicacionResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;

public class UbicacionMapper {

    private UbicacionMapper() {}

    public static Ubicacion toEntity(UbicacionRequestDTO dto) {
        Ubicacion ubicacion = new Ubicacion();

        ubicacion.setBloque(dto.getBloque());
        ubicacion.setPisos(dto.getPisos());

        return ubicacion;
    }

    public static UbicacionResponseDTO toResponse(Ubicacion ubicacion){
        return new UbicacionResponseDTO(
                ubicacion.getId(),
                ubicacion.getBloque(),
                ubicacion.getNombre(),
                ubicacion.getPisos(),
                ubicacion.getAulas().
                        stream().
                        map(Aula::getId).
                        toList()

        );
    }
}
