import math, os, threading, time
import pandas as pd
from collections import defaultdict
from ortools.sat.python import cp_model

# ─────────────────────────────────────────────
# CONFIGURACIÓN
# ─────────────────────────────────────────────
N_DIAS            = 6       # lunes(0) a sábado(5)
N_DIAS_SEMANA     = 5       # lunes(0) a viernes(4)
N_SLOTS           = 16      # 0=6:00, 1=7:00, ..., 15=21:00
HORA_BASE         = 6
MAX_FIN_SLOTS     = 16      # semana: hasta 22:00
MAX_FIN_SLOTS_SAB = 11      # sábado: hasta 17:00

# Patrones de días válidos
PARES_DIAS  = [(0,2),(2,0),(1,3),(3,1),(2,4),(4,2)]  # LuMi, MaJu, MiVi
TRIO_DIAS   = [(0,2,4)]                               # LuMiVi

DIAS             = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
BANNER_DIA_COL   = {0:'MONDAY',1:'TUESDAY',2:'WEDNESDAY',3:'THURSDAY',4:'FRIDAY',5:'SATURDAY',6:'SUNDAY'}
BANNER_DIA_LETRA = {0:'M',1:'T',2:'W',3:'R',4:'F',5:'S',6:'U'}
EDIFICIO_A_BLOQUE = {'B06':'MELB06','B07':'MELB07','B08':'MELB08','B09':'MELB09',
                     'B10':'MELB10','B11':'MELB11','B12':'MELB12','BVI':'MELBVI'}

def _slot_a_hhmm(slot):
    return (HORA_BASE + slot) * 100

def _fin_hhmm(slot_inicio, dur_bloques):
    m = (HORA_BASE + slot_inicio) * 60 + dur_bloques * 50
    return (m // 60) * 100 + (m % 60)

def _max_fin(dia):
    return MAX_FIN_SLOTS_SAB if dia == 5 else MAX_FIN_SLOTS

def _parsear_sesiones(num_bloques, num_sesiones, modulacion):
    if pd.isna(modulacion):
        base  = int(num_bloques) // int(num_sesiones)
        resto = int(num_bloques) % int(num_sesiones)
        return [base + (1 if i < resto else 0) for i in range(int(num_sesiones))]
    return [int(x.strip()) for x in str(modulacion).split(',')]

def _tipo_salon_desde_desc(desc):
    if pd.isna(desc): return 'AULA'
    d = str(desc).upper()
    if any(k in d for k in ['LABORATOR','LAB-','CISCO','ELECTRONI']): return 'LABORATORIO'
    if 'TALLER' in d: return 'TEORICO_PRACTICO'
    return 'AULA'

def preparar_grupos(catalogo_asignaturas, df_demandas, df_asignaturas_raw, max_grupos=None):
    usables = set(df_demandas[df_demandas['USABLE'] == 1]['ASIGNATURA'].unique())
    mod_forzada = (df_asignaturas_raw
        .drop_duplicates(subset=['ASIGNATURA','COMPONENTE'])
        .set_index(['ASIGNATURA','COMPONENTE'])['MODULACION FORZADA'].to_dict())
    grupos = []
    for e in catalogo_asignaturas:
        asig_id = e['asignatura']
        if asig_id not in usables: continue
        demanda, vac_max = e['demanda'], e['vac_max']
        if vac_max <= 0 or demanda <= 0: continue
        sesiones_dur = _parsear_sesiones(e['num_bloques'], e['num_sesiones'],
                                         mod_forzada.get((asig_id, e['componente']), None))
        for i in range(1, math.ceil(demanda / vac_max) + 1):
            grupos.append({'id': f"{e['id']}-G{i}", 'asignatura': asig_id,
                'componente': e['componente'], 'nombre': e['nombre'],
                'tipo_sala': e['tipo_sala'], 'requiere_sala': e['requiere_sala'],
                'labs_requeridos': e['labs_requeridos'], 'salas_requeridas': e['salas_requeridas'],
                'vac_max': int(vac_max), 'vac_opt': e.get('vac_opt', vac_max),
                'sesiones_dur': sesiones_dur, 'es_virtual': e['tipo_sala'] == 'NINGUNA'})
        if max_grupos and len(grupos) >= max_grupos: break
    tipos = pd.Series([g['tipo_sala'] for g in grupos]).value_counts().to_dict()
    print(f"\n📋 GRUPOS A PROGRAMAR: {len(grupos)}")
    print(f"   Por tipo de sala: {tipos}")
    return grupos

def _enriquecer_salones(catalogo_salones):
    df = catalogo_salones.copy()
    df['TIPO_SALA'] = df['DESC_SALON'].apply(_tipo_salon_desde_desc)
    return df.reset_index(drop=True)

def _salones_validos(grupo, df_sal, df_restricciones):
    if not grupo['requiere_sala']: return []
    tipos_ok = {'AULA':{'AULA'},'LABORATORIO':{'LABORATORIO'},
                'TEORICO_PRACTICO':{'AULA','TEORICO_PRACTICO'}}.get(grupo['tipo_sala'],{'AULA'})
    mask = df_sal['TIPO_SALA'].isin(tipos_ok) & (df_sal['CAPACIDAD'] >= grupo['vac_max'])
    restr = df_restricciones[df_restricciones['ASIGNATURA'] == grupo['asignatura']]
    if not restr.empty:
        edificios = {EDIFICIO_A_BLOQUE.get(e,e) for e in restr['EDIFICIO'].dropna().unique()}
        mask = mask & df_sal['BLOQUE'].isin(edificios)
    for lab in grupo['labs_requeridos']:
        if lab in df_sal.columns: mask = mask & (df_sal[lab] == 1)
    return df_sal[mask].index.tolist()

# ─────────────────────────────────────────────
# FASE 1 — CP-SAT: SALON + HORARIO
# ─────────────────────────────────────────────
def optimizar_horarios(grupos, catalogo_salones, df_restricciones, tiempo_limite=10800):
    model  = cp_model.CpModel()
    df_sal = _enriquecer_salones(catalogo_salones)

    sesiones, ses_por_grupo = [], defaultdict(list)
    for g_idx, grupo in enumerate(grupos):
        for s_num, dur_bloques in enumerate(grupo['sesiones_dur']):
            ses_por_grupo[g_idx].append(len(sesiones))
            sesiones.append({'grupo_idx': g_idx, 'dur_bloques': dur_bloques})

    print(f"\n⚙️  FASE 1 — CP-SAT: {len(grupos)} grupos, {len(sesiones)} sesiones")
    print(f"   Preferencia suave: días con descanso entre sesiones (penalización por días consecutivos)")

    sal_por_grupo = [_salones_validos(g, df_sal, df_restricciones) for g in grupos]
    sin_sala = sum(1 for g_idx,g in enumerate(grupos) if g['requiere_sala'] and not sal_por_grupo[g_idx])
    if sin_sala: print(f"   ⚠️  Grupos sin salon valido: {sin_sala}")

    start_var, day_var = [], []
    for s_idx, ses in enumerate(sesiones):
        g           = grupos[ses['grupo_idx']]
        dur_bloques = ses['dur_bloques']
        n_sesiones  = len(g['sesiones_dur'])

        # Determinar días válidos para este grupo
        if g['es_virtual']:
            # Virtuales: lunes-sabado (1 sesion)
            max_dias = N_DIAS
        elif n_sesiones >= 2:
            # Multi-sesión presencial: solo lunes-viernes (sin sábado)
            max_dias = N_DIAS_SEMANA
        else:
            # 1 sesión presencial: lunes-sábado
            max_dias = N_DIAS

        valid_starts = [d * N_SLOTS + s
                        for d in range(max_dias)
                        for s in range(N_SLOTS)
                        if s + dur_bloques <= _max_fin(d)]
        sv = model.NewIntVarFromDomain(cp_model.Domain.FromValues(valid_starts), f's{s_idx}')
        start_var.append(sv)
        dv = model.NewIntVar(0, max_dias - 1, f'd{s_idx}')
        model.AddDivisionEquality(dv, sv, N_SLOTS)
        day_var.append(dv)

    room_var = []
    for s_idx, ses in enumerate(sesiones):
        g_idx = ses['grupo_idx']
        valid = sal_por_grupo[g_idx]
        rv = (model.NewIntVarFromDomain(cp_model.Domain.FromValues(valid), f'r{s_idx}')
              if valid and grupos[g_idx]['requiere_sala'] else model.NewIntVar(-1,-1,f'r{s_idx}'))
        room_var.append(rv)

    # R1: sesiones del mismo grupo en días distintos (restricción dura)
    for g_idx, s_list in ses_por_grupo.items():
        n = len(s_list)
        for i in range(n):
            for j in range(i+1, n):
                model.Add(day_var[s_list[i]] != day_var[s_list[j]])

    # R2: penalización suave por días consecutivos
    # Peso moderado: suficiente para preferir días separados sin dominar el objetivo
    PESO_CONSECUTIVO = 30
    penalizaciones = []
    for g_idx, s_list in ses_por_grupo.items():
        n = len(s_list)
        for i in range(n):
            for j in range(i+1, n):
                b_consec = model.NewBoolVar(f'consec_{s_list[i]}_{s_list[j]}')
                diff = model.NewIntVar(-(N_DIAS-1), N_DIAS-1, f'diff_{s_list[i]}_{s_list[j]}')
                model.Add(diff == day_var[s_list[i]] - day_var[s_list[j]])
                abs_diff = model.NewIntVar(0, N_DIAS-1, f'absdiff_{s_list[i]}_{s_list[j]}')
                model.AddAbsEquality(abs_diff, diff)
                # b_consec = 1 si |diff| == 1
                model.Add(abs_diff == 1).OnlyEnforceIf(b_consec)
                model.Add(abs_diff != 1).OnlyEnforceIf(b_consec.Not())
                penalizaciones.append(b_consec * PESO_CONSECUTIVO)

    # No-overlap en salones
    room_ivals = defaultdict(list)
    for s_idx, ses in enumerate(sesiones):
        g_idx = ses['grupo_idx']
        if not grupos[g_idx]['requiere_sala']: continue
        dur = ses['dur_bloques']
        for r in sal_por_grupo[g_idx]:
            b = model.NewBoolVar(f'br{s_idx}_{r}')
            model.Add(room_var[s_idx] == r).OnlyEnforceIf(b)
            model.Add(room_var[s_idx] != r).OnlyEnforceIf(b.Not())
            room_ivals[r].append(
                model.NewOptionalFixedSizeIntervalVar(start_var[s_idx], dur, b, f'iv{s_idx}_{r}'))
    for ivals in room_ivals.values():
        if len(ivals) > 1: model.AddNoOverlap(ivals)

    # Objetivo: minimizar subutilización de salones
    obj = []
    for s_idx, ses in enumerate(sesiones):
        g = grupos[ses['grupo_idx']]
        if not g['requiere_sala']: continue
        vac_opt = int(g['vac_opt']) if pd.notna(g.get('vac_opt')) else g['vac_max']
        for r in sal_por_grupo[ses['grupo_idx']]:
            waste = max(0, int(df_sal.iloc[r]['CAPACIDAD']) - vac_opt)
            if waste == 0: continue
            b = model.NewBoolVar(f'ow{s_idx}_{r}')
            model.Add(room_var[s_idx] == r).OnlyEnforceIf(b)
            model.Add(room_var[s_idx] != r).OnlyEnforceIf(b.Not())
            obj.append(b * waste)
    # Combinar objetivo: subutilización de salones + penalización por días consecutivos
    obj_total = obj + penalizaciones
    if obj_total: model.Minimize(sum(obj_total))

    class _Progreso(cp_model.CpSolverSolutionCallback):
        def __init__(self):
            super().__init__()
            self._t0, self._n = time.time(), 0
        def on_solution_callback(self):
            self._n += 1
            e = time.time() - self._t0
            o, b = self.ObjectiveValue(), self.BestObjectiveBound()
            gap  = abs(o - b) / max(abs(o), 1) * 100
            print(f"   [{e:6.1f}s] #{self._n:3d} | obj={o:>10,.0f} | cota={b:>10,.0f} | gap={gap:6.1f}%", flush=True)

    stop = threading.Event()
    def _latido():
        paso = 0
        while not stop.wait(30):
            paso += 30
            print(f"   [{paso:6d}s] ⏳ en curso...", flush=True)

    callback = _Progreso()
    solver   = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = tiempo_limite
    solver.parameters.num_search_workers  = 8
    solver.parameters.log_search_progress = False

    mins, segs = divmod(int(tiempo_limite), 60)
    print(f"\n🔧 Resolviendo (limite: {mins}min {segs}s) — cada # es una mejora")
    print(f"   {'─'*60}", flush=True)

    t0 = time.time()
    hilo = threading.Thread(target=_latido, daemon=True)
    hilo.start()
    status = solver.Solve(model, callback)
    stop.set()
    elapsed = time.time() - t0

    estados = {cp_model.OPTIMAL:'✅ OPTIMO', cp_model.FEASIBLE:'⚠️  FACTIBLE',
               cp_model.INFEASIBLE:'❌ INFACTIBLE', cp_model.UNKNOWN:'❓ TIEMPO AGOTADO'}
    print(f"   {'─'*60}")
    print(f"   Estado:   {estados.get(status,'?')}")
    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print(f"   Tiempo:   {elapsed:.1f}s")
        return None

    o, b = solver.ObjectiveValue(), solver.BestObjectiveBound()
    gap_pct = abs(o - b) / max(abs(o), 1) * 100
    print(f"   Objetivo: {o:,.0f}  |  Cota: {b:,.0f}  |  Gap: {gap_pct:.1f}%")
    print(f"   Tiempo:   {elapsed:.1f}s")

    horarios = []
    for g_idx in range(len(grupos)):
        ses_g = []
        for s_idx in ses_por_grupo[g_idx]:
            gs          = solver.Value(start_var[s_idx])
            dia         = gs // N_SLOTS
            slot        = gs % N_SLOTS
            dur_bloques = sesiones[s_idx]['dur_bloques']
            r_idx       = solver.Value(room_var[s_idx])
            salon       = df_sal.iloc[r_idx] if r_idx >= 0 else None
            ses_g.append({
                'dia': dia, 'slot': slot, 'dur_bloques': dur_bloques,
                'start_hhmm': _slot_a_hhmm(slot),
                'end_hhmm':   _fin_hhmm(slot, dur_bloques),
                'room_code':  f"{salon['BLOQUE']}-{salon['SALON']}" if salon is not None else None,
                'bloque':     salon['BLOQUE']        if salon is not None else None,
                'salon':      salon['SALON']         if salon is not None else None,
                'capacidad':  int(salon['CAPACIDAD']) if salon is not None else None,
            })
        horarios.append(ses_g)
    return horarios, df_sal, gap_pct

# ─────────────────────────────────────────────
# FASE 2 — REPARACION DE HORARIOS
# ─────────────────────────────────────────────
def reparar_horarios(grupos, horarios, df_sal, catalogo_docentes):
    print(f"\n⚙️  FASE 2 — Reparando horarios para maximizar docentes confirmados...")

    doc_por_asig = defaultdict(list)
    for idx, doc in enumerate(catalogo_docentes):
        for a in doc['asignaturas']:
            doc_por_asig[a['asignatura']].append(idx)

    ocup = defaultdict(list)
    for g_idx, ses_g in enumerate(horarios):
        for s_num, ses in enumerate(ses_g):
            if ses['bloque']:
                ocup[(ses['bloque'], ses['salon'])].append(
                    (ses['dia'], ses['slot'], ses['slot'] + ses['dur_bloques'], g_idx, s_num))

    def _salon_libre(bloque, salon, dia, slot, dur, excluir_g, excluir_s):
        fin = slot + dur
        for (d,s,e,gi,si) in ocup.get((bloque, salon), []):
            if gi == excluir_g and si == excluir_s: continue
            if d == dia and not (fin <= s or e <= slot): return False
        return True

    def _doc_ok(doc, dia, slot, dur_bloques, es_virtual):
        max_d = N_DIAS
        if dia >= max_d: return False
        disp  = doc['disponibilidad'].get(DIAS[dia], {})
        horas = list(disp.keys())
        return (slot + dur_bloques <= len(horas) and
                all(disp.get(horas[slot + k], 0) == 1 for k in range(dur_bloques)))

    def _tiene_candidato(g_idx, ses_g):
        grupo = grupos[g_idx]
        for doc_idx in doc_por_asig.get(grupo['asignatura'], []):
            doc = catalogo_docentes[doc_idx]
            if all(_doc_ok(doc, s['dia'], s['slot'], s['dur_bloques'], grupo['es_virtual'])
                   for s in ses_g):
                return True
        return False

    def _dias_validos_para_sesion(g_idx, s_num, ses_g_nueva):
        grupo = grupos[g_idx]
        n = len(ses_g_nueva)
        if n == 1:
            return list(range(N_DIAS))
        elif n == 2:
            # el otro slot del par
            otro_dia = ses_g_nueva[1 - s_num]['dia']
            return [d0 if s_num == 0 else d1
                    for (d0, d1) in PARES_DIAS
                    if (s_num == 0 and d1 == otro_dia) or
                       (s_num == 1 and d0 == otro_dia)]
        elif n == 3:
            return [TRIO_DIAS[0][s_num]]
        else:
            dias_usados = {s['dia'] for i,s in enumerate(ses_g_nueva) if i != s_num}
            return [d for d in range(N_DIAS_SEMANA) if d not in dias_usados]

    reparados = 0
    for g_idx, grupo in enumerate(grupos):
        ses_g = horarios[g_idx]
        if not doc_por_asig.get(grupo['asignatura']): continue
        if _tiene_candidato(g_idx, ses_g): continue

        ses_g_nueva = list(ses_g)
        movio = False

        for s_num, ses in enumerate(ses_g):
            if not ses['bloque']: continue
            dur  = ses['dur_bloques']
            dias = _dias_validos_para_sesion(g_idx, s_num, ses_g_nueva)

            slots_candidatos = set()
            for doc_idx in doc_por_asig[grupo['asignatura']]:
                doc = catalogo_docentes[doc_idx]
                for d in dias:
                    for s in range(N_SLOTS):
                        if s + dur > _max_fin(d): continue
                        if _doc_ok(doc, d, s, dur, grupo['es_virtual']):
                            slots_candidatos.add((d, s))

            for (dia_nuevo, slot_nuevo) in sorted(slots_candidatos):
                if _salon_libre(ses['bloque'], ses['salon'], dia_nuevo, slot_nuevo,
                                dur, g_idx, s_num):
                    ses_g_nueva[s_num] = {**ses, 'dia': dia_nuevo, 'slot': slot_nuevo,
                                          'start_hhmm': _slot_a_hhmm(slot_nuevo),
                                          'end_hhmm':   _fin_hhmm(slot_nuevo, dur)}
                    movio = True
                    break

        if movio and _tiene_candidato(g_idx, ses_g_nueva):
            for s_num, (old, new) in enumerate(zip(ses_g, ses_g_nueva)):
                key_old = (old['bloque'], old['salon'])
                if key_old in ocup:
                    ocup[key_old] = [e for e in ocup[key_old]
                                     if not (e[3] == g_idx and e[4] == s_num)]
                if new['bloque']:
                    ocup[(new['bloque'], new['salon'])].append(
                        (new['dia'], new['slot'], new['slot'] + new['dur_bloques'], g_idx, s_num))
            horarios[g_idx] = ses_g_nueva
            reparados += 1

    print(f"   Grupos con horario ajustado: {reparados}")
    return horarios

# ─────────────────────────────────────────────
# FASE 3 — GREEDY: DOCENTES
# ─────────────────────────────────────────────
def asignar_docentes(grupos, horarios, catalogo_docentes, df_docentes_cat):
    print(f"\n⚙️  FASE 3 — Asignando docentes a {len(grupos)} grupos...")

    codigos_pendiente = [str(r['ID DOCENTE']) for _,r in df_docentes_cat.iterrows()
                         if str(r['ID DOCENTE']).upper().startswith('PENDIENTE')]

    doc_por_asig = defaultdict(list)
    for idx, doc in enumerate(catalogo_docentes):
        for a in doc['asignaturas']:
            doc_por_asig[a['asignatura']].append(idx)

    def _disponible(doc, dia, slot, dur_bloques, es_virtual):
        max_d = N_DIAS
        if dia >= max_d: return False
        disp  = doc['disponibilidad'].get(DIAS[dia], {})
        horas = list(disp.keys())
        return (slot + dur_bloques <= len(horas) and
                all(disp.get(horas[slot + k], 0) == 1 for k in range(dur_bloques)))

    ocupado      = defaultdict(list)
    secciones    = defaultdict(int)
    bloques      = defaultdict(int)
    secs_x_asig  = defaultdict(lambda: defaultdict(int))
    bloqs_x_asig = defaultdict(lambda: defaultdict(int))

    def _conflicto(doc_idx, dia, slot, dur):
        fin = slot + dur
        return any(d == dia and not (fin <= s or e <= slot)
                   for d,s,e in ocupado[doc_idx])

    def _excede(doc_idx, doc, asig_id, dur_total):
        if secciones[doc_idx] + 1 > doc['max_secciones']: return True
        if bloques[doc_idx] + dur_total > doc['max_bloques']: return True
        info = next((a for a in doc['asignaturas'] if a['asignatura'] == asig_id), None)
        if info:
            if secs_x_asig[doc_idx][asig_id] + 1 > info['max_secciones']: return True
            if bloqs_x_asig[doc_idx][asig_id] + dur_total > info['max_bloques']: return True
        return False

    orden = sorted(range(len(grupos)),
                   key=lambda i: len(doc_por_asig.get(grupos[i]['asignatura'], [])))
    asignaciones = [None] * len(grupos)
    n_conf = n_pend = 0

    for g_idx in orden:
        grupo = grupos[g_idx]
        ses_g = horarios[g_idx]
        total = sum(s['dur_bloques'] for s in ses_g)
        candidatos = sorted(doc_por_asig.get(grupo['asignatura'], []),
                            key=lambda i: (0 if catalogo_docentes[i]['tipo'] == 'E' else 1,
                                           catalogo_docentes[i]['prioridad']))
        asignado = None
        for doc_idx in candidatos:
            doc = catalogo_docentes[doc_idx]
            if _excede(doc_idx, doc, grupo['asignatura'], total): continue
            if all(_disponible(doc, s['dia'], s['slot'], s['dur_bloques'], grupo['es_virtual'])
                   and not _conflicto(doc_idx, s['dia'], s['slot'], s['dur_bloques'])
                   for s in ses_g):
                asignado = doc_idx
                break

        if asignado is not None:
            asig_id = grupo['asignatura']
            asignaciones[g_idx] = asignado
            for s in ses_g:
                ocupado[asignado].append((s['dia'], s['slot'], s['slot'] + s['dur_bloques']))
            secciones[asignado]            += 1
            bloques[asignado]              += total
            secs_x_asig[asignado][asig_id] += 1
            bloqs_x_asig[asignado][asig_id]+= total
            n_conf += 1
        else:
            if codigos_pendiente:
                asignaciones[g_idx] = codigos_pendiente[n_pend % len(codigos_pendiente)]
            n_pend += 1

    print(f"   ✅ Confirmados:  {n_conf}")
    print(f"   ⚠️  PENDIENTE:   {n_pend}")
    return asignaciones

# ─────────────────────────────────────────────
# EXPORTAR A BANNER
# ─────────────────────────────────────────────
def formatear_banner(grupos, horarios, asignaciones, catalogo_docentes):
    cols_dia = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
    rows = []
    for g_idx, grupo in enumerate(grupos):
        asig = asignaciones[g_idx]
        instructor = (catalogo_docentes[asig]['id'] if isinstance(asig, int)
                      else asig if isinstance(asig, str) else None)
        for ses in horarios[g_idx]:
            dias_row = {col: 0 for col in cols_dia}
            col_dia = BANNER_DIA_COL.get(ses['dia'])
            if col_dia: dias_row[col_dia] = BANNER_DIA_LETRA[ses['dia']]
            rows.append({'COURSE_NAME': grupo['nombre'], 'ASIGNATURA': grupo['asignatura'],
                'COMPONENTE': grupo['componente'], 'GRUPO': grupo['id'],
                'SESSION_VACANCIES': grupo['vac_max'], 'ROOM_CODE': ses['room_code'],
                'BLOQUE': ses['bloque'], 'SALON': ses['salon'],
                'CAPACIDAD_SALON': ses['capacidad'], 'INSTRUCTOR_CODE': instructor,
                'START_HOUR': ses['start_hhmm'], 'END_HOUR': ses['end_hhmm'], **dias_row})
    df = pd.DataFrame(rows)
    print(f"\n📊 RESULTADO:")
    print(f"   Grupos:      {len(grupos)}")
    print(f"   Sesiones:    {len(df)}")
    print(f"   Confirmados: {sum(1 for a in asignaciones if isinstance(a, int))}")
    print(f"   PENDIENTE:   {sum(1 for a in asignaciones if isinstance(a, str))}")
    return df

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == '__main__':
    from src.data_loader import (cargar_todos, construir_catalogo_salones,
                              construir_catalogo_docentes, construir_catalogo_asignaturas)

    dfs          = cargar_todos()
    cat_salones  = construir_catalogo_salones(dfs['programacion'])
    cat_docentes = construir_catalogo_docentes(dfs['docentes_cat'], dfs['disponibilidad'],
                                               dfs['doc_asignaturas'])
    cat_asig     = construir_catalogo_asignaturas(dfs['asignaturas'], dfs['demandas'])
    grupos       = preparar_grupos(cat_asig, dfs['demandas'], dfs['asignaturas'])

    resultado = optimizar_horarios(grupos, cat_salones, dfs['restricciones_ed'],
                                   tiempo_limite=14400)
    if resultado is None:
        print("No se encontro solucion de horarios.")
        exit(1)

    horarios, df_sal = resultado
    horarios     = reparar_horarios(grupos, horarios, df_sal, cat_docentes)
    asignaciones = asignar_docentes(grupos, horarios, cat_docentes, dfs['docentes_cat'])
    df_banner    = formatear_banner(grupos, horarios, asignaciones, cat_docentes)

    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                               'data', 'output', 'asignacion_banner.xlsx')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df_banner.to_excel(output_path, index=False)
    print(f"Exportado: {output_path}")