package com.tic.optimizacionespacios.dto;

import com.tic.optimizacionespacios.enums.Rol;
import com.tic.optimizacionespacios.enums.Urgencia;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO de ENTRADA: lo que manda el frontend al crear un reporte.
 * Spring valida automáticamente cada campo antes de llegar al servicio.
 */
@Data
public class ReporteRequestDTO {

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

    // Correo opcional — si viene, debe tener formato válido
    @Email(message = "El correo no tiene un formato válido")
    private String contacto;

    @NotNull(message = "El número de bloque es obligatorio")
    @Min(value = 1, message = "El número de bloque debe ser mayor a 0")
    private Integer numeroBloque;

    @NotBlank(message = "El salón es obligatorio")
    @Size(max = 100, message = "El salón no puede superar 100 caracteres")
    private String salon;

    @Size(max = 50, message = "El piso no puede superar 50 caracteres")
    private String piso;

    // false por defecto si no se envía
    private boolean inhabilitado;

    @NotBlank(message = "La categoría del daño es obligatoria")
    private String categoria;

    @NotBlank(message = "El elemento específico es obligatorio")
    private String subcategoria;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 2000,
            message = "La descripción debe tener entre 10 y 2000 caracteres")
    private String descripcion;

    @NotNull(message = "La urgencia es obligatoria")
    private Urgencia urgencia;
}
