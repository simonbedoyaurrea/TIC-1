# Sistema de Optimización de Horarios Universitarios — UPB

## 📋 Descripción General

Este proyecto es un **sistema de optimización de horarios** para una universidad que utiliza **programación por restricciones (Constraint Programming)** mediante Google OR-Tools. El algoritmo genera automáticamente asignaciones de clases a aulas, horarios y docentes, respetando múltiples restricciones académicas y operacionales.

---

## 🎯 ¿Qué hace el algoritmo?

El algoritmo resuelve el problema clásico de **generación de horarios universitarios**:

- **Entrada**: Información de grupos, docentes, aulas, cursos y requisitos
- **Proceso**: Busca la mejor asignación respetando restricciones (disponibilidad de aulas, conflictos de docentes, capacidad, etc.)
- **Salida**: Archivo Excel con el horario optimizado

### Características clave:

✅ Asignación automática de horarios y aulas  
✅ Respeta disponibilidad de docentes  
✅ Considera capacidad de aulas  
✅ Optimiza patrones de días (lunes-miércoles-viernes, etc.)  
✅ Valida conflictos antes de generar soluciones  
✅ Genera reportes de validación detallados

---

## 📦 Instalación

### 1. **Requisitos previos**

- Python 3.8 o superior
- pip (gestor de paquetes)

### 2. **Clonar/descargar el proyecto**

```bash
cd apijulian
```

### 3. **Instalar dependencias**

```bash
pip install -r requirements.txt
```

### 4. **Preparar datos de entrada**

Coloca tu archivo Excel con los datos en:

```
data/input/
```

---

## 🚀 Uso del Algoritmo

### **Opción 1: Ejecutar optimización completa**

```bash
python main.py
```

Parámetros opcionales:

```bash
# Con tiempo límite personalizado (en segundos)
python main.py --tiempo 7200

# Limitar número de grupos para pruebas rápidas
python main.py --max-grupos 5

# Especificar ruta de salida personalizada
python main.py --output data/output/mi_horario.xlsx

# Combinar parámetros
python main.py --tiempo 3600 --max-grupos 10 --output ./resultado.xlsx
```

**Parámetros disponibles:**

| Parámetro        | Tipo | Default | Descripción                                                |
| ---------------- | ---- | ------- | ---------------------------------------------------------- |
| `--tiempo`       | int  | 14400   | Tiempo límite del solver en segundos (4 horas por defecto) |
| `--max-grupos`   | int  | None    | Limitar cantidad de grupos (útil para pruebas)             |
| `--solo-validar` | flag | -       | Solo valida Excel existente sin optimizar                  |
| `--output`       | str  | None    | Ruta personalizada para archivo de salida                  |

### **Opción 2: Solo validar un Excel existente**

```bash
python main.py --solo-validar
```

Valida el archivo de salida sin ejecutar la optimización nuevamente.

---

## 🌐 Uso de la API

La API permite ejecutar el optimizador de forma remota mediante peticiones HTTP. Ideal para integración con aplicaciones web, sistemas externos o dashboards.

### **1. Iniciar el servidor API**

```bash
python -m uvicorn src.api:app --host 0.0.0.0 --port 8000
```

La API estará disponible en:

- 🔗 **URL**: `http://localhost:8000`
- 📚 **Documentación interactiva**: `http://localhost:8000/docs` (Swagger UI)
- 📖 **Documentación alternativa**: `http://localhost:8000/redoc` (ReDoc)

### **2. Endpoints disponibles**

#### **a) Verificar estado del servidor**

```bash
curl http://localhost:8000/health
```

Respuesta:

```json
{ "estado": "ok", "timestamp": "2026-05-02T10:30:45.123456" }
```

#### **b) Enviar archivos para optimización** ⭐ **Principal**

```bash
curl -X POST http://localhost:8000/optimizar \
  -F "tiempo_limite=14400" \
  -F "asignaturas=@data/input/asignaturas.xlsx" \
  -F "docentes_cat=@data/input/docentes_cat.xlsx" \
  -F "disponibilidad=@data/input/disponibilidad.xlsx" \
  -F "doc_asignaturas=@data/input/doc_asignaturas.xlsx" \
  -F "restricciones_ed=@data/input/restricciones_ed.xlsx" \
  -F "programacion=@data/input/programacion.xlsx" \
  -F "demandas=@data/input/demandas.xlsx"
```

**Respuesta (HTTP 202 - Accepted):**

```json
{
  "job_id": "a1b2c3d4",
  "mensaje": "Optimización iniciada. Consulta el estado en /estado/{job_id}",
  "estado_url": "/estado/a1b2c3d4",
  "resultado_url": "/resultado/a1b2c3d4"
}
```

**Parámetros:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `tiempo_limite` | int | No | Segundos máximos (default: 14400) |
| `asignaturas` | File | Sí | Catálogo de asignaturas |
| `docentes_cat` | File | Sí | Catálogo de docentes |
| `disponibilidad` | File | Sí | Disponibilidad de docentes |
| `doc_asignaturas` | File | Sí | Docentes-asignaturas |
| `restricciones_ed` | File | Sí | Restricciones de edificios |
| `programacion` | File | Sí | Datos de programación |
| `demandas` | File | Sí | Demandas de grupos |

#### **c) Consultar estado de un trabajo**

```bash
curl http://localhost:8000/estado/a1b2c3d4
```

**Respuesta:**

```json
{
  "job_id": "a1b2c3d4",
  "estado": "en_proceso",
  "mensaje": "Optimizando horarios (CP-SAT)...",
  "gap": null,
  "confirmados": null,
  "pendientes": null,
  "creado_en": "2026-05-02T10:30:45.123456"
}
```

**Estados posibles:**

- `"en_proceso"` - Ejecutándose
- `"listo"` - Completado exitosamente
- `"error"` - Falló (revisar `mensaje`)

#### **d) Descargar resultado cuando está listo**

```bash
curl -O http://localhost:8000/resultado/a1b2c3d4
```

O desde una aplicación:

```python
import requests

response = requests.get('http://localhost:8000/resultado/a1b2c3d4')
with open('resultado.xlsx', 'wb') as f:
    f.write(response.content)
```

#### **e) Validar un Excel existente**

```bash
curl -X POST http://localhost:8000/validar \
  -F "excel=@data/output/asignacion_banner.xlsx"
```

**Respuesta:**

```json
{
  "ok": true,
  "reporte": "✓ Validación completada...\n- Aulas: OK\n- Docentes: OK\n..."
}
```

### **3. Ejemplo completo en Python**

```python
import requests
import time

# Archivos a subir
archivos = {
    'asignaturas': open('data/input/asignaturas.xlsx', 'rb'),
    'docentes_cat': open('data/input/docentes_cat.xlsx', 'rb'),
    'disponibilidad': open('data/input/disponibilidad.xlsx', 'rb'),
    'doc_asignaturas': open('data/input/doc_asignaturas.xlsx', 'rb'),
    'restricciones_ed': open('data/input/restricciones_ed.xlsx', 'rb'),
    'programacion': open('data/input/programacion.xlsx', 'rb'),
    'demandas': open('data/input/demandas.xlsx', 'rb'),
}

datos = {'tiempo_limite': 14400}

# 1. Enviar solicitud de optimización
print("📤 Enviando solicitud de optimización...")
response = requests.post('http://localhost:8000/optimizar',
                        data=datos, files=archivos)
resultado = response.json()
job_id = resultado['job_id']
print(f"✅ Job iniciado: {job_id}")

# 2. Esperar a que termine (polling)
print("⏳ Esperando resultado...")
while True:
    estado = requests.get(f'http://localhost:8000/estado/{job_id}').json()
    if estado['estado'] == 'listo':
        print(f"✅ ¡Listo! Gap: {estado['gap']}, Confirmados: {estado['confirmados']}")
        break
    elif estado['estado'] == 'error':
        print(f"❌ Error: {estado['mensaje']}")
        break
    else:
        print(f"  {estado['mensaje']}")
        time.sleep(5)

# 3. Descargar resultado
if estado['estado'] == 'listo':
    print("📥 Descargando resultado...")
    excel = requests.get(f'http://localhost:8000/resultado/{job_id}')
    with open(f'resultado_{job_id}.xlsx', 'wb') as f:
        f.write(excel.content)
    print("✅ Archivo guardado")
```

### **4. Ejemplo en JavaScript/Node.js**

```javascript
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

const API_URL = "http://localhost:8000";

async function optimizarHorarios() {
  // 1. Crear FormData con archivos
  const form = new FormData();
  form.append("tiempo_limite", "14400");
  form.append(
    "asignaturas",
    fs.createReadStream("data/input/asignaturas.xlsx"),
  );
  form.append(
    "docentes_cat",
    fs.createReadStream("data/input/docentes_cat.xlsx"),
  );
  form.append(
    "disponibilidad",
    fs.createReadStream("data/input/disponibilidad.xlsx"),
  );
  form.append(
    "doc_asignaturas",
    fs.createReadStream("data/input/doc_asignaturas.xlsx"),
  );
  form.append(
    "restricciones_ed",
    fs.createReadStream("data/input/restricciones_ed.xlsx"),
  );
  form.append(
    "programacion",
    fs.createReadStream("data/input/programacion.xlsx"),
  );
  form.append("demandas", fs.createReadStream("data/input/demandas.xlsx"));

  // 2. Enviar optimización
  console.log("📤 Enviando solicitud...");
  const response = await axios.post(`${API_URL}/optimizar`, form, {
    headers: form.getHeaders(),
  });
  const jobId = response.data.job_id;
  console.log(`✅ Job iniciado: ${jobId}`);

  // 3. Esperar resultado
  console.log("⏳ Esperando resultado...");
  let estado = "en_proceso";
  while (estado !== "listo" && estado !== "error") {
    const check = await axios.get(`${API_URL}/estado/${jobId}`);
    estado = check.data.estado;
    console.log(`  ${check.data.mensaje}`);
    if (estado === "listo") break;
    await new Promise((r) => setTimeout(r, 5000));
  }

  // 4. Descargar archivo
  if (estado === "listo") {
    console.log("📥 Descargando resultado...");
    const file = await axios.get(`${API_URL}/resultado/${jobId}`, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(`resultado_${jobId}.xlsx`, file.data);
    console.log("✅ Archivo guardado");
  }
}

optimizarHorarios().catch(console.error);
```

### **5. Ejemplo con cURL (bash script)**

```bash
#!/bin/bash

API_URL="http://localhost:8000"

# 1. Enviar archivos
echo "📤 Enviando solicitud..."
response=$(curl -s -X POST "$API_URL/optimizar" \
  -F "tiempo_limite=14400" \
  -F "asignaturas=@data/input/asignaturas.xlsx" \
  -F "docentes_cat=@data/input/docentes_cat.xlsx" \
  -F "disponibilidad=@data/input/disponibilidad.xlsx" \
  -F "doc_asignaturas=@data/input/doc_asignaturas.xlsx" \
  -F "restricciones_ed=@data/input/restricciones_ed.xlsx" \
  -F "programacion=@data/input/programacion.xlsx" \
  -F "demandas=@data/input/demandas.xlsx")

job_id=$(echo $response | jq -r '.job_id')
echo "✅ Job iniciado: $job_id"

# 2. Esperar resultado
echo "⏳ Esperando resultado..."
while true; do
  estado=$(curl -s "$API_URL/estado/$job_id" | jq -r '.estado')
  mensaje=$(curl -s "$API_URL/estado/$job_id" | jq -r '.mensaje')
  echo "  $mensaje"

  if [ "$estado" = "listo" ]; then
    echo "✅ ¡Listo!"
    break
  elif [ "$estado" = "error" ]; then
    echo "❌ Error: $mensaje"
    exit 1
  fi

  sleep 5
done

# 3. Descargar resultado
echo "📥 Descargando resultado..."
curl -o "resultado_$job_id.xlsx" "$API_URL/resultado/$job_id"
echo "✅ Archivo guardado: resultado_$job_id.xlsx"
```

---

## 📊 Estructura de Datos

### **Entrada esperada** (`data/input/`)

El proyecto espera un archivo Excel con las siguientes hojas:

1. **Catálogo de Asignaturas**: Cursos disponibles
2. **Demandas**: Grupos de estudiantes a programar
3. **Docentes**: Disponibilidad de profesores
4. **Aulas**: Capacidad y características de salones
5. **Asignaturas Raw**: Información detallada de materias

### **Salida generada** (`data/output/`)

```
asignacion_banner.xlsx
```

Archivo con la asignación optimizada de horarios.

---

## 🔧 Componentes del Sistema

### **`src/optimizer.py`**

- **Núcleo del algoritmo**: Utiliza OR-Tools para resolver el problema de restricciones
- Define restricciones (conflictos de docentes, capacidad de aulas, etc.)
- Busca la solución óptima respetando todas las limitaciones

### **`src/validator.py`**

- Valida que la solución sea válida
- Detects conflictos y problemas en la asignación
- Genera reportes de validación

### **`src/data_loader.py`**

- Carga datos del Excel de entrada
- Prepara información para el optimizer

### **`src/api.py`**

- API FastAPI para ejecutar el optimizer de forma remota
- Permite integración con sistemas externos

### **`main.py`**

- Punto de entrada principal
- Coordina todos los módulos

---

## 📈 Ejemplo de Uso Paso a Paso

### **Paso 1: Preparar datos**

```bash
# Copia tu archivo Excel con datos a:
# data/input/catalogo.xlsx
```

### **Paso 2: Ejecutar optimización**

```bash
# Ejecución rápida (primero intenta con pocos grupos)
python main.py --tiempo 1800 --max-grupos 5

# Ejecución completa (toma más tiempo)
python main.py --tiempo 14400
```

### **Paso 3: Revisar resultados**

```bash
# El archivo optimizado estará en:
# data/output/asignacion_banner.xlsx
```

### **Paso 4: Validar solución**

```bash
# Para validar el resultado sin reintentar
python main.py --solo-validar
```

---

## ⚙️ Algoritmo de Solución

### **Tipo de algoritmo**

**Constraint Programming (CP)** mediante Google OR-Tools

### **Cómo funciona:**

1. **Definición del problema**: Se crean variables para cada grupo (día, hora, aula, docente)
2. **Restricciones**: Se agregan todas las limitaciones (capacidad, disponibilidad, conflictos)
3. **Búsqueda**: OR-Tools busca la mejor asignación usando métodos de propagación de restricciones
4. **Optimización**: Se minimiza conflictos y se maximiza eficiencia de aulas
5. **Validación**: Se verifica que la solución sea válida

### **Ventajas**

✅ Encuentra soluciones óptimas (o cercanas a óptimas)  
✅ Respeta todas las restricciones simultáneamente  
✅ Escala bien para problemas grandes  
✅ Flexible para agregar nuevas restricciones

---

## 📝 Configuración de Restricciones

En `src/optimizer.py`, puedes ajustar:

```python
N_DIAS            = 6       # Número de días (lunes-sábado)
N_SLOTS           = 16      # Número de franjas horarias (6:00-21:00)
HORA_BASE         = 6       # Hora inicial del día

# Patrones de sesiones válidas
PARES_DIAS  = [(0,2),(2,0),(1,3),(3,1),(2,4),(4,2)]  # Lunes-Miércoles, etc.
TRIO_DIAS   = [(0,2,4)]                               # Lunes-Miércoles-Viernes

# Limites horarios
MAX_FIN_SLOTS     = 16      # Fin de semana: hasta 22:00
MAX_FIN_SLOTS_SAB = 11      # Sábado: hasta 17:00
```

---

## 🐛 Troubleshooting

| Problema                       | Causa                                       | Solución                                             |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------------- |
| "No existe archivo de entrada" | Falta datos en `data/input/`                | Verifica que el Excel esté en la carpeta correcta    |
| Solver tarda mucho tiempo      | Muchos grupos o restricciones muy estrictas | Reduce tiempo límite con `--tiempo` o `--max-grupos` |
| "Conflicto de restricciones"   | Datos inconsistentes                        | Valida con `--solo-validar` y revisa el Excel        |
| Aulas sobrecargadas            | Capacidad insuficiente                      | Aumenta número de aulas en los datos de entrada      |

---

## 📞 Información Técnica

**Dependencias principales:**

- **ortools**: Solucionador de restricciones
- **pandas**: Procesamiento de datos
- **openpyxl**: Lectura/escritura de Excel
- **fastapi**: API web
- **uvicorn**: Servidor web

**Plataformas soportadas:**

- Windows, macOS, Linux
- Python 3.8+

---

## 📄 Licencia y Autoría

Sistema de Optimización de Horarios — Universidad Privada Boliviana (UPB)

---

## 📮 Notas Finales

- **Primera ejecución**: Puede ser más lenta mientras compila el solver
- **Datos de prueba**: Usa `--max-grupos 5` para pruebas rápidas
- **Producción**: Para datos completos, usa `--tiempo 14400` (4 horas)
- **Resultados**: Siempre valida con `--solo-validar` después de optimizar

¡Listo! Ya puedes usar el sistema de optimización de horarios. 🎓
