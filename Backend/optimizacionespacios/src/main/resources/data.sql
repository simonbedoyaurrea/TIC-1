-- UBICACIONES (Bloques)
INSERT INTO ubicaciones (id, bloque, nombre, imagen_url, pisos, referencia) VALUES(1, 11, 'Escuela de Ingenierías', 'https://www.upb.edu.co/es/imagenes/img-res-d-bloqueonceingenierias-cam-1464102729233.jpg', 8, '');
INSERT INTO ubicaciones (id, bloque, nombre, imagen_url, pisos, referencia) VALUES(2, 9, 'Formación Avanzada','https://www.upb.edu.co/es/imagenes/img-renovaci%C3%B3ninfraestructurainterna5-1464234549402.jpeg', 5, '');
INSERT INTO ubicaciones (id, bloque, nombre, imagen_url, pisos, referencia) VALUES(3, 10, 'Escuela de Arquitectura','https://images.homify.com/c_fill,f_auto,h_700,q_auto/v1505143247/p/photo/image/2222456/MAO_1601.jpg', 5, '');

-- RECURSOS
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (1, 'PROYECTOR', 'Proyector multimedia', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (2, 'COMPUTADORES', 'Computadores para estudiantes', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (3, 'TABLERO_DIGITAL', 'Pantalla interactiva', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (4, 'AIRE_ACONDICIONADO', 'Sistema de climatizacion', true);

-- MATERIAS
INSERT INTO materia (id, nombre, codigo, creditos, activo) VALUES
                                                               (1, 'Programacion I', 'INF101', 4, true),
                                                               (2, 'Programacion II', 'INF102', 4, true),
                                                               (3, 'Estructuras de Datos', 'INF201', 4, true),
                                                               (4, 'Bases de Datos', 'INF202', 4, true),
                                                               (5, 'Sistemas Operativos', 'INF301', 4, true),
                                                               (6, 'Redes de Computadores', 'INF302', 4, true),
                                                               (7, 'Ingenieria de Software', 'INF303', 3, true),
                                                               (8, 'Arquitectura de Software', 'INF401', 3, true),
                                                               (9, 'Inteligencia Artificial', 'INF402', 3, true),
                                                               (10, 'Desarrollo Web', 'INF304', 3, true),
                                                               (11, 'Machine Learning', 'INF403', 3, true),
                                                               (12, 'Seguridad Informatica', 'INF404', 3, true);

-- RELACION MATERIA - RECURSOS

-- Programacion I
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (1,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (1,1);

-- Programacion II
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (2,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (2,1);

-- Estructuras de Datos
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (3,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (3,1);

-- Bases de Datos
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (4,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (4,1);

-- Sistemas Operativos
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (5,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (5,1);

-- Redes
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (6,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (6,1);

-- Ingenieria de Software
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (7,1);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (7,3);

-- Arquitectura de Software
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (8,1);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (8,3);

-- Inteligencia Artificial
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (9,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (9,1);

-- Desarrollo Web
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (10,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (10,1);

-- Machine Learning
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (11,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (11,1);

-- Seguridad Informatica
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (12,2);
INSERT INTO materia_recursos (materia_id, recurso_id) VALUES (12,1);




-- AULAS (3 por bloque)

-- BLOQUE 11
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (1, 1, 01,30, 1, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (2, 1, 02,25, 1, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio basico', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (3, 1, 03,40, 1, 'AUDITORIO', 'DISPONIBLE', 'Auditorio pequeño', true);


-- BLOQUE 9
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (4, 1, 01,35, 2, 'AULA', 'DISPONIBLE', 'Aula con buena iluminacion', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (5, 1, 02,28, 2, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio ciencias', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (6, 1, 03,30, 2, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);


-- BLOQUE 10
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


-- PROFESORES
INSERT INTO profesores (id, nombre_completo, email_institucional, tipo_profesor, activo, observaciones) VALUES
                                                                                                            (1, 'Carlos Martinez', 'cmartinez@universidad.edu', 'PLANTA', true, 'Experto en algoritmos'),
                                                                                                            (2, 'Laura Rodriguez', 'lrodriguez@universidad.edu', 'CATEDRA', true, 'Especialista en bases de datos'),
                                                                                                            (3, 'Andres Gomez', 'agomez@universidad.edu', 'PLANTA', true, 'IA y Machine Learning'),
                                                                                                            (4, 'Sofia Herrera', 'sherrera@universidad.edu', 'CATEDRA', true, 'Desarrollo web'),
                                                                                                            (5, 'Miguel Torres', 'mtorres@universidad.edu', 'PLANTA', true, 'Arquitectura de software'),
                                                                                                            (6, 'Natalia Vargas', 'nvargas@universidad.edu', 'CATEDRA', true, 'Ingenieria de software'),
                                                                                                            (7, 'Daniel Castro', 'dcastro@universidad.edu', 'PLANTA', true, 'Redes y telecomunicaciones'),
                                                                                                            (8, 'Paula Jimenez', 'pjimenez@universidad.edu', 'CATEDRA', true, 'Bases de datos avanzadas'),
                                                                                                            (9, 'Ricardo Alvarez', 'ralvarez@universidad.edu', 'PLANTA', true, 'Sistemas operativos'),
                                                                                                            (10, 'Camila Moreno', 'cmoreno@universidad.edu', 'CATEDRA', true, 'Programacion orientada a objetos');

-- RELACION PROFESOR-MATERIA
INSERT INTO profesor_materia (profesor_id, materia_id) VALUES
                                                           (1,1),(1,2),
                                                           (2,2),(2,3),
                                                           (3,4),(3,5),
                                                           (4,1),(4,6),
                                                           (5,3),(5,4),
                                                           (6,2),(6,6),
                                                           (7,5),(7,6),
                                                           (8,2),(8,4),
                                                           (9,3),(9,5),
                                                           (10,1),(10,2);

-- DISPONIBILIDAD PROFESORES
INSERT INTO disponibilidad_profesor (profesor_id, dia_semana, hora_inicio, hora_fin, activo, observaciones) VALUES
                                                                                                                (1, 'MONDAY', '08:00:00', '12:00:00', true, 'Disponible mañana'),
                                                                                                                (1, 'WEDNESDAY', '10:00:00', '14:00:00', true, null),

                                                                                                                (2, 'TUESDAY', '14:00:00', '18:00:00', true, null),
                                                                                                                (2, 'THURSDAY', '08:00:00', '12:00:00', true, null),

                                                                                                                (3, 'MONDAY', '08:00:00', '11:00:00', true, null),
                                                                                                                (3, 'FRIDAY', '09:00:00', '13:00:00', true, null),

                                                                                                                (4, 'WEDNESDAY', '13:00:00', '18:00:00', true, null),

                                                                                                                (5, 'MONDAY', '10:00:00', '15:00:00', true, null),
                                                                                                                (5, 'THURSDAY', '08:00:00', '12:00:00', true, null),

                                                                                                                (6, 'TUESDAY', '09:00:00', '12:00:00', true, null),
                                                                                                                (6, 'FRIDAY', '14:00:00', '18:00:00', true, null),

                                                                                                                (7, 'MONDAY', '07:00:00', '10:00:00', true, null),
                                                                                                                (7, 'WEDNESDAY', '16:00:00', '20:00:00', true, null),

                                                                                                                (8, 'THURSDAY', '13:00:00', '18:00:00', true, null),

                                                                                                                (9, 'TUESDAY', '08:00:00', '12:00:00', true, null),
                                                                                                                (9, 'FRIDAY', '10:00:00', '14:00:00', true, null),

                                                                                                                (10, 'MONDAY', '14:00:00', '18:00:00', true, null),
                                                                                                                (10, 'WEDNESDAY', '08:00:00', '12:00:00', true, null);

-- HORARIOS ASIGNACION

INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (1, 1001, 1, 1, 1, '2026-02-01', '2026-06-30', '08:00:00', '10:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (2, 1002, 2, 2, 2, '2026-02-01', '2026-06-30', '14:00:00', '16:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (3, 1003, 3, 6, 5, '2026-02-01', '2026-06-30', '09:00:00', '11:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (4, 1004, 4, 6, 3, '2026-02-01', '2026-06-30', '10:00:00', '12:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (5, 1005, 5, 3, 9, '2026-02-01', '2026-06-30', '10:00:00', '12:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (6, 1006, 6, 4, 7, '2026-02-01', '2026-06-30', '07:00:00', '09:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (7, 1007, 7, 1, 6, '2026-02-01', '2026-06-30', '09:00:00', '11:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (8, 1008, 8, 7, 5, '2026-02-01', '2026-06-30', '08:00:00', '10:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (9, 1009, 9, 8, 3, '2026-02-01', '2026-06-30', '09:00:00', '11:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL'),

    (10, 1010, 10, 6, 4, '2026-02-01', '2026-06-30', '13:00:00', '15:00:00', 120, 'CLASE', 'APROBADO', 'MANUAL');

INSERT INTO dias_horario (id, dia_semana, horario_id) VALUES
                                                                    (1, 'MONDAY', 1),
                                                                    (2, 'WEDNESDAY', 1),

                                                                    (3, 'TUESDAY', 2),
                                                                    (4, 'THURSDAY', 2),

                                                                    (5, 'MONDAY', 3),

                                                                    (6, 'TUESDAY', 4),

                                                                    (7, 'FRIDAY', 5),

                                                                    (8, 'MONDAY', 6),

                                                                    (9, 'FRIDAY', 7),

                                                                    (10, 'THURSDAY', 8),

                                                                    (11, 'FRIDAY', 9),

                                                                    (12, 'WEDNESDAY', 10);