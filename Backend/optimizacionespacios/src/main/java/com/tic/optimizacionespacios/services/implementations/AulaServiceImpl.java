package com.tic.optimizacionespacios.services.implementations;

import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.repositories.AulaRepository;
import com.tic.optimizacionespacios.services.interfaces.AulaService;
import com.tic.optimizacionespacios.services.interfaces.UbicacionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class AulaServiceImpl implements AulaService {
    private final AulaRepository aulaRepo;
    private final UbicacionService ubicacionService;

    public AulaServiceImpl(
            AulaRepository aulaRepo,
            UbicacionService ubicacionService
    ) {
        this.aulaRepo = aulaRepo;
        this.ubicacionService = ubicacionService;
    }

    // ===============================
    // CREAR
    // ===============================
    @Override
    public Aula crear(Aula aula) {

        // Validar que la ubicación exista
        Ubicacion ubicacion = ubicacionService.obtenerPorId(
                aula.getUbicacion().getId()
        );

        aula.setUbicacion(ubicacion);

        return aulaRepo.save(aula);
    }

    // ACTUALIZAR
    @Override
    public Aula actualizar(Long id, Aula aula) {

        Aula existente = obtenerPorId(id);

        existente.setCapacidadMaxima(aula.getCapacidadMaxima());
        existente.setTipoDeAula(aula.getTipoDeAula());

        // Si cambia la ubicación
        if (aula.getUbicacion() != null) {
            Ubicacion ubicacion = ubicacionService.obtenerPorId(
                    aula.getUbicacion().getId()
            );
            existente.setUbicacion(ubicacion);
        }

        return aulaRepo.save(existente);
    }

    // OBTENER POR ID
    @Override
    public Aula obtenerPorId(Long id) {
        return aulaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula no encontrada"));
    }

    // LISTAR
    @Override
    public List<Aula> listar() {
        return aulaRepo.findAll();
    }

    // ELIMINAR
    @Override
    public void eliminar(Long id) {
        Aula aula = obtenerPorId(id);
        aulaRepo.delete(aula);
    }

}
