package com.tic.optimizacionespacios.models.mappers;

import com.tic.optimizacionespacios.dto.HorarioAsignacionRequestDTO;
import com.tic.optimizacionespacios.dto.HorarioAsignacionResponseDTO;
import com.tic.optimizacionespacios.models.entities.Aula;
import com.tic.optimizacionespacios.models.entities.DiaHorario;
import com.tic.optimizacionespacios.models.entities.HorarioAsignacion;
import com.tic.optimizacionespacios.models.entities.Profesor;
import com.tic.optimizacionespacios.models.enums.TipoSesion;

import java.util.List;

public class HorarioAsignacionMapper {
    private HorarioAsignacionMapper() {}

    public static HorarioAsignacion toEntity(
            HorarioAsignacionRequestDTO dto,
            Aula aula,
            Profesor profesor
    ) {
        HorarioAsignacion h = new HorarioAsignacion();
        h.setAula(aula);
        h.setProfesor(profesor);
        h.setFechaInicio(dto.getFechaInicio());
        h.setFechaFin(dto.getFechaFin());
        h.setHoraInicio(dto.getHoraInicio());
        h.setHoraFin(dto.getHoraFin());
        h.setDuracionMinutos(dto.getDuracionMinutos());
        h.setTipoSesion(TipoSesion.valueOf(dto.getTipoSesion()));
        h.setOrigen(dto.getOrigen());

        // Dias
        List<DiaHorario> dias = dto.getDiasSemana().stream()
                .map(dia -> {
                    DiaHorario d = new DiaHorario();
                    d.setDiaSemana(dia);
                    d.setHorarioAsignacion(h);
                    return d;
                })
                .toList();

        h.setDias(dias);

        return h;
    }

    public static HorarioAsignacionResponseDTO toResponse(
            HorarioAsignacion h
    ) {
        return new HorarioAsignacionResponseDTO(
                h.getId(),
                h.getAula().getId(),
                h.getProfesor().getId(),
                h.getProfesor().getNombreCompleto(),
                h.getFechaInicio(),
                h.getFechaFin(),
                h.getHoraInicio(),
                h.getHoraFin(),
                h.getDuracionMinutos(),
                h.getTipoSesion().name(),
                h.getEstado(),
                h.getDias().stream()
                        .map(DiaHorario::getDiaSemana)
                        .toList()
        );
    }
}
