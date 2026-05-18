package com.tic.optimizacionespacios.controllers;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.dto.optimizador.OptimizadorRequestDTO;
import com.tic.optimizacionespacios.models.entities.HorarioSimulacion;
import com.tic.optimizacionespacios.services.HorarioSimulacionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/simulacion/horarios")
@RequiredArgsConstructor
public class HorarioSimulacionController {
    
    private final HorarioSimulacionService horarioSimulacionService;

    @GetMapping()
    public ResponseEntity<InputStreamResource> descargarExcel() {

        InputStreamResource file =
                new InputStreamResource(horarioSimulacionService.exportarExcel());

        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=usuarios.xlsx"
                )
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

    @PostMapping("/agregar")
    public ResponseEntity<String> agregarMateriaSimulacion(@RequestBody HorarioSimulacion horario ) {
        
        horarioSimulacionService.agregarMateriaSimulacion(horario);

        return ResponseEntity.ok("Materia agregada correctamente");
    }  

    @PostMapping("/carga")
    public ResponseEntity<String> cargarHorarios(@RequestParam("fileHorario") MultipartFile fileHorario) {
        horarioSimulacionService.cargarExcelHorarios(fileHorario);
        return ResponseEntity.ok("Archivo cargado correctamente");
    }

    @PostMapping("/optimizador")
    public ResponseEntity<String> optimizarHorario(
            @RequestBody OptimizadorRequestDTO request
    ) {

        String resultado = horarioSimulacionService.optimizarHorario(request);

        return ResponseEntity.ok(resultado);
    }

    
    

}
