package com.tic.optimizacionespacios.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.dto.OptimizadorRequestDTO;
import com.tic.optimizacionespacios.models.entities.HorarioSimulacion;
import com.tic.optimizacionespacios.repositories.HorarioSimulacionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HorarioSimulacionService {
    
    private final HorarioSimulacionRepository horarioSimulacionRepository;
    private static final Logger log = LoggerFactory.getLogger(HorarioSimulacionService.class);


    public void cargarExcelHorarios(MultipartFile file){
        try (Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(file.getInputStream())){
            
            Sheet sheet = workbook.getSheetAt(1);

            List<HorarioSimulacion> horarios = new ArrayList<>();

            for (Row row : sheet) {

                if (row.getRowNum() == 0) continue; // saltar header

                HorarioSimulacion horario = new HorarioSimulacion();

                horario.setCrn(getIntCellValue(row.getCell(1)));
                horario.setCourseName(getCellValue(row.getCell(2)));
                horario.setSessionVacancies((short)getIntCellValue(row.getCell(3)));
                horario.setRoomCode(getCellValue(row.getCell(4)));
                horario.setBloque(getCellValue(row.getCell(5)));
                horario.setSalon((short)getIntCellValue(row.getCell(6)));
                horario.setRoomVacancies((short)getIntCellValue(row.getCell(7)));
                horario.setInstructorCode(getIntCellValue(row.getCell(8)));
                horario.setStartHour((short)getIntCellValue(row.getCell(9)));
                horario.setEndHour((short)getIntCellValue(row.getCell(10)));
                horario.setMonday(getCellValue(row.getCell(13)));
                horario.setTuesday(getCellValue(row.getCell(14)));
                horario.setWednesday(getCellValue(row.getCell(15)));
                horario.setThursday(getCellValue(row.getCell(16)));
                horario.setFriday(getCellValue(row.getCell(17)));
                horario.setSaturday(getCellValue(row.getCell(18)));
                horario.setSunday(getCellValue(row.getCell(19)));

                horarios.add(horario);
            }

            
            horarioSimulacionRepository.saveAll(horarios);

            System.out.println("Horarios cargados: " + horarios.size());
        }
        catch (Exception e) {
        }

    }

     private String getCellValue(org.apache.poi.ss.usermodel.Cell cell) {

        if (cell == null) return "";

        switch (cell.getCellType()) {

            case STRING:
                return cell.getStringCellValue().trim();

            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());

            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());

            case BLANK:
                return "";

            default:
                return "";
        }
    }

    private int getIntCellValue(org.apache.poi.ss.usermodel.Cell cell) {

        String value = getCellValue(cell);

        if (value.isEmpty()) {
            return 0;
        }

        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }


    public String optimizarHorario(OptimizadorRequestDTO request) {


        try {

            // 1️⃣ Obtener horarios actuales de la BD
            List<HorarioSimulacion> horarios = horarioSimulacionRepository.findAll();

            // 2️⃣ Construir JSON para FastAPI
            Map<String, Object> body = new HashMap<>();

            body.put("df", horarios);
            body.put("materia", request.getMateria());
            body.put("disponibilidad", request.getDisponibilidad());

            // 3️⃣ Crear cliente HTTP
            RestTemplate restTemplate = new RestTemplate();

            String url = "http://localhost:8000/optimizar";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            // 4️⃣ Llamar a FastAPI
            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            url,
                            requestEntity,
                            String.class
                    );

            // 5️⃣ devolver resultado
            return response.getBody();

        } catch (Exception e) {
            log.error("Error optimizando horario", e);
            throw new RuntimeException("Error optimizando horario", e);
        }
    }

    public void agregarMateriaSimulacion(HorarioSimulacion horario) {
        horarioSimulacionRepository.save(horario);
    }
}
