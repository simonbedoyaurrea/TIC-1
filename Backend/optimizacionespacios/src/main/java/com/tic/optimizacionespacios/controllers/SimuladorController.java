package com.tic.optimizacionespacios.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.dto.SimuladorResponseDTO;
import com.tic.optimizacionespacios.services.SimuladorService;

import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/simulacion")
public class SimuladorController {

    @Autowired
    private SimuladorService SimuladorService;
    
    @PostMapping("/carga")
    public ResponseEntity<SimuladorResponseDTO> cargarArchivos(
        @RequestParam("asignaturas") MultipartFile asignaturas,
        @RequestParam("docentes_cat") MultipartFile docentesCat,
        @RequestParam("disponibilidad") MultipartFile disponibilidad,
        @RequestParam("doc_asignaturas") MultipartFile docAsignaturas,
        @RequestParam("restricciones_ed") MultipartFile restriccionesEd,
        @RequestParam("programacion") MultipartFile programacion,
        @RequestParam("demandas") MultipartFile demandas
) {
        String response =SimuladorService.simular(asignaturas, docentesCat, disponibilidad, docAsignaturas, restriccionesEd, programacion, demandas) ;
        try {
        ObjectMapper mapper = new ObjectMapper();

        Map<String, String> json = mapper.readValue(response, Map.class);

        String jobId = json.get("job_id");

        return ResponseEntity.ok(SimuladorResponseDTO.builder()
        .jobId(jobId)
        .build()
        );

    } catch (Exception e) {
        return ResponseEntity.status(500).build();
    }
    }

   @GetMapping("/estado/{jobId}")
    public ResponseEntity<String> estado(@PathVariable String jobId) {

        String response = SimuladorService.estatusSimulacion(jobId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/resultado/{jobId}")
    public ResponseEntity<byte[]> resultado(@PathVariable String jobId) {

    byte[] file = SimuladorService.resultadoSimulacion(jobId);

    return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=resultado.xlsx")
            .body(file);
}
}
