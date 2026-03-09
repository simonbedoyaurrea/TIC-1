package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Aula;
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

    @Override
    public Ubicacion crear(Ubicacion ubicacion) {
        return ubicacionRepo.save(ubicacion);
    }

    @Override
    public Ubicacion actualizar(Long id, Ubicacion ubicacion) {

        Ubicacion existente = obtenerPorId(id);

        existente.setReferencia(ubicacion.getReferencia());

        return ubicacionRepo.save(existente);
    }

    @Override
    public Ubicacion obtenerPorId(Long id) {
        System.out.println(id);
        return ubicacionRepo.findByIdWithAulas(id)
                .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
    }

    @Override
    public List<Ubicacion> listar() {
        return ubicacionRepo.findAll();
    }

    @Override
    public List<Aula> obtenerAulas(Long id){
        return obtenerPorId(id).getAulas();
    }

    // ELIMINAR
    @Override
    public void eliminar(Long id) {
        Ubicacion ubicacion = obtenerPorId(id);
        ubicacionRepo.delete(ubicacion);
    }

}
