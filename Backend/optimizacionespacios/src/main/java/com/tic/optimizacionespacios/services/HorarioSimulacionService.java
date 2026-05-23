package com.tic.optimizacionespacios.services;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.tic.optimizacionespacios.dto.optimizador.OptimizadorRequestDTO;
import com.tic.optimizacionespacios.models.entities.HorarioSimulacion;
import com.tic.optimizacionespacios.repositories.HorarioSimulacionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HorarioSimulacionService {
    
    private final HorarioSimulacionRepository horarioSimulacionRepository;
    private static final Logger log = LoggerFactory.getLogger(HorarioSimulacionService.class);
    private final WebClient.Builder webClientBuilder;


    public void cargarExcelHorarios(MultipartFile file){

        validarArchivo(file);

        Workbook workbook;

        try {
            workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(file.getInputStream());
        } catch (Exception e){
            log.error("archivo excel invalido",e);
            throw new RuntimeException(
                "El archivo no es un Excel válido o está corrupto"
        );
        }

        try(workbook){
            Sheet sheet = workbook.getSheetAt(1);

            Row headerRow = sheet.getRow(0);

        if (headerRow == null) {

            throw new RuntimeException(
                    "El Excel no contiene encabezados"
            );
        }

              Map<String, Integer> columnas = new HashMap<>();

        for (org.apache.poi.ss.usermodel.Cell cell : headerRow) {

            columnas.put(
                    getCellValue(cell),
                    cell.getColumnIndex()
            );
        }

        // columnas requeridas
        List<String> columnasRequeridas = List.of(
                "CRN",
                "COURSE_NAME",
                "SESSION_VACANCIES",
                "ROOM_CODE",
                "BLOQUE",
                "SALÓN",
                "ROOM_VACANCIES",
                "INSTRUCTOR_CODE",
                "START_HOUR",
                "END_HOUR",
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY"
        );

        List<String> faltantes = columnasRequeridas
                .stream()
                .filter(c -> !columnas.containsKey(c))
                .toList();

        if (!faltantes.isEmpty()) {

            throw new RuntimeException(
                    "Faltan columnas obligatorias: " + faltantes
            );
        }

            List<HorarioSimulacion> horarios = new ArrayList<>();

            for (Row row : sheet) {

                if (row.getRowNum() == 0) continue; 

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

           log.info("Horarios cargados: " + horarios.size());  
        }      
        catch (Exception e) {
            log.error("Error cargando excel", e);

            throw new RuntimeException(
                    e.getMessage()
            );
        }

    }

    private void validarArchivo(MultipartFile file){

        if (file == null || file.isEmpty()){
             throw new RuntimeException(
                "Debe enviar un archivo Excel"
             );
        }

        String fileName = file.getOriginalFilename();

        if(fileName == null || (!fileName.endsWith(".xlsx") 
            && !fileName.endsWith(".xls"))){
         
                throw new RuntimeException(
                    "El archivo debe tener extension .xlsx o .xls"
                );
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
    List<HorarioSimulacion> horarios = horarioSimulacionRepository.findAll();

    Map<String, Object> body = Map.of(
        "df", horarios,
        "materia", request.getMateria(),
        "disponibilidad", request.getDisponibilidad()
    );

    return webClientBuilder.build()
            .post()
            .uri("http://localhost:8000/optimizar")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(body)
            .retrieve()
            .onStatus(HttpStatusCode::isError, clientResponse ->
                clientResponse.bodyToMono(String.class)
                    .map(err -> new RuntimeException("Error del servidor: " + err))
            )
            .bodyToMono(String.class)
            .doOnError(e -> log.error("Error optimizando horario", e))
            .block();
}

    public void agregarMateriaSimulacion(HorarioSimulacion horario) {
        horarioSimulacionRepository.save(horario);
    }

    public ByteArrayInputStream exportarExcel() {

        List<HorarioSimulacion> horarios = horarioSimulacionRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("horarios");

           
            Row headerRow = sheet.createRow(0);

            headerRow.createCell(0).setCellValue("TERM_CODE");
            headerRow.createCell(1).setCellValue("CRN");
            headerRow.createCell(2).setCellValue("COURSE_NAME");
            headerRow.createCell(3).setCellValue("SESSION_VACANCIES");
            headerRow.createCell(4).setCellValue("ROOM_CODE");
            headerRow.createCell(5).setCellValue("BLOQUE");
            headerRow.createCell(6).setCellValue("SALON");
            headerRow.createCell(7).setCellValue("ROOM_VACANCIES");
            headerRow.createCell(8).setCellValue("INSTRUCTOR_CODE");
            headerRow.createCell(9).setCellValue("START_HOUR");
            headerRow.createCell(10).setCellValue("END_HOUR");
            headerRow.createCell(11).setCellValue("START_DATE");
            headerRow.createCell(12).setCellValue("END_DATE");
            headerRow.createCell(13).setCellValue("MONDAY");
            headerRow.createCell(14).setCellValue("TUESDAY");
            headerRow.createCell(15).setCellValue("WEDNESDAY");
            headerRow.createCell(16).setCellValue("THURSDAY");
            headerRow.createCell(17).setCellValue("FRIDAY");
            headerRow.createCell(18).setCellValue("SATURDAY");
            headerRow.createCell(19).setCellValue("SUNDAY");
            // datos
            int rowIdx = 1;

            for (HorarioSimulacion horario : horarios) {

                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(2026);
                row.createCell(1).setCellValue(horario.getCrn());
                row.createCell(2).setCellValue(horario.getCourseName());
                row.createCell(3).setCellValue(horario.getSessionVacancies());
                row.createCell(4).setCellValue(horario.getRoomCode());
                row.createCell(5).setCellValue(horario.getBloque());
                row.createCell(6).setCellValue(horario.getSalon());
                row.createCell(7).setCellValue(horario.getRoomVacancies());
                row.createCell(8).setCellValue(horario.getInstructorCode());
                row.createCell(9).setCellValue(horario.getStartHour());
                row.createCell(10).setCellValue(horario.getEndHour());
                row.createCell(11).setCellValue("");
                row.createCell(12).setCellValue("");
                row.createCell(13).setCellValue(horario.getMonday());
                row.createCell(14).setCellValue(horario.getTuesday());
                row.createCell(15).setCellValue(horario.getWednesday());
                row.createCell(16).setCellValue(horario.getThursday());
                row.createCell(17).setCellValue(horario.getFriday());
                row.createCell(18).setCellValue(horario.getSaturday());
                row.createCell(19).setCellValue(horario.getSunday());
            }

            workbook.write(out);

            return new ByteArrayInputStream(out.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Error generando excel", e);
        }
    }
}
