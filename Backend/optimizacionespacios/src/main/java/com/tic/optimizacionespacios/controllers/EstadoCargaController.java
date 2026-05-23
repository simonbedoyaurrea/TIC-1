package com.tic.optimizacionespacios.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tic.optimizacionespacios.services.EstadoCargaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/simulacion/estado")
@RequiredArgsConstructor
public class EstadoCargaController {

    private final EstadoCargaService estadoCargaService;

    @GetMapping()
    public ResponseEntity<Map<String, Object>> getEstado() {
        return ResponseEntity.ok(estadoCargaService.getEstado());
    }
}