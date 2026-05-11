# Guía de Limpieza y Estandarización del Código Backend

Este README describe los problemas encontrados en el código base del backend y los cambios necesarios para hacerlo consistente, limpio y mantenible.

## Problemas Identificados

-

* **ReporteControlller.java**: Error tipográfico en el nombre de la clase. Debería ser `ReporteController.java`.
* **OptimizacionespaciosApplication.java**: El nombre de la clase es muy largo. Considera acortarlo a `OptimizacionesApplication` o similar.
* **prueba/** paquete: "prueba" significa "test" en español. Renombra a `testdata` o `initialization` para mayor claridad.

### 2. Uso Inconsistente de Lombok

- Las entidades usan `@Data` de Lombok.
- Los DTOs tienen getters y setters manuales.
- **Acción**: Agrega anotaciones de Lombok a los DTOs (ej. `@Data`) y elimina los métodos manuales.

### 3. Consistencia de Idioma

- El código está en inglés, pero algunos comentarios están en español (ej. "No esta desarrollada" en AulaController, "Se puede cambiar a numero de sillas" en Aula.java).
- **Acción**: Traduce todos los comentarios al inglés.

### 4. Código Comentado

- **DataInitializer.java**: Toda la clase está comentada. Decide si es necesaria; si no, elimínala.
- **AulaRepository.java**: Línea comentada `//boolean existsByCodigo(String codigo);` - elimina si no se usa.
- **application-dev.properties**: La configuración de PostgreSQL está comentada. Si no se necesita, elimínala.

### 5. Metadatos del Proyecto

- **pom.xml**: Etiquetas vacías `<licenses>`, `<developers>`, `<scm>`.
- **Acción**: Completa con valores apropiados o elimina las etiquetas vacías.

### 6. Versiones de Dependencias

- JJWT: La versión 0.11.5 está desactualizada. Actualiza a la última (0.12.x).
- Apache POI: Versión 5.2.5. Verifica actualizaciones.
- Spring Boot: Versión 4.0.3 (muy nueva, asegura compatibilidad).
- **Acción**: Actualiza a las versiones estables más recientes.

### 7. Seguridad

- **application.properties**: El secreto JWT es un placeholder (`optimu-dev-secret-please-change-32-bytes-min`). Cámbialo para producción.
- **Acción**: Usa variables de entorno o gestión segura de secretos.

### 8. Pruebas

- Solo existe el `OptimizacionespaciosApplicationTests.java` por defecto.
- No hay pruebas unitarias para servicios, controladores, etc.
- **Acción**: Agrega pruebas unitarias e integrales exhaustivas.

### 9. Calidad del Código

- Algunos métodos tienen comentarios tipo TODO pero no TODOs reales.
- Formateo inconsistente en algunos archivos (ej. espaciado en dependencias de pom.xml).
- **Acción**: Ejecuta un formateador de código (ej. Google Java Style) y un linter.

### 10. Características No Utilizadas o Incompletas

- AulaController tiene el comentario "No esta desarrollada" - implementa o elimina métodos incompletos.
- Comentario en Aula.java sobre cambiar a "numero de sillas" - decide el nombre del campo y actualiza.

### 11. Configuración

- **application-dev.properties**: El modo de inicialización SQL es `always` para dev, lo cual está bien, pero asegura que data.sql sea apropiado.
- Límites de multipart establecidos en 50MB - verifica si son necesarios.

## Acciones Recomendadas

1. **Corregir Errores Tipográficos y Nombres**:
   - Renombra `ReporteControlller.java` a `ReporteController.java`.
   - Renombra el paquete `prueba` a `initialization`.

2. **Estandarizar el Uso de Lombok**:
   - Agrega `@Data` a todos los DTOs y elimina getters/setters manuales.

3. **Traducir Comentarios**:
   - Cambia los comentarios en español al inglés.

4. **Limpiar Código**:
   - Elimina código comentado.
   - Elimina importaciones no utilizadas (ejecuta una herramienta como "Optimize Imports" de IntelliJ).

5. **Actualizar Dependencias**:
   - Actualiza pom.xml con las versiones más recientes.
   - Elimina etiquetas vacías.

6. **Mejorar Seguridad**:
   - Usa secretos JWT seguros.

7. **Agregar Pruebas**:
   - Escribe pruebas unitarias para todos los servicios y controladores.
   - Agrega pruebas de integración.

8. **Formateo de Código**:
   - Usa un estilo de código consistente (ej. Guía de Estilo Java de Google).
   - Asegura indentación y espaciado consistentes.

9. **Revisar e Implementar Características Incompletas**:
   - Completa cualquier método parcialmente implementado.

10. **Documentación**:
    - Agrega JavaDoc a todos los métodos y clases públicas.

## Herramientas a Usar

- **Formateador de Código**: Google Java Format o el formateador integrado de IntelliJ.
- **Linter**: SpotBugs o SonarQube.
- **Framework de Pruebas**: JUnit 5, Mockito para mocking.
- **Verificador de Dependencias**: OWASP Dependency Check para vulnerabilidades.

## Notas Finales

Después de hacer estos cambios, ejecuta la aplicación y las pruebas para asegurar que todo funcione. Considera usar CI/CD para imponer verificaciones de calidad de código.</content>
<parameter name="filePath">c:\Users\USER\Documents\TIC-1\Backend\optimizacionespacios\README.md
