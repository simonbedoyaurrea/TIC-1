package com.tic.optimizacionespacios.models.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name="horarios_simulacion")
@NoArgsConstructor
@AllArgsConstructor
public class HorarioSimulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int crn;

    private String courseName;

    private short sessionVacancies;

    private String roomCode;

    private String bloque;

    private short salon;

    private short roomVacancies;

    private int instructorCode;

    private short startHour;

    private short endHour;

    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;
    private String saturday;
    private String sunday;

}
