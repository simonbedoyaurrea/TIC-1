-- UBICACIONES (Bloques)
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (1, 9, 1, 'Cerca de la biblioteca');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (2, 9, 2, 'Frente a los ascensores');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (3, 9, 3, 'Pasillo norte');

INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (4, 10, 1, 'Entrada principal');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (5, 10, 2, 'Pasillo central');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (6, 10, 3, 'Cerca de las escaleras');

INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (7, 11, 1, 'Frente al laboratorio');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (8, 11, 2, 'Pasillo sur');
INSERT INTO ubicaciones (id, bloque, piso, referencia) VALUES (9, 11, 3, 'Cerca del auditorio');


-- RECURSOS
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (1, 'PROYECTOR', 'Proyector multimedia', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (2, 'COMPUTADORES', 'Computadores para estudiantes', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (3, 'TABLERO_DIGITAL', 'Pantalla interactiva', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (4, 'AIRE_ACONDICIONADO', 'Sistema de climatizacion', true);


-- AULAS (3 por bloque)

-- BLOQUE 9
INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (1, 30, 1, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (2, 25, 2, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio basico', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (3, 40, 3, 'AUDITORIO', 'DISPONIBLE', 'Auditorio pequeño', true);


-- BLOQUE 10
INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (4, 35, 4, 'AULA', 'DISPONIBLE', 'Aula con buena iluminacion', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (5, 28, 5, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio ciencias', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (6, 30, 6, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);


-- BLOQUE 11
INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (7, 30, 7, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (8, 20, 8, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala de computo secundaria', true);

INSERT INTO aulas (id, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (9, 50, 9, 'AUDITORIO', 'DISPONIBLE', 'Auditorio grande', true);


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