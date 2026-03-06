package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.MateriaRequestDTO;
import com.tic.optimizacionespacios.dto.MateriaResponseDTO;
import com.tic.optimizacionespacios.models.entities.Materia;
import com.tic.optimizacionespacios.models.entities.Recurso;

import java.util.Set;

public class MateriaMapper {
    private MateriaMapper(){}

    public static Materia toEntity(MateriaRequestDTO materiaRequestDTO, Set<Recurso> recursos){
        Materia materia = new Materia();
        materia.setNombre(materiaRequestDTO.getNombre());
        materia.setRecursosNecesarios(recursos);
        materia.setCodigo(materiaRequestDTO.getCodigo());
        materia.setCreditos(materiaRequestDTO.getCreditos());
        materia.setActivo(true);

        return materia;
    }

    public static MateriaResponseDTO toResponse(Materia materia){
        return new MateriaResponseDTO(
                materia.getId(),
                materia.getNombre(),
                materia.getRecursosNecesarios()
                        .stream()
                        .map(RecursoMapper::toResponse)
                        .toList(),
                materia.getCreditos()
        );
    }
}
