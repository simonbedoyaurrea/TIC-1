import pandas as pd
from ortools.sat.python import cp_model

# ==============================
# 1. CONFIGURACIÓN
# ==============================

DIA_COL_MAP = {
    "MONDAY":    0,
    "TUESDAY":   1,
    "WEDNESDAY": 2,
    "THURSDAY":  3,
    "FRIDAY":    4,
    "SATURDAY":  5,
    "SUNDAY":    6,
}

DIA_LETRAS_VALIDAS = {"M", "T", "W", "R", "F", "S", "U"}

INICIO_DIA      = 6 * 60
FIN_DIA         = 21 * 60 + 50
DURACION_BLOQUE = 50
PASO_BLOQUE     = 60


# ==============================
# 2. UTILIDADES DE TIEMPO
# ==============================

def hhmm_to_min(hhmm: int) -> int:
    hhmm = int(hhmm)
    return (hhmm // 100) * 60 + (hhmm % 100)


def min_to_hhmm(m: int) -> int:
    return (m // 60) * 100 + (m % 60)


def generar_bloques_inicio() -> list[int]:
    bloques = []
    t = INICIO_DIA
    while t + DURACION_BLOQUE <= FIN_DIA:
        bloques.append(t)
        t += PASO_BLOQUE
    return bloques


BLOQUES_INICIO = generar_bloques_inicio()
BLOQUES_SET    = set(BLOQUES_INICIO)


# ==============================
# 3. DISPONIBILIDAD DEL DOCENTE
# ==============================

def disponibilidad_a_bloques(disponibilidad: list[tuple]) -> set[tuple]:
    bloques = set()
    for (dia, h_ini, h_fin) in disponibilidad:
        ini_min = hhmm_to_min(h_ini)
        fin_min = hhmm_to_min(h_fin)
        for t in BLOQUES_INICIO:
            if ini_min <= t and t + DURACION_BLOQUE <= fin_min:
                bloques.add((dia, t))
    return bloques


# ==============================
# 4. EXTRACCIÓN DE OCUPACIÓN DEL DF
# ==============================

def _fila_activa_en_dia(row: pd.Series, col_dia: str) -> bool:
    val = str(row[col_dia]).strip()
    return val in DIA_LETRAS_VALIDAS


def extraer_slots_ocupados_salon(df: pd.DataFrame) -> set[tuple]:
    ocupados = set()
    for _, row in df.iterrows():
        sala  = row["ROOM_CODE"]
        start = hhmm_to_min(row["START_HOUR"])
        end   = hhmm_to_min(row["END_HOUR"])
        for col, dia_idx in DIA_COL_MAP.items():
            if not _fila_activa_en_dia(row, col):
                continue
            for t in BLOQUES_INICIO:
                if start < t + DURACION_BLOQUE and t < end:
                    ocupados.add((sala, dia_idx, t))
    return ocupados


def extraer_slots_ocupados_docente(df: pd.DataFrame, docente) -> set[tuple]:
    ocupados = set()
    df_doc = df[df["INSTRUCTOR_CODE"] == docente]
    for _, row in df_doc.iterrows():
        start = hhmm_to_min(row["START_HOUR"])
        end   = hhmm_to_min(row["END_HOUR"])
        for col, dia_idx in DIA_COL_MAP.items():
            if not _fila_activa_en_dia(row, col):
                continue
            for t in BLOQUES_INICIO:
                if start < t + DURACION_BLOQUE and t < end:
                    ocupados.add((dia_idx, t))
    return ocupados


# ==============================
# 5. VERIFICACIÓN DE BLOQUES CONSECUTIVOS
# ==============================

def bloques_consecutivos_validos(
    t: int,
    duracion: int,
    dias: list[int],
    disp_doc: set,
    doc_ocupado: set,
    salon: str,
    salon_ocupado: set,
) -> tuple[bool, str]:
    for i in range(duracion):
        ti = t + i * PASO_BLOQUE
        if ti not in BLOQUES_SET:
            return False, "fuera_de_rango"
        for d in dias:
            if (d, ti) not in disp_doc:
                return False, "disp"
            if (d, ti) in doc_ocupado:
                return False, "doc_ocupado"
            if (salon, d, ti) in salon_ocupado:
                return False, "salon_ocupado"
    return True, ""


# ==============================
# 6. CONSTRUCCIÓN DE UNA OPCIÓN
# ==============================

def _construir_opcion(salon: str, t: int, duracion: int, nueva_materia: dict) -> dict:
    """Arma el dict de resultado para un (salon, t) dado."""
    return {
        "materia":     nueva_materia["id"],
        "docente":     nueva_materia["docente"],
        "salon":       salon,
        "hora_inicio": min_to_hhmm(t),
        "hora_fin":    min_to_hhmm(t + duracion * PASO_BLOQUE),
        "dias":        nueva_materia["dias"],
        "dias_nombre": [k for k, v in DIA_COL_MAP.items()
                        if v in nueva_materia["dias"]],
    }


# ==============================
# 7. FUNCIÓN PRINCIPAL
# ==============================

def asignar_nueva_materia(
    df: pd.DataFrame,
    nueva_materia: dict,
    disponibilidad_docente: dict,
) -> dict | None:
    """
    Encuentra el mejor horario para `nueva_materia` dada la ocupación del df.

    Retorna:
    {
        "optimo":   { salon, hora_inicio, hora_fin, dias, dias_nombre, ... },
        "opciones": [ ...todas las opciones válidas ordenadas por hora y salon... ]
    }
    O None si no hay ninguna opción.
    """

    model = cp_model.CpModel()

    salon_ocupado = extraer_slots_ocupados_salon(df)
    doc_ocupado   = extraer_slots_ocupados_docente(df, nueva_materia["docente"])
    disp_doc      = disponibilidad_a_bloques(
                        disponibilidad_docente[str(nueva_materia["docente"])]
                    )

    salones_reales    = df["ROOM_CODE"].dropna().unique().tolist()
    salones_virtuales = ["VIRTUAL_1", "VIRTUAL_2"]
    todos_salones     = list(set(salones_reales + salones_virtuales))

    salones_permitidos = (
        nueva_materia["salones_permitidos"]
        if nueva_materia["salones_permitidos"]
        else todos_salones
    )

    capacidad = (
        df[["ROOM_CODE", "ROOM_VACANCIES"]]
        .drop_duplicates("ROOM_CODE")
        .set_index("ROOM_CODE")["ROOM_VACANCIES"]
        .to_dict()
    )
    for v in salones_virtuales:
        capacidad[v] = 9999

    costo_salon = {s: (1000 if s in salones_virtuales else 0) for s in todos_salones}

    x = {}
    debug = {"total": 0, "fail_disp": 0, "fail_doc": 0,
             "fail_salon": 0, "fail_cap": 0}

    for salon in salones_permitidos:
        if salon not in capacidad:
            continue
        if capacidad[salon] < nueva_materia["demanda"]:
            debug["fail_cap"] += 1
            continue

        for t in BLOQUES_INICIO:
            debug["total"] += 1
            valido, motivo = bloques_consecutivos_validos(
                t, nueva_materia["duracion"], nueva_materia["dias"],
                disp_doc, doc_ocupado, salon, salon_ocupado,
            )
            if not valido:
                if motivo == "disp":            debug["fail_disp"]  += 1
                elif motivo == "doc_ocupado":   debug["fail_doc"]   += 1
                elif motivo == "salon_ocupado": debug["fail_salon"] += 1
                continue

            x[(salon, t)] = model.NewBoolVar(f"x_{salon}_{t}")

    print("DEBUG:", debug)
    print(f"Opciones válidas encontradas: {len(x)}")

    if not x:
        print("❌ No hay solución posible.")
        return None

    # ── Todas las opciones disponibles, ordenadas por hora luego por salon ──
    opciones = sorted(
        [
            _construir_opcion(salon, t, nueva_materia["duracion"], nueva_materia)
            for (salon, t) in x
        ],
        key=lambda o: (o["hora_inicio"], o["salon"]),
    )

    # ── Resolver para el óptimo ──
    model.Add(sum(x.values()) == 1)
    model.Minimize(
        sum(var * costo_salon.get(salon, 0) for (salon, t), var in x.items())
    )

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for (salon, t), var in x.items():
            if solver.Value(var):
                optimo = _construir_opcion(salon, t, nueva_materia["duracion"], nueva_materia)
                
                return {"optimo": optimo, "opciones": opciones}

    print("❌ El solver no encontró solución.")
    return None


# ==============================
# 8. EJEMPLO DE USO
# ==============================

# if __name__ == "__main__":


#     nueva_materia = {
#         "id":                 "MATX",
#         "docente":            75879.0,
#         "demanda":            40,
#         "duracion":           2,
#         "dias":               [0, 2],
#         "salones_permitidos": [],
#     }

#     disponibilidad_docente = {
#         75879.0: [
#             (0, 700, 1800),
#             (2, 700, 1800),
#         ]
#     }

#     resultado = asignar_nueva_materia(df, nueva_materia, disponibilidad_docente)

#     if resultado:
#         print("\n=== ÓPTIMO ===")
#         print(resultado["optimo"])
#         print(f"\n=== TODAS LAS OPCIONES ({len(resultado['opciones'])}) ===")
#         for i, op in enumerate(resultado["opciones"], 1):
#             print(f"  {i:>2}. {op['salon']:<15} {op['hora_inicio']:04d}–{op['hora_fin']:04d}")