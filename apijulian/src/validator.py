import sys
import os
import pandas as pd
from datetime import datetime

# ─────────────────────────────────────────────
# CONFIGURACIÓN
# ─────────────────────────────────────────────
DIAS_COLS     = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
PARES_VALIDOS = {(0,2),(1,3),(2,4)}
PARES_NOMBRES = {(0,2):'LuMi',(1,3):'MaJu',(2,4):'MiVi'}
MAX_FIN_SAB   = 1700
MAX_FIN_SEM   = 2200
USO_BAJO_PCT  = 50

# ─────────────────────────────────────────────
# UTILIDADES
# ─────────────────────────────────────────────
def get_dia_idx(row):
    for idx, col in enumerate(DIAS_COLS):
        val = row[col]
        if val != 0 and str(val).strip() not in ('0', '', 'nan'):
            return idx
    return None

def hhmm_a_min(hhmm):
    h = int(hhmm) // 100
    m = int(hhmm) % 100
    return h * 60 + m

def se_tralapan(ini1, fin1, ini2, fin2):
    return not (fin1 <= ini2 or fin2 <= ini1)

def es_pendiente(code):
    return str(code).upper().startswith('PENDIENTE')

# ─────────────────────────────────────────────
# CARGA Y PREPARACIÓN
# ─────────────────────────────────────────────
def cargar_excel(path):
    df = pd.read_excel(path)
    df['DIA_IDX']   = df.apply(get_dia_idx, axis=1)
    df['INI_MIN']   = df['START_HOUR'].apply(hhmm_a_min)
    df['FIN_MIN']   = df['END_HOUR'].apply(hhmm_a_min)
    df['PENDIENTE'] = df['INSTRUCTOR_CODE'].apply(es_pendiente)
    return df

# ─────────────────────────────────────────────
# VALIDACIONES CRÍTICAS
# ─────────────────────────────────────────────
def validar_conflictos_salon(df):
    errores = []
    df_sal = df[df['ROOM_CODE'].notna() & (df['ROOM_CODE'].astype(str) != 'nan')].copy()
    por_dia_salon = df_sal.groupby(['ROOM_CODE','DIA_IDX'])

    for (salon, dia), filas in por_dia_salon:
        sesiones = filas[['GRUPO','INI_MIN','FIN_MIN']].values.tolist()
        for i in range(len(sesiones)):
            for j in range(i+1, len(sesiones)):
                g1, ini1, fin1 = sesiones[i]
                g2, ini2, fin2 = sesiones[j]
                if se_tralapan(ini1, fin1, ini2, fin2):
                    errores.append(f"Salón {salon} | Día {dia} | {g1} ({ini1//60:02d}:{ini1%60:02d}-{fin1//60:02d}:{fin1%60:02d}) ↔ {g2} ({ini2//60:02d}:{ini2%60:02d}-{fin2//60:02d}:{fin2%60:02d})")
    return errores

def validar_conflictos_docente(df):
    errores = []
    df_doc = df[~df['PENDIENTE']].copy()
    por_doc_dia = df_doc.groupby(['INSTRUCTOR_CODE','DIA_IDX'])

    for (doc, dia), filas in por_doc_dia:
        sesiones = filas[['GRUPO','INI_MIN','FIN_MIN']].values.tolist()
        for i in range(len(sesiones)):
            for j in range(i+1, len(sesiones)):
                g1, ini1, fin1 = sesiones[i]
                g2, ini2, fin2 = sesiones[j]
                if se_tralapan(ini1, fin1, ini2, fin2):
                    errores.append(f"Docente {doc} | Día {dia} | {g1} ({ini1//60:02d}:{ini1%60:02d}-{fin1//60:02d}:{fin1%60:02d}) ↔ {g2} ({ini2//60:02d}:{ini2%60:02d}-{fin2//60:02d}:{fin2%60:02d})")
    return errores

def validar_grupos_sin_salon(df):
    errores = []
    sin_salon = df[df['ROOM_CODE'].isna() | (df['ROOM_CODE'].astype(str).isin(['nan','None','']))]
    # Solo es error si no es virtual (VIR) ni presencial sin sala esperada
    componentes_sin_sala = ['VIR1','VIR2','PRE1']
    problematicos = sin_salon[~sin_salon['COMPONENTE'].astype(str).str.upper().str.startswith('VIR')]
    for _, row in problematicos.iterrows():
        errores.append(f"Grupo {row['GRUPO']} | Componente {row['COMPONENTE']} sin salón asignado")
    return errores

def validar_horarios_rango(df):
    errores = []
    sab = df[df['DIA_IDX'] == 5]
    for _, row in sab[sab['END_HOUR'] > MAX_FIN_SAB].iterrows():
        errores.append(f"Grupo {row['GRUPO']} | Sábado termina a las {row['END_HOUR']} (máx {MAX_FIN_SAB})")

    sem = df[df['DIA_IDX'].isin([0,1,2,3,4])]
    for _, row in sem[sem['END_HOUR'] > MAX_FIN_SEM].iterrows():
        errores.append(f"Grupo {row['GRUPO']} | Entre semana termina a las {row['END_HOUR']} (máx {MAX_FIN_SEM})")

    dom = df[df['DIA_IDX'] == 6]
    for _, row in dom.iterrows():
        errores.append(f"Grupo {row['GRUPO']} | Asignado en domingo")

    return errores

def validar_capacidad(df):
    errores = []
    df_c = df[df['CAPACIDAD_SALON'].notna() & (df['CAPACIDAD_SALON'] > 0)]
    exceden = df_c[df_c['SESSION_VACANCIES'] > df_c['CAPACIDAD_SALON']]
    for _, row in exceden.iterrows():
        errores.append(f"Grupo {row['GRUPO']} | {row['ROOM_CODE']} | Demanda {int(row['SESSION_VACANCIES'])} > Capacidad {int(row['CAPACIDAD_SALON'])}")
    return errores

# ─────────────────────────────────────────────
# VALIDACIONES DE CALIDAD
# ─────────────────────────────────────────────
def validar_patrones_dias(df):
    advertencias = []
    grupos_2ses = {}
    for grupo, filas in df.groupby('GRUPO'):
        if len(filas) == 2:
            dias = sorted(filas['DIA_IDX'].dropna().astype(int).tolist())
            if len(dias) == 2:
                grupos_2ses[grupo] = tuple(dias)

    mal = [(g, p) for g, p in grupos_2ses.items() if p not in PARES_VALIDOS]
    conteo = {}
    for _, p in grupos_2ses.items():
        nombre = PARES_NOMBRES.get(p, f'Días {p}')
        conteo[nombre] = conteo.get(nombre, 0) + 1

    if mal:
        for g, p in mal[:10]:
            advertencias.append(f"Grupo {g} | Patrón de días inválido: {p}")
        if len(mal) > 10:
            advertencias.append(f"... y {len(mal)-10} más")

    return advertencias, len(grupos_2ses), len(mal), conteo

def validar_uso_salon(df):
    advertencias = []
    df_c = df[df['CAPACIDAD_SALON'].notna() & (df['CAPACIDAD_SALON'] > 0)].copy()
    df_c['uso'] = df_c['SESSION_VACANCIES'] / df_c['CAPACIDAD_SALON'] * 100
    bajo = df_c[df_c['uso'] < USO_BAJO_PCT]
    if len(bajo) > 0:
        advertencias.append(f"{len(bajo)} sesiones con uso < {USO_BAJO_PCT}% de capacidad")
        peores = bajo.nsmallest(3, 'uso')
        for _, row in peores.iterrows():
            advertencias.append(f"  {row['GRUPO']} | {row['ROOM_CODE']} | {int(row['SESSION_VACANCIES'])}/{int(row['CAPACIDAD_SALON'])} ({row['uso']:.0f}%)")
    return advertencias, df_c['uso'].mean(), df_c['uso'].median()

def validar_docentes(df):
    total   = df['GRUPO'].nunique()
    pend    = df[df['PENDIENTE']]['GRUPO'].nunique()
    conf    = total - pend
    pct_conf = conf / total * 100 if total > 0 else 0
    return conf, pend, pct_conf

def validar_distribucion_horaria(df):
    horas = df['START_HOUR'].value_counts().sort_index()
    total = len(df)
    advertencias = []
    for hora, count in horas.items():
        pct = count / total * 100
        if pct > 20:
            advertencias.append(f"  {hora//100:02d}:00 — {count} sesiones ({pct:.1f}% del total)")
    return advertencias, horas

# ─────────────────────────────────────────────
# REPORTE
# ─────────────────────────────────────────────
def generar_reporte(path_excel, path_reporte=None):
    lineas = []

    def log(txt=''):
        print(txt)
        lineas.append(txt)

    log("=" * 65)
    log("  REPORTE DE VALIDACIÓN — ASIGNACIÓN DE HORARIOS")
    log(f"  Archivo: {os.path.basename(path_excel)}")
    log(f"  Fecha:   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log("=" * 65)

    df = cargar_excel(path_excel)
    log(f"\n  Sesiones totales: {len(df)}")
    log(f"  Grupos únicos:    {df['GRUPO'].nunique()}")

    hay_errores = False

    # ── ERRORES CRÍTICOS ──────────────────────────────────
    log("\n" + "─" * 65)
    log("  ERRORES CRÍTICOS")
    log("─" * 65)

    e1 = validar_conflictos_salon(df)
    if e1:
        hay_errores = True
        log(f"\n❌ Conflictos de salón: {len(e1)}")
        for e in e1[:10]: log(f"   {e}")
        if len(e1) > 10: log(f"   ... y {len(e1)-10} más")
    else:
        log(f"\n✅ Conflictos de salón: 0")

    e2 = validar_conflictos_docente(df)
    if e2:
        hay_errores = True
        log(f"\n❌ Conflictos de docente: {len(e2)}")
        for e in e2[:10]: log(f"   {e}")
        if len(e2) > 10: log(f"   ... y {len(e2)-10} más")
    else:
        log(f"✅ Conflictos de docente: 0")

    e3 = validar_grupos_sin_salon(df)
    if e3:
        hay_errores = True
        log(f"\n❌ Grupos sin salón (no virtuales): {len(e3)}")
        for e in e3[:10]: log(f"   {e}")
    else:
        log(f"✅ Grupos sin salón (no virtuales): 0")

    e4 = validar_horarios_rango(df)
    if e4:
        hay_errores = True
        log(f"\n❌ Horarios fuera de rango: {len(e4)}")
        for e in e4[:10]: log(f"   {e}")
    else:
        log(f"✅ Horarios fuera de rango: 0")

    e5 = validar_capacidad(df)
    if e5:
        hay_errores = True
        log(f"\n❌ Grupos que exceden capacidad de salón: {len(e5)}")
        for e in e5[:10]: log(f"   {e}")
    else:
        log(f"✅ Capacidad de salones respetada: 0 excedidos")

    # ── ADVERTENCIAS DE CALIDAD ───────────────────────────
    log("\n" + "─" * 65)
    log("  CALIDAD")
    log("─" * 65)

    adv_pat, total_2ses, mal_pat, conteo_pat = validar_patrones_dias(df)
    log(f"\n{'⚠️ ' if mal_pat else '✅'} Separación de días entre sesiones (grupos con 2 sesiones: {total_2ses})")
    log(f"   Se procura al menos 1 día de descanso entre sesiones (LuMi / MaJu / MiVi)")
    for nombre, count in sorted(conteo_pat.items()):
        log(f"   {nombre}: {count}")
    otros = total_2ses - sum(conteo_pat.values())
    if otros > 0:
        log(f"   Otros patrones (días consecutivos u otras combinaciones): {otros}")

    adv_cap, uso_avg, uso_med = validar_uso_salon(df)
    log(f"\n{'⚠️ ' if adv_cap else '✅'} Alta capacidad ociosa")
    log(f"   Promedio: {uso_avg:.1f}%  |  Mediana: {uso_med:.1f}%")
    for a in adv_cap: log(f"   {a}")

    conf, pend, pct = validar_docentes(df)
    log(f"\n{'⚠️ ' if pct < 50 else '✅'} Asignación de docentes")
    log(f"   Confirmados: {conf} ({pct:.1f}%)")
    log(f"   PENDIENTE:   {pend} ({100-pct:.1f}%)")

    adv_hor, horas = validar_distribucion_horaria(df)
    log(f"\n{'⚠️ ' if adv_hor else '✅'} Distribución horaria (sesiones por franja de inicio)")
    for h, c in horas.items():
        bar = '█' * (c // 25)
        log(f"   {h//100:02d}:00 — {c:4d} {bar}")
    if adv_hor:
        log(f"   ⚠️  Franjas con más del 20% del total de sesiones:")
        for a in adv_hor: log(a)

    # ── RESUMEN FINAL ─────────────────────────────────────
    log("\n" + "=" * 65)
    if hay_errores:
        log("  ❌ RESULTADO: HAY ERRORES CRÍTICOS — no subir a Banner")
    else:
        log("  ✅ RESULTADO: SIN ERRORES CRÍTICOS — listo para Banner")
    log("=" * 65)

    # Guardar reporte
    if path_reporte:
        with open(path_reporte, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lineas))
        print(f"\nReporte guardado: {path_reporte}")

    return not hay_errores


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == '__main__':
    if len(sys.argv) < 2:
        # Ruta por defecto
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        path_excel = os.path.join(base, 'data', 'output', 'asignacion_banner.xlsx')
    else:
        path_excel = sys.argv[1]

    if not os.path.exists(path_excel):
        print(f"❌ Archivo no encontrado: {path_excel}")
        sys.exit(1)

    base_out   = os.path.dirname(os.path.abspath(path_excel))
    # Si el Excel está en uploads (read-only), guardar junto al script
    if not os.access(base_out, os.W_OK):
        base_out = os.path.dirname(os.path.abspath(__file__))
    reporte    = os.path.join(base_out, 'reporte_validacion.txt')
    ok         = generar_reporte(path_excel, reporte)
    sys.exit(0 if ok else 1)