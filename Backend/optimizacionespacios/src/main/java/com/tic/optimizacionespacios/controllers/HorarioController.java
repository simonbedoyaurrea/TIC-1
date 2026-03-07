package com.tic.optimizacionespacios.controllers;

import com.tic.optimizacionespacios.dto.AulaRequestDTO;
import com.tic.optimizacionespacios.dto.AulaResponseDTO;
import com.tic.optimizacionespacios.dto.HorarioAsignacionRequestDTO;
import com.tic.optimizacionespacios.dto.HorarioAsignacionResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.entities.Ubicacion;
import com.tic.optimizacionespacios.models.mappers.AulaMapper;
import com.tic.optimizacionespacios.models.mappers.HorarioAsignacionMapper;
import com.tic.optimizacionespacios.services.interfaces.AulaService;
import com.tic.optimizacionespacios.services.interfaces.HorarioAsignacionService;
import com.tic.optimizacionespacios.services.interfaces.ProfesorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
public class HorarioController {
    private final HorarioAsignacionService horarioService;
    private final AulaService aulaService;
    private final ProfesorService profesorService;

    public HorarioController(HorarioAsignacionService horarioService, AulaService aulaService, ProfesorService profesorService) {
        this.horarioService = horarioService;
        this.aulaService = aulaService;
        this.profesorService = profesorService;
    }

    @PostMapping
    public ResponseEntity<HorarioAsignacionResponseDTO> crearHorario(@RequestBody HorarioAsignacionRequestDTO dto){
        Aula aula = aulaService.obtenerPorId(dto.getAulaId());
        Profesor profesor = profesorService.obtenerProfesorPorId(dto.getProfesorId());

        HorarioAsignacion horario = HorarioAsignacionMapper.toEntity(dto, aula, profesor);
        HorarioAsignacion creada = horarioService.crearHorario(horario);

        return ResponseEntity.ok(HorarioAsignacionMapper.toResponse(creada));
    }

    @GetMapping
    public ResponseEntity<List<HorarioAsignacionResponseDTO>> listarHorarios(){
        List<HorarioAsignacionResponseDTO> horarios = horarioService.obtenerHorarios().stream().
                map(HorarioAsignacionMapper::toResponse).
                toList();
        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioAsignacionResponseDTO> obtenerHorario(@PathVariable Long id){
        return ResponseEntity.ok(
                HorarioAsignacionMapper.
                        toResponse(horarioService.obtenerHorario(id))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioAsignacionResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody HorarioAsignacionRequestDTO dto
    ){
        Aula aula = aulaService.obtenerPorId(dto.getAulaId());
        Profesor profesor = profesorService.obtenerProfesorPorId(dto.getProfesorId());

        HorarioAsignacion horario = HorarioAsignacionMapper.toEntity(dto, aula, profesor);
        HorarioAsignacion actualizada = horarioService.actualizar(id, horario);

        return ResponseEntity.ok(HorarioAsignacionMapper.toResponse(actualizada));
    }

    @PutMapping("/{horarioId}/aulas/{aulaId}")
    public ResponseEntity<Void> cambiarAula(@PathVariable Long horarioId, @PathVariable Long aulaId ){
        horarioService.cambiarAula(horarioId, aulaId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{horarioId}/profesores/{profesorId}")
    public ResponseEntity<Void> cambiarProfesor(@PathVariable Long horarioId, @PathVariable Long profesorId ){
        horarioService.cambiarProfesor(horarioId, profesorId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> validarHorario(
            @PathVariable Long id
    ) {
        horarioService.validarHorario(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> aprobarHorario(
            @PathVariable Long id
    ) {
        horarioService.aprobarHorario(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarHorario(
            @PathVariable Long id
    ) {
        horarioService.cancelarHorario(id);
        return ResponseEntity.noContent().build();
    }

}

