package com.tic.optimizacionespacios.services;

import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.models.entities.MateriaSimulacion;
import com.tic.optimizacionespacios.repositories.MateriaSimulacionRepository;

@Service
public class MateriaSimulacionService {

    private final MateriaSimulacionRepository materiaSimRepo;

    public MateriaSimulacionService(MateriaSimulacionRepository materiaSimRepo){
        this.materiaSimRepo = materiaSimRepo;
    }

    public List<MateriaSimulacion> obtenerMateriasSimulacion() {
        return materiaSimRepo.findAll();
    }

    public void cargarExcelMaterias(MultipartFile file){

        try (Workbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            List<MateriaSimulacion> materias = new ArrayList<>();

            for (Row row : sheet) {

                if (row.getRowNum() == 0) continue; // saltar header

                MateriaSimulacion materia = new MateriaSimulacion();

                materia.setTermCod(getCellValue(row.getCell(0)));
                materia.setNombre(getCellValue(row.getCell(3)));
                materia.setSubjectCourseCode(getCellValue(row.getCell(4)));
                materia.setCreditos(getIntCellValue(row.getCell(11)));
                materia.setMetodoAsistencia(getCellValue(row.getCell(12)));
                materia.setModoCalificacion(getCellValue(row.getCell(13)));
                materia.setCurriculos(getCellValue(row.getCell(20)));
                materia.setVacantes(getIntCellValue(row.getCell(21)));
                materia.setCrn(getIntCellValue(row.getCell(8)));

                materias.add(materia);
            }

            // Guardar todas las materias de una vez (mucho más rápido)
            materiaSimRepo.saveAll(materias);

            System.out.println("Materias cargadas: " + materias.size());

        } catch (Exception e) {
            e.printStackTrace();
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
}