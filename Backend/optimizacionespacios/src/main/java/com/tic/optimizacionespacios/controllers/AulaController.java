package com.tic.optimizacionespacios.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.tic.optimizacionespacios.dto.AulaRequestDTO;
import com.tic.optimizacionespacios.dto.AulaResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.models.mappers.AulaMapper;
import com.tic.optimizacionespacios.services.interfaces.AulaService;
import com.tic.optimizacionespacios.services.interfaces.UbicacionService;

public class AulaController {

    //No esta desarrollada
    private final AulaService aulaService;
    private final UbicacionService ubicacionService;

    public AulaController(
            AulaService aulaService,
            UbicacionService ubicacionService
    ) {
        this.aulaService = aulaService;
        this.ubicacionService = ubicacionService;
    }

    // CREAR AULA
    @PostMapping
    public ResponseEntity<AulaResponseDTO> crearAula(
            @RequestBody AulaRequestDTO dto
    ) {
        Ubicacion ubicacion =
                ubicacionService.obtenerPorId(dto.getIdUbicacion());

        Aula aula = AulaMapper.toEntity(dto, ubicacion);
        Aula creada = aulaService.crear(aula);

        return ResponseEntity.ok(
                AulaMapper.toResponse(creada)
        );
    }

    // LISTAR AULAS
    @GetMapping
    public ResponseEntity<List<AulaResponseDTO>> listarAulas() {

        List<AulaResponseDTO> respuesta =
                aulaService.listar().stream()
                        .map(AulaMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(respuesta);
    }

    // OBTENER AULA POR ID
    @GetMapping("/{id}")
    public ResponseEntity<AulaResponseDTO> obtenerAula(
            @PathVariable Long id
    ) {
        Aula aula = aulaService.obtenerPorId(id);

        return ResponseEntity.ok(
                AulaMapper.toResponse(aula)
        );
    }

    // ACTUALIZAR AULA
    @PutMapping("/{id}")
    public ResponseEntity<AulaResponseDTO> actualizarAula(
            @PathVariable Long id,
            @RequestBody AulaRequestDTO dto
    ) {
        Ubicacion ubicacion =
                ubicacionService.obtenerPorId(dto.getIdUbicacion());

        Aula aula = AulaMapper.toEntity(dto, ubicacion);
        Aula actualizada = aulaService.actualizar(id, aula);

        return ResponseEntity.ok(
                AulaMapper.toResponse(actualizada)
        );
    }

    // ELIMINAR (LÓGICO)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAula(
            @PathVariable Long id
    ) {
        aulaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
