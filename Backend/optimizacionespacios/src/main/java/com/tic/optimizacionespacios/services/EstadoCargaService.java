package com.tic.optimizacionespacios.services;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.tic.optimizacionespacios.repositories.HorarioSimulacionRepository;
import com.tic.optimizacionespacios.repositories.MateriaSimulacionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EstadoCargaService {

    private final MateriaSimulacionRepository materiaSimRepo;
    private final HorarioSimulacionRepository horarioSimulacionRepository;

    public Map<String, Object> getEstado() {
        long materias = materiaSimRepo.count();
        long horarios = horarioSimulacionRepository.count();

        return Map.of(
            "materias", Map.of("cargado", materias > 0, "registros", materias),
            "horarios", Map.of("cargado", horarios > 0, "registros", horarios),
            "listo",    materias > 0 && horarios > 0
        );
    }
}
