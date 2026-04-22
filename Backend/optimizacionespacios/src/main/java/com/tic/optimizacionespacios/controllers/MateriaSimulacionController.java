package com.tic.optimizacionespacios.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.models.entities.MateriaSimulacion;
import com.tic.optimizacionespacios.services.MateriaSimulacionService;



@RestController
@RequestMapping("/api/simulacion/materias")
public class MateriaSimulacionController {

    @Autowired
    private MateriaSimulacionService materiaSimulacionService;
    
    @PostMapping("/carga")
    public ResponseEntity<String> cargarMaterias(@RequestParam("file") MultipartFile file) {
        materiaSimulacionService.cargarExcelMaterias(file);
        return ResponseEntity.ok("Archivo cargado correctamente");
    }

    @GetMapping
    public ResponseEntity<List<MateriaSimulacion>> obtenerMateriasSimulacion() {

        List<MateriaSimulacion> body = materiaSimulacionService.obtenerMateriasSimulacion();

        return ResponseEntity.ok(body);
    }
    
    
}