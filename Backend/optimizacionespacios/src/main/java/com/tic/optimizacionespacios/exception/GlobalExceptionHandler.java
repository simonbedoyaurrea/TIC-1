package com.tic.optimizacionespacios.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Captura todas las excepciones de la aplicación y las convierte
 * en respuestas JSON limpias con el código HTTP correcto.
 *
 * Sin esta clase, Spring devolvería páginas HTML de error (inútiles para el frontend).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 → Reporte no encontrado
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            RecursoNoEncontradoException ex) {
        return construirError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 400 → Validaciones fallidas (@Valid)
    // Devuelve un mapa campo → mensaje de error para cada campo inválido
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidacion(
            MethodArgumentNotValidException ex) {

        Map<String, String> erroresPorCampo = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String campo   = ((FieldError) error).getField();
            String mensaje = error.getDefaultMessage();
            erroresPorCampo.put(campo, mensaje);
        });

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status",    400);
        body.put("error",     "Datos inválidos");
        body.put("campos",    erroresPorCampo);  // qué campo falló y por qué
        return ResponseEntity.badRequest().body(body);
    }

    // 500 → Error inesperado del servidor
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(RuntimeException ex) {
        return construirError(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno del servidor: " + ex.getMessage());
    }

    // ── Método auxiliar ────────────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> construirError(
            HttpStatus status, String mensaje) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status",    status.value());
        body.put("error",     status.getReasonPhrase());
        body.put("mensaje",   mensaje);
        return ResponseEntity.status(status).body(body);
    }
}
