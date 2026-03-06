package com.tic.optimizacionespacios.controllers;

import com.tic.optimizacionespacios.dto.DisponibilidadProfesorDTO;
import com.tic.optimizacionespacios.dto.ProfesorRequestDTO;
import com.tic.optimizacionespacios.dto.ProfesorResponseDTO;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.mappers.DisponibilidadProfesorMapper;
import com.tic.optimizacionespacios.models.mappers.ProfesorMapper;
import com.tic.optimizacionespacios.services.interfaces.ProfesorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//FALTAN VALIDACIONES
//FALTA: LOS PROFESORES SOLO PUEDEN DAR LAS MATERIAS QUE ESTEN CAPACITADOS
@RestController
@RequestMapping("/api/profesores")
public class ProfesorController {
    private final ProfesorService profesorService;

    public ProfesorController(ProfesorService profesorService) {
        this.profesorService = profesorService;
    }

    // CREAR PROFESOR
    @PostMapping
    public ResponseEntity<ProfesorResponseDTO> crearProfesor(@RequestBody ProfesorRequestDTO dto) {
        Profesor creado = profesorService.crearProfesor(ProfesorMapper.toEntity(dto));

        return ResponseEntity.ok(
                ProfesorMapper.toResponse(creado)
        );
    }

    // LISTAR PROFESORES
    @GetMapping
    public ResponseEntity<List<ProfesorResponseDTO>> listarProfesores() {

        List<ProfesorResponseDTO> respuesta =
                profesorService.listarProfesores().stream()
                        .map(ProfesorMapper::toResponse)
                        .toList();

        return ResponseEntity.ok(respuesta);
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ProfesorResponseDTO> obtenerProfesor(@PathVariable Long id) {
        Profesor profesor = profesorService.obtenerProfesorPorId(id);

        return ResponseEntity.ok(
                ProfesorMapper.toResponse(profesor)
        );
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<ProfesorResponseDTO> actualizarProfesor(
            @PathVariable Long id,
            @RequestBody ProfesorRequestDTO dto
    ) {
        Profesor profesor = ProfesorMapper.toEntity(dto);
        Profesor actualizado = profesorService.actualizarProfesor(id, profesor);

        return ResponseEntity.ok(
                ProfesorMapper.toResponse(actualizado)
        );
    }

    @PutMapping("/{profesorId}/agregarMateria/{materiaId}")
    public ResponseEntity<Void> agregarMateria(@PathVariable Long profesorId, @PathVariable Long materiaId){
        profesorService.agregarMateria(profesorId, materiaId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{profesorId}/eliminarMateria/{materiaId}")
    public ResponseEntity<Void> eliminarMateria(@PathVariable Long profesorId, @PathVariable Long materiaId){
        profesorService.eliminarMateria(profesorId, materiaId);
        return ResponseEntity.ok().build();
    }


    // ELIMINAR (LÓGICO)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProfesor(@PathVariable Long id) {
        profesorService.eliminarProfesor(id);
        return ResponseEntity.noContent().build();
    }

    // AGREGAR DISPONIBILIDAD
    @PostMapping("/{id}/disponibilidad")
    public ResponseEntity<Void> agregarDisponibilidad(
            @PathVariable Long id,
            @RequestBody DisponibilidadProfesorDTO dto
    ) {
        profesorService.agregarDisponibilidad(
                id,
                DisponibilidadProfesorMapper.toEntity(dto)
        );
        return ResponseEntity.ok().build();
    }

    // ELIMINAR DISPONIBILIDAD
    @DeleteMapping("/{profesorId}/disponibilidad/{dispId}")
    public ResponseEntity<Void> eliminarDisponibilidad(
            @PathVariable Long profesorId,
            @PathVariable Long dispId
    ) {
        profesorService.eliminarDisponibilidad(profesorId, dispId);
        return ResponseEntity.noContent().build();
    }
}
