-- UBICACIONES (Bloques)
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(1, 'Templo Universitario', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(2, 'Aula Magna Mons', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(3, 'Bloque Rectoral Mons', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(4, 'Colegio UPB Primaria y Preescolar', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(5, 'Colegio UPB Bachillerato', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(6, 'Escuela de Economía, Administración y Negocios', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(7, 'Escuela de Ciencias Sociales', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(8, 'Escuela de Arquitectura', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(9, 'Formación Avanzada', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(10, 'Escuela de Arquitectura', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(11, 'Escuela de Ingenierías', 8, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(12, 'Escuela de Derecho y Ciencias Políticas', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(13, 'Jardín de las Leyes', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(14, 'Centro de Atención Psicológica y enfermería de Bienestar Institucional', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(15, 'Biblioteca Central Mons', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(16, 'Canchas de fútbol sintéticas', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(17, 'Polideportivo UPB Mons', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(18, 'Bloque de Parqueaderos', 5, '');
INSERT INTO ubicaciones (bloque, nombre, pisos, referencia) VALUES(19, 'Puestos de Estudio Bulevar', 5, '');


-- RECURSOS
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (1, 'PROYECTOR', 'Proyector multimedia', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (2, 'COMPUTADORES', 'Computadores para estudiantes', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (3, 'TV', 'Television con acceso a HDMI', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (4, 'TABLERO_DIGITAL', 'Pantalla interactiva', true);
INSERT INTO recursos (id, nombre, descripcion, activo) VALUES (5, 'AIRE_ACONDICIONADO', 'Sistema de climatizacion', true);

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
VALUES (1, 1, 01,30, 11, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (2, 1, 02,25, 11, 'LABORATORIO', 'DISPONIBLE', 'Laboratorio basico', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (3, 1, 03,40, 11, 'AUDITORIO', 'DISPONIBLE', 'Auditorio pequeño', true);


-- BLOQUE 9

-- Primer piso
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (7, 1, 03,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Aula con buena iluminacion', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (8, 1, 04,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Laboratorio ciencias', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (9, 1, 05,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (10, 1, 06,30, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (11, 1, 07,29, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (12, 1, 12,28, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (13, 1, 13,33, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (14, 1, 14,31, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (15, 1, 15,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (16, 1, 16,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

-- Piso 2
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (17, 2, 01,20, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (18, 2, 05,19, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (19, 2, 06,20, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (20, 2, 08,34, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (21, 2, 9,19, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (22, 2, 10,18, 9, 'LABORATORIO_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (23, 2, 11,20, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (24, 3, 04,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (25, 3, 05,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (26, 3, 06,20, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (27, 3, 09,30, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (28, 3, 11,36, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (29, 3, 12,20, 9, 'LABORATORIO_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (30, 3, 13,17, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (31, 3, 14,20, 9, 'LABORATORIO_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (32, 3, 16,24, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (33, 3, 17,30, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (34, 3, 19,20, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (35, 3, 20,25, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

-- Piso 4
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (36, 4, 06,34, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);

--Piso 5
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (37, 5, 06,28, 9, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala con computadores', true);


-- BLOQUE 10
INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (4, 1, 01,30, 10, 'AULA', 'DISPONIBLE', 'Aula estandar', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (5, 1, 02,20, 10, 'SALA_COMPUTO', 'DISPONIBLE', 'Sala de computo secundaria', true);

INSERT INTO aulas (id, piso, numero_aula, capacidad_maxima, ubicacion_id, tipo_de_aula, estado_aula, observaciones, activo)
VALUES (6, 1, 03,50, 10, 'AUDITORIO', 'DISPONIBLE', 'Auditorio grande', true);


-- RELACION AULA - RECURSOS
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (1, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (2, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (2, 3);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (3, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (3, 4);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (6, 2);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (6, 1);

-- BLOQUE 9
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (7, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (7, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (8, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (8, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (9, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (9, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (10, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (10, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (11, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (11, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (12, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (12, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (13, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (13, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (14, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (14, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (15, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (15, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (16, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (16, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (17, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (17, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (18, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (18, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (19, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (19, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (20, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (20, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (21, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (21, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (22, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (22, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (23, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (23, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (24, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (24, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (25, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (25, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (26, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (26, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (27, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (27, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (28, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (28, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (29, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (30, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (30, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (31, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (32, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (32, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (33, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (33, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (34, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (34, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (35, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (35, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (36, 3);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (36, 2);

INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (37, 1);
INSERT INTO aula_recursos (aula_id, recurso_id) VALUES (37, 2);



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

-- PROGRAMACION I (Profesor 1 - Carlos)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (1, 1001, 1, 2, 1,
     '2026-02-01', '2026-06-01',
     '08:00:00', '10:00:00',
     120, 'LABORATORIO', 'APROBADO', 'MANUAL');

-- PROGRAMACION II (Profesor 2 - Laura)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (2, 1002, 2, 2, 2,
     '2026-02-01', '2026-06-01',
     '14:00:00', '16:00:00',
     120, 'LABORATORIO', 'APROBADO', 'MANUAL');

-- ESTRUCTURAS DE DATOS (Profesor 1)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (3, 1003, 3, 1, 1,
     '2026-02-01', '2026-06-01',
     '10:00:00', '12:00:00',
     120, 'CLASE', 'APROBADO', 'MANUAL');

-- BASES DE DATOS (Profesor 3)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (4, 1004, 4, 2, 3,
     '2026-02-01', '2026-06-01',
     '09:00:00', '11:00:00',
     120, 'LABORATORIO', 'APROBADO', 'MANUAL');

-- SISTEMAS OPERATIVOS (Profesor 9)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (5, 1005, 5, 2, 9,
     '2026-02-01', '2026-06-01',
     '08:00:00', '10:00:00',
     120, 'LABORATORIO', 'APROBADO', 'MANUAL');

-- REDES (Profesor 7)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (6, 1006, 6, 1, 7,
     '2026-02-01', '2026-06-01',
     '07:00:00', '09:00:00',
     120, 'CLASE', 'APROBADO', 'MANUAL');

-- INGENIERIA SOFTWARE (Profesor 6)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (7, 1007, 7, 3, 6,
     '2026-02-01', '2026-06-01',
     '09:00:00', '11:00:00',
     120, 'CLASE', 'APROBADO', 'MANUAL');

-- IA (Profesor 3)
INSERT INTO horarios_asignacion
(id, nrc, materia_id, aula_id, profesor_id,
 fecha_inicio, fecha_fin,
 hora_inicio, hora_fin,
 duracion_minutos, tipo_sesion, estado, origen)
VALUES
    (8, 1008, 9, 2, 3,
     '2026-02-01', '2026-06-01',
     '11:00:00', '13:00:00',
     120, 'LABORATORIO', 'APROBADO', 'MANUAL');


-- Dias Horario
INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (1, 'MONDAY'),
    (1, 'WEDNESDAY'),
    (1, 'FRIDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (2, 'TUESDAY'),
    (2, 'THURSDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (3, 'MONDAY'),
    (3, 'WEDNESDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (4, 'MONDAY'),
    (4, 'FRIDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (5, 'TUESDAY'),
    (5, 'THURSDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (6, 'MONDAY'),
    (6, 'WEDNESDAY'),
    (6, 'FRIDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (7, 'TUESDAY'),
    (7, 'THURSDAY');

INSERT INTO dias_horario (horario_id, dia_semana)
VALUES
    (8, 'MONDAY'),
    (8, 'WEDNESDAY');