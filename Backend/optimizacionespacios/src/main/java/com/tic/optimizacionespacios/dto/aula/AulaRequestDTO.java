package com.tic.optimizacionespacios.dto.aula;

import lombok.Data;

@Data
public class AulaRequestDTO {
    private Integer piso;
    private Integer numeroAula;
    private Integer capacidad;
    private String tipo;   // AULA | LABORATORIO
    private String estado; // DISPONIBLE | MANTENIMIENTO | NO_DISPONIBLE
    private Long idUbicacion;

  
}