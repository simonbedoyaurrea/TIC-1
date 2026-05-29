from fastapi import FastAPI
import pandas as pd
from algoritmo import asignar_nueva_materia

app = FastAPI()

@app.post("/optimizar")
async def optimizar(data: dict):
 
    df_json = data["df"]
    nueva_materia = data["materia"]
    disponibilidad = data["disponibilidad"]

    if "salonesPermitidos" in nueva_materia:
        nueva_materia["salones_permitidos"] = nueva_materia.pop("salonesPermitidos")

    # convertir json → dataframe
    df = pd.DataFrame(df_json)

    df = df.rename(columns={
    "roomCode": "ROOM_CODE",
    "startHour": "START_HOUR",
    "endHour": "END_HOUR",
    "instructorCode": "INSTRUCTOR_CODE",
    "roomVacancies": "ROOM_VACANCIES",
    "monday": "MONDAY",
    "tuesday": "TUESDAY",
    "wednesday": "WEDNESDAY",
    "thursday": "THURSDAY",
    "friday": "FRIDAY",
    "saturday": "SATURDAY",
    "sunday": "SUNDAY"
})

    resultado = asignar_nueva_materia(
        df,
        nueva_materia,
        disponibilidad
    )

    return resultado