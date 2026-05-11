package com.tic.optimizacionespacios.services.implementations;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tic.optimizacionespacios.dto.reportes.ActualizarEstadoDTO;
import com.tic.optimizacionespacios.dto.reportes.ReporteRequestDTO;
import com.tic.optimizacionespacios.dto.reportes.ReporteResponseDTO;
import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import com.tic.optimizacionespacios.exception.RecursoNoEncontradoException;
import com.tic.optimizacionespacios.models.entities.Reporte;
import com.tic.optimizacionespacios.repositories.ReporteRepository;
import com.tic.optimizacionespacios.services.interfaces.ReporteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor   
@Slf4j                     
public class ReporteServiceImpl implements ReporteService {

    private final ReporteRepository reporteRepository;


    // ── Mapa de bloques UPB ────────────────────────────────────────────────
    // El frontend solo manda el número, el backend resuelve el nombre
    private static final Map<Integer, String> BLOQUES_UPB = Map.ofEntries(
            Map.entry(1,  "Templo Universitario Ntra. Sra. del Santísimo Sacramento"),
            Map.entry(2,  "Aula Magna Mons. Manuel José Sierra"),
            Map.entry(3,  "Bloque Rectoral"),
            Map.entry(4,  "Colegio UPB · Primaria y Preescolar"),
            Map.entry(5,  "Colegio UPB · Bachillerato"),
            Map.entry(6,  "Economía, Administración, Teología, Filosofía · Auditorio Pío XII"),
            Map.entry(7,  "Ciencias Sociales"),
            Map.entry(8,  "Centro de Producción Audiovisual CPA / Talleres y Laboratorios"),
            Map.entry(9,  "Postgrados"),
            Map.entry(10, "Arquitectura y Diseño · Auditorio Ignacio Vieira Jaramillo"),
            Map.entry(11, "Laboratorios · Centro de Eventos FORUM UPB"),
            Map.entry(12, "Derecho y Ciencias Políticas · Auditorio Guillermo Jaramillo"),
            Map.entry(13, "Editorial · Librería · Tienda Universitaria"),
            Map.entry(14, "Bienestar Universitario"),
            Map.entry(15, "Biblioteca Central Mons. Darío Múnera Vélez"),
            Map.entry(16, "Canchas Sintéticas · Canchas de Tenis"),
            Map.entry(18, "Polideportivo · Gimnasio UPB"),
            Map.entry(19, "Bloque de Parqueaderos · Cancha Fundadores"),
            Map.entry(24, "Puestos de Estudio · Asesoría Integral"),
            Map.entry(50, "Centro de Familia · Carrera 73 No. C2-46"),
            Map.entry(51, "Casa de Institutos · Circular 1ª No. 73-30"),
            Map.entry(52, "Circular 1ª No. 73-74 · Conciliación y Arbitraje"),
            Map.entry(53, "Casa de Transferencia · Circular 1ª No. 73-74"),
            Map.entry(54, "Casa Bioingeniería · Circular 1ª No. 73-80"),
            Map.entry(55, "Casa GIA · Grupo de Investigaciones Ambientales")
    );


    // ════════════════════════════════════════════════════════════════════════
    //  CREAR REPORTE
    // ════════════════════════════════════════════════════════════════════════
    @Override
    @Transactional
    public ReporteResponseDTO crearReporte(ReporteRequestDTO dto) {

        // 1. Resolver nombre del bloque a partir del número
        String nombreBloque = BLOQUES_UPB.getOrDefault(dto.getNumeroBloque(), "Bloque desconocido");
        

        // 3. Construir la entidad con el builder de Lombok
        Reporte reporte = Reporte.builder()
                .rol(dto.getRol())
                .contacto(dto.getContacto())
                .numeroBloque(dto.getNumeroBloque())
                .nombreBloque(nombreBloque)
                .salon(dto.getSalon().trim())
                .piso(dto.getPiso())
                .inhabilitado(dto.isInhabilitado())
                .categoria(dto.getCategoria())
                .subcategoria(dto.getSubcategoria())
                .descripcion(dto.getDescripcion().trim())
                .urgencia(dto.getUrgencia())
                .estado(EstadoReporte.PENDIENTE)  // siempre inicia en PENDIENTE
                .build();

        // 4. Guardar en base de datos
        Reporte guardado = reporteRepository.save(reporte);

        log.info(" Reporte creado | ID: {} | Bloque: {} | Salón: {} | Urgencia: {}",
                guardado.getId(), guardado.getNumeroBloque(),
                guardado.getSalon(), guardado.getUrgencia());

        return convertirADTO(guardado);
    }


    // ════════════════════════════════════════════════════════════════════════
    //  LECTURAS
    // ════════════════════════════════════════════════════════════════════════
    @Override
    @Transactional(readOnly = true)
    public ReporteResponseDTO obtenerPorId(Long id) {
        return convertirADTO(buscarOFallar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponseDTO> listarTodos() {
        return reporteRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponseDTO> buscarConFiltros(
            Integer bloque, EstadoReporte estado, Urgencia urgencia,
            Rol rol, String categoria) {

        return reporteRepository
                .buscarConFiltros(bloque, estado, urgencia, rol, categoria)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponseDTO> buscarPorBloque(Integer bloque) {
        return reporteRepository
                .findByNumeroBloqueOrderByFechaCreacionDesc(bloque)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponseDTO> buscarPorBloqueYSalon(Integer bloque, String salon) {
        return reporteRepository
                .findByNumeroBloqueAndSalonIgnoreCaseOrderByFechaCreacionDesc(bloque, salon)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReporteResponseDTO> obtenerEspaciosInhabilitados() {
        List<EstadoReporte> activos = List.of(EstadoReporte.PENDIENTE, EstadoReporte.EN_PROCESO);
        return reporteRepository
                .findByInhabilitadoTrueAndEstadoIn(activos)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }


    // ════════════════════════════════════════════════════════════════════════
    //  ACTUALIZAR ESTADO (panel admin)
    // ════════════════════════════════════════════════════════════════════════
    @Override
    @Transactional
    public ReporteResponseDTO actualizarEstado(Long id, ActualizarEstadoDTO dto) {
        Reporte reporte = buscarOFallar(id);

        EstadoReporte estadoAnterior = reporte.getEstado();
        reporte.setEstado(dto.getEstado());

        // Guardar la nota del admin si viene
        if (dto.getNotaAdmin() != null && !dto.getNotaAdmin().isBlank()) {
            reporte.setNotaAdmin(dto.getNotaAdmin().trim());
        }

        // Registrar la fecha exacta cuando se marca como resuelto
        if (dto.getEstado() == EstadoReporte.RESUELTO && reporte.getFechaResolucion() == null) {
            reporte.setFechaResolucion(LocalDateTime.now());
        }

        Reporte actualizado = reporteRepository.save(reporte);
        log.info("🔄 Reporte {} | {} → {}", id, estadoAnterior, dto.getEstado());

        return convertirADTO(actualizado);
    }


    // ════════════════════════════════════════════════════════════════════════
    //  ELIMINAR
    // ════════════════════════════════════════════════════════════════════════
    @Override
    @Transactional
    public void eliminar(Long id) {
        Reporte reporte = buscarOFallar(id);
        // Primero eliminar los archivos del servidor
        reporteRepository.delete(reporte);
        log.info(" Reporte {} eliminado", id);
    }


    // ════════════════════════════════════════════════════════════════════════
    //  ESTADÍSTICAS PARA EL DASHBOARD
    // ════════════════════════════════════════════════════════════════════════
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new LinkedHashMap<>();

        stats.put("total",        reporteRepository.count());
        stats.put("pendientes",   reporteRepository.countByEstado(EstadoReporte.PENDIENTE));
        stats.put("enProceso",    reporteRepository.countByEstado(EstadoReporte.EN_PROCESO));
        stats.put("resueltos",    reporteRepository.countByEstado(EstadoReporte.RESUELTO));
        stats.put("criticos",     reporteRepository.countByUrgencia(Urgencia.CRITICAL));

        stats.put("espaciosInhabilitados",
                reporteRepository.findByInhabilitadoTrueAndEstadoIn(
                        List.of(EstadoReporte.PENDIENTE, EstadoReporte.EN_PROCESO)).size());

        // Top bloques con más reportes
        List<Map<String, Object>> porBloque = reporteRepository.contarPorBloque()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("bloque", row[0]);
                    m.put("nombre", BLOQUES_UPB.getOrDefault((Integer) row[0], ""));
                    m.put("total",  row[1]);
                    return m;
                }).collect(Collectors.toList());
        stats.put("reportesPorBloque", porBloque);

        // Top categorías de daño
        List<Map<String, Object>> porCategoria = reporteRepository.contarPorCategoria()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("categoria", row[0]);
                    m.put("total",     row[1]);
                    return m;
                }).collect(Collectors.toList());
        stats.put("reportesPorCategoria", porCategoria);

        return stats;
    }


    // ════════════════════════════════════════════════════════════════════════
    //  MÉTODOS PRIVADOS DE APOYO
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Busca un reporte por ID. Si no existe, lanza una excepción
     * que el GlobalExceptionHandler convierte en HTTP 404.
     */
    private Reporte buscarOFallar(Long id) {
        return reporteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No se encontró ningún reporte con ID: " + id));
    }

    /**
     * Guarda los archivos en el sistema de archivos local.
     * Estructura: uploads/evidencias/bloque_{n}/{salon}/
     * Retorna las rutas relativas (para guardarlas en BD).
     */

    /**
     * Convierte una entidad Reporte al DTO de respuesta.
     * Se usa en todos los métodos de lectura.
     */
    private ReporteResponseDTO convertirADTO(Reporte r) {
        return ReporteResponseDTO.builder()
                .id(r.getId())
                .rol(r.getRol())
                .contacto(r.getContacto())
                .numeroBloque(r.getNumeroBloque())
                .nombreBloque(r.getNombreBloque())
                .salon(r.getSalon())
                .piso(r.getPiso())
                .inhabilitado(r.isInhabilitado())
                .categoria(r.getCategoria())
                .subcategoria(r.getSubcategoria())
                .descripcion(r.getDescripcion())
                .urgencia(r.getUrgencia())
                .estado(r.getEstado())
                .notaAdmin(r.getNotaAdmin())
                .fechaCreacion(r.getFechaCreacion())
                .fechaActualizacion(r.getFechaActualizacion())
                .fechaResolucion(r.getFechaResolucion())
                .build();
    }
}
