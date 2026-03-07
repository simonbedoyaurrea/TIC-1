package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.UbicacionRequestDTO;
import com.tic.optimizacionespacios.models.entities.Ubicacion;

public class UbicacionMapper {

    private UbicacionMapper() {}

    public static Ubicacion toEntity(UbicacionRequestDTO dto) {
        Ubicacion ubicacion = new Ubicacion();

        ubicacion.setBloque(dto.getBloque());
        ubicacion.setPiso(dto.getPiso());

        return ubicacion;
    }
}
