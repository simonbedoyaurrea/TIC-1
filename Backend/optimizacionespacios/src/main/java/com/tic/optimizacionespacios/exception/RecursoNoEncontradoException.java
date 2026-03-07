package com.tic.optimizacionespacios.exception;

/**
 * Se lanza cuando se busca un reporte por ID y no existe.
 * El GlobalExceptionHandler la convierte en una respuesta HTTP 404.
 */
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
