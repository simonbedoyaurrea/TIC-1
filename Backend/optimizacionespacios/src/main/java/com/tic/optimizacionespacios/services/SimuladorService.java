package com.tic.optimizacionespacios.services;

import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class SimuladorService {

    private final WebClient webClient;

    public SimuladorService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8000").build();
    }

     
    public String simular(
        MultipartFile asignaturas,
        MultipartFile docentesCat,
        MultipartFile disponibilidad,
        MultipartFile docAsignaturas,
        MultipartFile restriccionesEd,
        MultipartFile programacion,
        MultipartFile demandas){

        validarArchivo(asignaturas,      "asignaturas");
        validarArchivo(docentesCat,      "docentes_cat");
        validarArchivo(disponibilidad,   "disponibilidad");
        validarArchivo(docAsignaturas,   "doc_asignaturas");
        validarArchivo(restriccionesEd,  "restricciones_ed");
        validarArchivo(programacion,     "programacion");
        validarArchivo(demandas,         "demandas");

        MultipartBodyBuilder body = new MultipartBodyBuilder();

        body.part("asignaturas", asignaturas.getResource());
        body.part("docentes_cat", docentesCat.getResource());
        body.part("disponibilidad", disponibilidad.getResource());
        body.part("doc_asignaturas", docAsignaturas.getResource());
        body.part("restricciones_ed", restriccionesEd.getResource());
        body.part("programacion", programacion.getResource());
        body.part("demandas", demandas.getResource());

        return webClient.post()
                .uri("/optimizar")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(body.build()))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String estatusSimulacion(String jobid){
            return webClient.get()
                    .uri("/estado/"+ jobid)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
    }

    public byte[] resultadoSimulacion(String jobid){
            return webClient.get()
                    .uri("/resultado/"+jobid)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .block();       
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
