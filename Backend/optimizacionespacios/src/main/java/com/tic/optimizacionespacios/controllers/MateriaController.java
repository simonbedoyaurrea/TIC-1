package com.tic.optimizacionespacios.controllers;

import com.tic.optimizacionespacios.dto.*;
import com.tic.optimizacionespacios.models.entities.Materia;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.entities.Recurso;
import com.tic.optimizacionespacios.models.mappers.DisponibilidadProfesorMapper;
import com.tic.optimizacionespacios.models.mappers.MateriaMapper;
import com.tic.optimizacionespacios.models.mappers.ProfesorMapper;
import com.tic.optimizacionespacios.services.interfaces.MateriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {
    public final MateriaService materiaService;

    public MateriaController(MateriaService materiaService) {
        this.materiaService = materiaService;
    }

    @PostMapping
    public ResponseEntity<MateriaResponseDTO> crearMateria(@RequestBody MateriaRequestDTO dto, @RequestBody Set<Recurso> recursos) {
        Materia creado = materiaService.crearMateria(MateriaMapper.toEntity(dto, recursos));

        return ResponseEntity.ok(
                MateriaMapper.toResponse(creado)
        );
    }

    // LISTAR PROFESORES
    @GetMapping
    public ResponseEntity<List<MateriaResponseDTO>> listarMaterias() {

        List<MateriaResponseDTO> respuesta =
                materiaService.obtenerMaterias().stream()
                        .map(MateriaMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(respuesta);
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<MateriaResponseDTO> obtenerProfesor(@PathVariable Long id) {
        Materia materia = materiaService.obtenerMateria(id);

        return ResponseEntity.ok(
                MateriaMapper.toResponse(materia)
        );
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<MateriaResponseDTO> actualizarMateria(
            @PathVariable Long id,
            @RequestBody MateriaRequestDTO dto,
            @RequestBody Set<Recurso> recursos
    ) {
        Materia materia = MateriaMapper.toEntity(dto, recursos);
        Materia actualizado = materiaService.actualizarMateria(id, materia);

        return ResponseEntity.ok(
                MateriaMapper.toResponse(actualizado)
        );
    }

    @PutMapping("/{materiaId}/agregarRecurso/{recursoId}")
    public ResponseEntity<Void> agregarRecurso(@PathVariable Long materiaId, @PathVariable Long recursoId){
        materiaService.agregarRecurso(materiaId, recursoId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{materiaId}/agregarRecurso/{recursoId}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long materiaId, @PathVariable Long recursoId){
        materiaService.eliminarRecurso(materiaId, recursoId);
        return ResponseEntity.ok().build();
    }

    // ELIMINAR (LÓGICO)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMateria(@PathVariable Long id) {
        materiaService.eliminarMateria(id);
        return ResponseEntity.noContent().build();
    }
}
