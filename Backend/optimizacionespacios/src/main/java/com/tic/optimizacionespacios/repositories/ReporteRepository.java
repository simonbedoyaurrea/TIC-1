package com.tic.optimizacionespacios.repositories;

import com.tic.optimizacionespacios.enums.EstadoReporte;
import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import com.tic.optimizacionespacios.models.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Long> {

    // ── Búsquedas directas ─────────────────────────────────────────────────

    // Todos los reportes de un bloque, los más recientes primero
    List<Reporte> findByNumeroBloqueOrderByFechaCreacionDesc(Integer numeroBloque);

    // Reportes de un salón específico dentro de un bloque (ignora mayúsculas)
    List<Reporte> findByNumeroBloqueAndSalonIgnoreCaseOrderByFechaCreacionDesc(
            Integer numeroBloque, String salon);

    // Por estado
    List<Reporte> findByEstadoOrderByFechaCreacionDesc(EstadoReporte estado);

    // Por urgencia
    List<Reporte> findByUrgenciaOrderByFechaCreacionDesc(Urgencia urgencia);

    // Por rol del reportante
    List<Reporte> findByRolOrderByFechaCreacionDesc(Rol rol);

    // Espacios inhabilitados que aún no están resueltos
    List<Reporte> findByInhabilitadoTrueAndEstadoIn(List<EstadoReporte> estados);


    // ── Búsqueda combinada (panel admin con filtros opcionales) ───────────
    /**
     * Todos los parámetros son opcionales.
     * Si un parámetro llega null, ese filtro se omite.
     * Los resultados se ordenan por urgencia (crítica primero) y fecha.
     */
    @Query("""
        SELECT r FROM Reporte r
        WHERE (:bloque    IS NULL OR r.numeroBloque = :bloque)
          AND (:estado    IS NULL OR r.estado       = :estado)
          AND (:urgencia  IS NULL OR r.urgencia     = :urgencia)
          AND (:rol       IS NULL OR r.rol          = :rol)
          AND (:categoria IS NULL OR LOWER(r.categoria) LIKE LOWER(CONCAT('%', :categoria, '%')))
        ORDER BY
            CASE r.urgencia
                WHEN 'CRITICAL' THEN 1
                WHEN 'HIGH'     THEN 2
                WHEN 'MEDIUM'   THEN 3
                WHEN 'LOW'      THEN 4
            END,
            r.fechaCreacion DESC
        """)
    List<Reporte> buscarConFiltros(
            @Param("bloque")    Integer       bloque,
            @Param("estado")    EstadoReporte estado,
            @Param("urgencia")  Urgencia      urgencia,
            @Param("rol")       Rol           rol,
            @Param("categoria") String        categoria
    );


    // ── Conteos para el dashboard ──────────────────────────────────────────

    long countByEstado(EstadoReporte estado);

    long countByUrgencia(Urgencia urgencia);

    // Cuántos reportes tiene cada bloque → para el ranking
    @Query("SELECT r.numeroBloque, COUNT(r) FROM Reporte r GROUP BY r.numeroBloque ORDER BY COUNT(r) DESC")
    List<Object[]> contarPorBloque();

    // Cuántos reportes hay por categoría de daño
    @Query("SELECT r.categoria, COUNT(r) FROM Reporte r GROUP BY r.categoria ORDER BY COUNT(r) DESC")
    List<Object[]> contarPorCategoria();
}
