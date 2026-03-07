package com.tic.optimizacionespacios.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.dto.ActualizarEstadoDTO;
import com.tic.optimizacionespacios.dto.ReporteRequestDTO;
import com.tic.optimizacionespacios.dto.ReporteResponseDTO;
import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import com.tic.optimizacionespacios.services.ReporteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@Validated
public class ReporteControlller {

    private final ReporteService reporteService;

    // Listar todos o buscar con filtros opcionales
    @GetMapping
    public ResponseEntity<List<ReporteResponseDTO>> listarOFiltrar(
            @RequestParam(required = false) Integer bloque,
            @RequestParam(required = false) EstadoReporte estado,
            @RequestParam(required = false) Urgencia urgencia,
            @RequestParam(required = false) Rol rol,
            @RequestParam(required = false) String categoria
    ) {
        if (bloque != null || estado != null || urgencia != null || rol != null || (categoria != null && !categoria.isBlank())) {
            List<ReporteResponseDTO> resultado = reporteService.buscarConFiltros(bloque, estado, urgencia, rol, categoria);
            return ResponseEntity.ok(resultado);
        }
        return ResponseEntity.ok(reporteService.listarTodos());
    }

    // Obtener reporte por ID
    @GetMapping("/{id}")
    public ResponseEntity<ReporteResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reporteService.obtenerPorId(id));
    }

    // Reportes por bloque
    @GetMapping("/bloque/{bloque}")
    public ResponseEntity<List<ReporteResponseDTO>> obtenerPorBloque(@PathVariable Integer bloque) {
        return ResponseEntity.ok(reporteService.buscarPorBloque(bloque));
    }

    // Reportes por bloque y salón
    @GetMapping("/bloque/{bloque}/salon")
    public ResponseEntity<List<ReporteResponseDTO>> obtenerPorBloqueYSalon(
            @PathVariable Integer bloque,
            @RequestParam String salon
    ) {
        return ResponseEntity.ok(reporteService.buscarPorBloqueYSalon(bloque, salon));
    }

    // Espacios inhabilitados (pendientes o en proceso)
    @GetMapping("/inhabilitados")
    public ResponseEntity<List<ReporteResponseDTO>> obtenerEspaciosInhabilitados() {
        return ResponseEntity.ok(reporteService.obtenerEspaciosInhabilitados());
    }

    // Estadísticas
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        return ResponseEntity.ok(reporteService.obtenerEstadisticas());
    }

    // Crear reporte (soporta archivos multipart opcionales)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReporteResponseDTO> crearReporte(
            @Valid @RequestPart("reporte") ReporteRequestDTO dto,
            @RequestPart(value = "archivos", required = false) List<MultipartFile> archivos
    ) {
        ReporteResponseDTO creado = reporteService.crearReporte(dto, archivos);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // Actualizar estado (panel admin)
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReporteResponseDTO> actualizarEstado(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarEstadoDTO dto
    ) {
        return ResponseEntity.ok(reporteService.actualizarEstado(id, dto));
    }

    // Eliminar reporte
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        reporteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
