package com.tic.optimizacionespacios.controllers;

import com.tic.optimizacionespacios.dto.AulaResponseDTO;
import com.tic.optimizacionespacios.dto.UbicacionResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.models.mappers.AulaMapper;
import com.tic.optimizacionespacios.models.mappers.UbicacionMapper;
import com.tic.optimizacionespacios.services.interfaces.UbicacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bloques")
public class UbicacionController {

    private final UbicacionService ubicacionService;

    public UbicacionController(UbicacionService ubicacionService) {
        this.ubicacionService = ubicacionService;
    }

    // CREAR
    @PostMapping
    public ResponseEntity<UbicacionResponseDTO> crear(@RequestBody Ubicacion ubicacion){
        Ubicacion nueva = ubicacionService.crear(ubicacion);
        return ResponseEntity.ok(UbicacionMapper.toResponse(nueva));
    }

    // LISTAR
    @GetMapping
    public ResponseEntity<List<UbicacionResponseDTO>> listar(){
        List<UbicacionResponseDTO> ubicaciones = ubicacionService.listar().
                stream().
                map(UbicacionMapper::toResponse).
                toList();
        return ResponseEntity.ok(ubicaciones);
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<UbicacionResponseDTO> obtenerPorId(@PathVariable Long id){
        return ResponseEntity.ok(UbicacionMapper.toResponse(ubicacionService.obtenerPorId(id)));
    }

    @GetMapping("/aulas/{id}")
    public ResponseEntity<List<AulaResponseDTO>> obtenerAulas(@PathVariable Long id){
        List<AulaResponseDTO> aulas = ubicacionService.obtenerAulas(id).
                stream().
                map(AulaMapper::toResponse).
                toList();
        return ResponseEntity.ok(aulas);
    }

    // ACTUALIZAR
    @PutMapping("/{id}")
    public ResponseEntity<UbicacionResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody Ubicacion ubicacion){
        return ResponseEntity.ok(UbicacionMapper.toResponse(ubicacionService.actualizar(id, ubicacion)));
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        ubicacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}