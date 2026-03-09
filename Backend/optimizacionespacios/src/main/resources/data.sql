-- UBICACIONES (Bloques)
INSERT INTO ubicaciones (id, bloque, nombre, pisos, referencia) VALUES(1, 11, 'Escuela de Ingenierías', 8, '');
INSERT INTO ubicaciones (id, bloque, nombre, pisos, referencia) VALUES(2, 9, 'Formación Avanzada', 5, '');
INSERT INTO ubicaciones (id, bloque, nombre, pisos, referencia) VALUES(3, 10, 'Escuela de Arquitectura', 5, '');

-- RECURSOS
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (1, 'PROYECTOR', 'Proyector multimedia', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (2, 'COMPUTADORES', 'Computadores para estudiantes', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (3, 'TABLERO_DIGITAL', 'Pantalla interactiva', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (4, 'AIRE_ACONDICIONADO', 'Sistema de climatizacion', true);


-- AULAS (3 por bloque)

-- BLOQUE 9
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (1, 1, 01,30, 1, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (2, 1, 02,25, 1, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio basico', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (3, 1, 03,40, 1, 'AUDITORIO', 'DISPONIBLE', 'Auditorio pequeño', true);


-- BLOQUE 10
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (4, 1, 01,35, 2, 'AULA', 'DISPONIBLE', 'Aula con buena iluminacion', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (5, 1, 02,28, 2, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio ciencias', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (6, 1, 03,30, 2, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);


-- BLOQUE 11
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (7, 1, 01,30, 3, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (8, 1, 02,20, 3, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala de computo secundaria', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (9, 1, 03,50, 3, 'AUDITORIO', 'DISPONIBLE', 'Auditorio grande', true);


-- RELACION AULA - RECURSOS
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (1, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (2, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (2, 3);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (3, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (3, 4);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (6, 2);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (6, 1);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (8, 2);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (9, 1);

SELECT * FROM ubicaciones;