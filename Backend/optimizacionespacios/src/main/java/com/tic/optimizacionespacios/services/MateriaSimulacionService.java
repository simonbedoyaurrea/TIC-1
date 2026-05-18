package com.tic.optimizacionespacios.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tic.optimizacionespacios.models.entities.MateriaSimulacion;
import com.tic.optimizacionespacios.repositories.MateriaSimulacionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MateriaSimulacionService {

    private final MateriaSimulacionRepository materiaSimRepo;

   

    public List<MateriaSimulacion> obtenerMateriasSimulacion() {
        return materiaSimRepo.findAll();
    }

    // Columnas requeridas: índice -> nombre esperado
    private static final Map<Integer, String> COLUMNAS_REQUERIDAS_MATERIAS = Map.of(
        0,  "TERM_COD",
        3,  "NOMBRE",
        4,  "SUBJECT_COURSE_CODE",
        8,  "CRN",
        11, "CREDITOS",
        12, "METODO_ASISTENCIA",
        13, "MODO_CALIFICACION",
        20, "CURRICULOS",
        21, "VACANTES"
    );

    public void cargarExcelMaterias(MultipartFile file) {

    // 1. Validar archivo (extensión, no vacío)
    validarArchivo(file, "materias");

    try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

        Sheet sheet = workbook.getSheetAt(0);

        // 2. Validar columnas
        validarColumnas(sheet, COLUMNAS_REQUERIDAS_MATERIAS, "materias");

        List<MateriaSimulacion> materias = new ArrayList<>();

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue;

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

        materiaSimRepo.saveAll(materias);

    } catch (RuntimeException e) {
        throw e; 
    } catch (Exception e) {
        throw new RuntimeException("Error al procesar el archivo de materias", e);
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

    private void validarColumnas(Sheet sheet, Map<Integer, String> columnasRequeridas, String nombreArchivo) {
    Row header = sheet.getRow(0);

    if (header == null) {
        throw new RuntimeException(
            "El archivo '" + nombreArchivo + "' no tiene encabezados"
        );
    }

    List<String> columnasFaltantes = new ArrayList<>();

    columnasRequeridas.forEach((indice, nombreColumna) -> {
        Cell celda = header.getCell(indice);
        String valorCelda = celda != null ? celda.getStringCellValue().trim() : null;

        if (valorCelda == null || valorCelda.isEmpty()) {
            columnasFaltantes.add("'" + nombreColumna + "' (columna " + (indice + 1) + ")");
        }
    });

    if (!columnasFaltantes.isEmpty()) {
        throw new RuntimeException(
            "El archivo '" + nombreArchivo + "' tiene columnas faltantes: " + 
            String.join(", ", columnasFaltantes)
        );
    }
}

    private void validarArchivo(MultipartFile file, String nombreCampo) {
    if (file == null || file.isEmpty()) {
        throw new RuntimeException(
            "El archivo '" + nombreCampo + "' es obligatorio"
        );
    }

    String fileName = file.getOriginalFilename();
    if (fileName == null || (!fileName.endsWith(".xlsx") 
            && !fileName.endsWith(".xls"))) {
        throw new RuntimeException(
            "El archivo '" + nombreCampo + "' debe tener extensión .xlsx o .xls"
        );
    }
}
}