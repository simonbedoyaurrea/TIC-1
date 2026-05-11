package com.tic.optimizacionespacios.dto;

import java.util.List;

import lombok.Data;

@Data
public class NuevaMateriaDTO {

    private String id;

    private int docente;

    private int demanda;

    private int duracion;

    private List<Integer> dias;

    private List<String> salonesPermitidos;

}
