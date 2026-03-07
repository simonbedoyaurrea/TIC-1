package com.tic.optimizacionespacios.controllers;

import com.tic.optimizacionespacios.services.interfaces.DisponibilidadAulaService;
import com.tic.optimizacionespacios.services.interfaces.DisponibilidadProfesorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/disponibilidad")
public class DisponibilidadController {
    private final DisponibilidadAulaService disponibilidadAulaService;
    private final DisponibilidadProfesorService disponibilidadProfesorService;

    public DisponibilidadController(
            DisponibilidadAulaService disponibilidadAulaService,
            DisponibilidadProfesorService disponibilidadProfesorService
    ) {
        this.disponibilidadAulaService = disponibilidadAulaService;
        this.disponibilidadProfesorService = disponibilidadProfesorService;
    }

    //Se pueden complementar las respuestas para que no solo digan que no esta disponible, sino que tambien diga el motivo
    @GetMapping("/aulas/{aulaId}")
    public ResponseEntity<Boolean> verificarDisponibilidadAula(
            @PathVariable Long aulaId,
            @RequestParam DayOfWeek dia,
            @RequestParam LocalTime horaInicio,
            @RequestParam LocalTime horaFin,
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin
    ) {

        boolean disponible = disponibilidadAulaService.aulaDisponible(
                aulaId,
                dia,
                horaInicio,
                horaFin,
                fechaInicio,
                fechaFin
        );

        return ResponseEntity.ok(disponible);
    }

    @GetMapping("/profesores/{profesorId}")
    public ResponseEntity<Boolean> verificarDisponibilidadProfesor(
            @PathVariable Long profesorId,
            @RequestParam DayOfWeek dia,
            @RequestParam LocalTime horaInicio,
            @RequestParam LocalTime horaFin,
            @RequestParam LocalDate fechaInicio,
            @RequestParam LocalDate fechaFin
    ) {

        boolean disponible = disponibilidadProfesorService.profesorDisponible(
                profesorId,
                dia,
                horaInicio,
                horaFin,
                fechaInicio,
                fechaFin
        );

        return ResponseEntity.ok(disponible);
    }
}
