import os
import sys
import io
import tempfile
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="Optimizador de Horarios UPB",
    description="API para optimización automática de asignación de aulas, horarios y docentes.",
    version="1.0.0"
)

# CORS — permite peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado de los trabajos en curso
trabajos: dict = {}


# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class EstadoTrabajo(BaseModel):
    job_id: str
    estado: str          # "en_proceso" | "listo" | "error"
    mensaje: str
    gap: Optional[float] = None
    confirmados: Optional[int] = None
    pendientes: Optional[int] = None
    creado_en: str


# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────
@app.get("/", tags=["General"])
def raiz():
    return {"mensaje": "API Optimizador de Horarios UPB", "version": "1.0.0"}


@app.get("/health", tags=["General"])
def health():
    return {"estado": "ok", "timestamp": datetime.now().isoformat()}


@app.post("/optimizar", tags=["Optimización"])
async def optimizar(
    background_tasks: BackgroundTasks,
    tiempo_limite: int = Form(14400),
    asignaturas:      UploadFile = File(...),
    docentes_cat:     UploadFile = File(...),
    disponibilidad:   UploadFile = File(...),
    doc_asignaturas:  UploadFile = File(...),
    restricciones_ed: UploadFile = File(...),
    programacion:     UploadFile = File(...),
    demandas:         UploadFile = File(...),
):
    """
    Recibe los 7 archivos Excel requeridos y lanza la optimización en background.
    Retorna un job_id para consultar el estado con GET /estado/{job_id}.
    Cuando termina, el Excel se descarga con GET /resultado/{job_id}.
    """
    import uuid
    job_id = str(uuid.uuid4())[:8]

    # Leer bytes de los archivos requeridos
    archivos_bytes = {
        "asignaturas":      await asignaturas.read(),
        "docentes_cat":     await docentes_cat.read(),
        "disponibilidad":   await disponibilidad.read(),
        "doc_asignaturas":  await doc_asignaturas.read(),
        "restricciones_ed": await restricciones_ed.read(),
        "programacion":     await programacion.read(),
        "demandas":         await demandas.read(),
    }

    trabajos[job_id] = {
        "estado": "en_proceso",
        "mensaje": "Iniciando optimización...",
        "creado_en": datetime.now().isoformat(),
        "gap": None,
        "confirmados": None,
        "pendientes": None,
        "output_path": None,
    }

    background_tasks.add_task(_correr_optimizacion, job_id, archivos_bytes, tiempo_limite)

    return JSONResponse(status_code=202, content={
        "job_id": job_id,
        "mensaje": "Optimización iniciada. Consulta el estado en /estado/{job_id}",
        "estado_url": f"/estado/{job_id}",
        "resultado_url": f"/resultado/{job_id}",
    })


@app.get("/estado/{job_id}", tags=["Optimización"])
def estado(job_id: str):
    """Consulta el estado de un trabajo de optimización."""
    if job_id not in trabajos:
        raise HTTPException(status_code=404, detail="Job no encontrado")
    t = trabajos[job_id]
    return EstadoTrabajo(
        job_id=job_id,
        estado=t["estado"],
        mensaje=t["mensaje"],
        gap=t.get("gap"),
        confirmados=t.get("confirmados"),
        pendientes=t.get("pendientes"),
        creado_en=t["creado_en"],
    )


@app.get("/resultado/{job_id}", tags=["Optimización"])
def resultado(job_id: str):
    """Descarga el Excel de asignación cuando el trabajo está listo."""
    if job_id not in trabajos:
        raise HTTPException(status_code=404, detail="Job no encontrado")
    t = trabajos[job_id]
    if t["estado"] != "listo":
        raise HTTPException(status_code=425, detail=f"El trabajo aún no está listo: {t['estado']}")
    if not t["output_path"] or not os.path.exists(t["output_path"]):
        raise HTTPException(status_code=500, detail="Archivo de resultado no encontrado")
    return FileResponse(
        t["output_path"],
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"asignacion_banner_{job_id}.xlsx"
    )


@app.post("/validar", tags=["Validación"])
async def validar(excel: UploadFile = File(...)):
    """
    Recibe un Excel de asignación y retorna el reporte de validación como JSON.
    """
    contenido = await excel.read()

    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
        tmp.write(contenido)
        tmp_path = tmp.name

    reporte_path = tmp_path.replace(".xlsx", "_reporte.txt")
    try:
        from src.validator import generar_reporte

        ok = generar_reporte(tmp_path, reporte_path)

        with open(reporte_path, encoding="utf-8") as f:
            texto = f.read()

        return {"ok": ok, "reporte": texto}
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        if os.path.exists(reporte_path):
            os.remove(reporte_path)


# ─────────────────────────────────────────────
# TAREA EN BACKGROUND
# ─────────────────────────────────────────────
def _correr_optimizacion(job_id: str, archivos_bytes: dict, tiempo_limite: int):
    """Corre el pipeline completo en un hilo separado."""
    try:
        from src.data_loader import (cargar_desde_archivos_api, construir_catalogo_salones,
                                  construir_catalogo_docentes, construir_catalogo_asignaturas)
        from src.optimizer import (preparar_grupos, optimizar_horarios,
                                reparar_horarios, asignar_docentes, formatear_banner)

        trabajos[job_id]["mensaje"] = "Cargando datos..."
        dfs = cargar_desde_archivos_api(archivos_bytes)

        cat_salones  = construir_catalogo_salones(dfs['programacion'])
        cat_docentes = construir_catalogo_docentes(
            dfs['docentes_cat'], dfs['disponibilidad'], dfs['doc_asignaturas'])
        cat_asig     = construir_catalogo_asignaturas(dfs['asignaturas'], dfs['demandas'])
        grupos       = preparar_grupos(cat_asig, dfs['demandas'], dfs['asignaturas'])

        trabajos[job_id]["mensaje"] = "Optimizando horarios (CP-SAT)..."
        resultado = optimizar_horarios(grupos, cat_salones, dfs['restricciones_ed'],
                                       tiempo_limite=tiempo_limite)
        if resultado is None:
            trabajos[job_id]["estado"]  = "error"
            trabajos[job_id]["mensaje"] = "El solver no encontró solución. Intenta con más tiempo."
            return

        horarios, df_sal, gap = resultado
        trabajos[job_id]["gap"]     = round(gap, 2)
        trabajos[job_id]["mensaje"] = "Reparando horarios y asignando docentes..."
        horarios     = reparar_horarios(grupos, horarios, df_sal, cat_docentes)
        asignaciones = asignar_docentes(grupos, horarios, cat_docentes, dfs['docentes_cat'])
        df_banner    = formatear_banner(grupos, horarios, asignaciones, cat_docentes)

        # Guardar en archivo temporal
        with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
            df_banner.to_excel(tmp.name, index=False)
            output_path = tmp.name

        confirmados = sum(1 for a in asignaciones if isinstance(a, int))
        pendientes  = sum(1 for a in asignaciones if isinstance(a, str))

        trabajos[job_id].update({
            "estado":      "listo",
            "mensaje":     "Optimización completada exitosamente.",
            "confirmados": confirmados,
            "pendientes":  pendientes,
            "output_path": output_path,
        })

    except Exception as e:
        trabajos[job_id]["estado"]  = "error"
        trabajos[job_id]["mensaje"] = f"Error interno: {str(e)}"


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False)