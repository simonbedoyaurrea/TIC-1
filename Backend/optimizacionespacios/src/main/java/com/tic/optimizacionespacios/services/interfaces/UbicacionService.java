package com.tic.optimizacionespacios.services.interfaces;

import com.tic.optimizacionespacios.models.entities.Ubicacion;

import java.util.List;

public interface UbicacionService {

    Ubicacion crear(Ubicacion ubicacion);

    Ubicacion actualizar(Long id, Ubicacion ubicacion);

    Ubicacion obtenerPorId(Long id);

    List<Ubicacion> listar();

    void eliminar(Long id);
}