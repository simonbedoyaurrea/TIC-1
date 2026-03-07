package com.tic.optimizacionespacios.services;

import com.tic.optimizacionespacios.dto.ActualizarEstadoDTO;
import com.tic.optimizacionespacios.dto.ReporteRequestDTO;
import com.tic.optimizacionespacios.dto.ReporteResponseDTO;
import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ReporteService {

    // Crear un nuevo reporte (con archivos opcionales de evidencia)
    ReporteResponseDTO crearReporte(ReporteRequestDTO dto, List<MultipartFile> archivos);

    // Obtener un reporte por su ID
    ReporteResponseDTO obtenerPorId(Long id);

    // Listar todos los reportes
    List<ReporteResponseDTO> listarTodos();

    // Búsqueda con filtros combinados (todos opcionales)
    List<ReporteResponseDTO> buscarConFiltros(
            Integer bloque,
            EstadoReporte estado,
            Urgencia urgencia,
            Rol rol,
            String categoria
    );

    // Reportes de un bloque específico
    List<ReporteResponseDTO> buscarPorBloque(Integer bloque);

    // Reportes de un salón específico dentro de un bloque
    List<ReporteResponseDTO> buscarPorBloqueYSalon(Integer bloque, String salon);

    // Espacios actualmente inhabilitados (pendientes o en proceso)
    List<ReporteResponseDTO> obtenerEspaciosInhabilitados();

    // Cambiar el estado de un reporte (uso del panel admin)
    ReporteResponseDTO actualizarEstado(Long id, ActualizarEstadoDTO dto);

    // Eliminar un reporte y sus archivos
    void eliminar(Long id);

    // Estadísticas generales para el dashboard
    Map<String, Object> obtenerEstadisticas();
}
