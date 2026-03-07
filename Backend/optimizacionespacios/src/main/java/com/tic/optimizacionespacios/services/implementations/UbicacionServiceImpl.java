package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.repositories.UbicacionRepository;
import com.tic.optimizacionespacios.services.interfaces.UbicacionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UbicacionServiceImpl implements UbicacionService {
    private final UbicacionRepository ubicacionRepo;

    public UbicacionServiceImpl(UbicacionRepository ubicacionRepo) {
        this.ubicacionRepo = ubicacionRepo;
    }

    // ===============================
    // CREAR
    // ===============================
    @Override
    public Ubicacion crear(Ubicacion ubicacion) {
        return ubicacionRepo.save(ubicacion);
    }

    // ACTUALIZAR
    @Override
    public Ubicacion actualizar(Long id, Ubicacion ubicacion) {

        Ubicacion existente = obtenerPorId(id);

        existente.setReferencia(ubicacion.getReferencia());

        return ubicacionRepo.save(existente);
    }

    // ===============================
    // OBTENER POR ID
    // ===============================
    @Override
    public Ubicacion obtenerPorId(Long id) {
        return ubicacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
    }

    // ===============================
    // LISTAR
    // ===============================
    @Override
    public List<Ubicacion> listar() {
        return ubicacionRepo.findAll();
    }

    // ===============================
    // ELIMINAR
    // ===============================
    @Override
    public void eliminar(Long id) {
        Ubicacion ubicacion = obtenerPorId(id);
        ubicacionRepo.delete(ubicacion);
    }

}
