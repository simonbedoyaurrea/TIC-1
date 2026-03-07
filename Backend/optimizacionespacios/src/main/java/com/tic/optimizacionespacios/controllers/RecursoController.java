package com.tic.optimizacionespacios.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tic.optimizacionespacios.dto.RecursoRequestDTO;
import com.tic.optimizacionespacios.dto.RecursoResponseDTO;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.models.mappers.RecursoMapper;
import com.tic.optimizacionespacios.services.interfaces.RecursoService;

@RestController
@RequestMapping("/api/recursos")
public class RecursoController {
    private final RecursoService recursoService;

    public RecursoController(RecursoService recursoService) {
        this.recursoService = recursoService;
    }

    @PostMapping
    public ResponseEntity<RecursoResponseDTO> crearRecurso (@RequestBody RecursoRequestDTO dto) {
        Recurso creado = recursoService.crearRecurso(RecursoMapper.toEntity(dto));

        return ResponseEntity.ok(
                RecursoMapper.toResponse(creado)
        );
    }

    // LISTAR PROFESORES
    @GetMapping
    public ResponseEntity<List<RecursoResponseDTO>> listarRecursos() {

        List<RecursoResponseDTO> respuesta =
                recursoService.obtenerRecursos().stream()
                        .map(RecursoMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(respuesta);
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> obtenerRecurso(@PathVariable Long id) {
        Recurso recurso = recursoService.obtenerRecurso(id);

        return ResponseEntity.ok(
                RecursoMapper.toResponse(recurso)
        );
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> actualizarRecurso(
            @PathVariable Long id,
            @RequestBody RecursoRequestDTO dto
    ) {
        Recurso recurso = RecursoMapper.toEntity(dto);
        Recurso actualizado = recursoService.actualizarRecurso(id, recurso);

        return ResponseEntity.ok(
                RecursoMapper.toResponse(actualizado)
        );
    }

    // ELIMINAR (LÓGICO)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        recursoService.eliminarRecurso(id);
        return ResponseEntity.noContent().build();
    }
}
