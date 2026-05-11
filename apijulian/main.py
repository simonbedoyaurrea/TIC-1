import os
import sys
import argparse
import time

# Agregar src/ al path para encontrar los módulos independientemente
# de desde dónde se ejecute main.py
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src'))

def main():
    parser = argparse.ArgumentParser(
        description='Sistema de optimización de horarios universitarios',
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        '--tiempo', type=int, default=14400,
        help='Tiempo límite para el solver en segundos (default: 14400 = 4 horas)'
    )
    parser.add_argument(
        '--max-grupos', type=int, default=None,
        help='Limitar número de grupos (útil para pruebas rápidas)'
    )
    parser.add_argument(
        '--solo-validar', action='store_true',
        help='Solo ejecutar el validator sobre el Excel existente, sin correr el optimizer'
    )
    parser.add_argument(
        '--output', type=str, default=None,
        help='Ruta personalizada para el Excel de salida'
    )
    args = parser.parse_args()

    # Rutas base
    base_dir    = os.path.dirname(os.path.abspath(__file__))
    output_path = args.output or os.path.join(base_dir, 'data', 'output', 'asignacion_banner.xlsx')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    print("=" * 65)
    print("  SISTEMA DE OPTIMIZACIÓN DE HORARIOS — UPB")
    print("=" * 65)

    # ── MODO SOLO-VALIDAR ─────────────────────────────────────
    if args.solo_validar:
        if not os.path.exists(output_path):
            print(f"\n❌ No existe el archivo a validar: {output_path}")
            sys.exit(1)
        print(f"\n  Modo: solo validar Excel existente")
        print(f"  Archivo: {output_path}")
        _correr_validator(output_path)
        return

    # ── MODO COMPLETO ─────────────────────────────────────────
    mins, segs = divmod(args.tiempo, 60)
    horas, mins = divmod(mins, 60)
    if horas:
        tiempo_str = f"{horas}h {mins}min"
    else:
        tiempo_str = f"{mins}min {segs}s"

    print(f"\n  Tiempo límite: {tiempo_str}")
    if args.max_grupos:
        print(f"  Grupos máximos: {args.max_grupos} (modo prueba)")
    print(f"  Salida: {output_path}")

    t_inicio = time.time()

    # Importar módulos
    try:
        from src.data_loader import (cargar_todos, construir_catalogo_salones,
                                  construir_catalogo_docentes, construir_catalogo_asignaturas)
        from src.optimizer import (preparar_grupos, optimizar_horarios,
                                reparar_horarios, asignar_docentes, formatear_banner)
    except ImportError as e:
        print(f"\n❌ Error importando módulos: {e}")
        print("   Asegúrate de correr desde el directorio raíz del proyecto.")
        sys.exit(1)

    # Cargar datos
    print("\n" + "─" * 65)
    print("  CARGANDO DATOS")
    print("─" * 65)
    dfs = cargar_todos()

    cat_salones  = construir_catalogo_salones(dfs['programacion'])
    cat_docentes = construir_catalogo_docentes(
        dfs['docentes_cat'], dfs['disponibilidad'], dfs['doc_asignaturas'])
    cat_asig     = construir_catalogo_asignaturas(dfs['asignaturas'], dfs['demandas'])
    grupos       = preparar_grupos(cat_asig, dfs['demandas'], dfs['asignaturas'],
                                   max_grupos=args.max_grupos)

    # Fase 1: CP-SAT
    print("\n" + "─" * 65)
    print("  FASE 1 — OPTIMIZACIÓN CP-SAT")
    print("─" * 65)
    resultado = optimizar_horarios(grupos, cat_salones, dfs['restricciones_ed'],
                                   tiempo_limite=args.tiempo)
    if resultado is None:
        print("\n❌ El solver no encontró ninguna solución.")
        print("   Intenta aumentar el tiempo límite con --tiempo.")
        sys.exit(1)
    horarios, df_sal, gap = resultado

    # Fase 2: Reparación
    print("\n" + "─" * 65)
    print("  FASE 2 — REPARACIÓN DE HORARIOS")
    print("─" * 65)
    horarios = reparar_horarios(grupos, horarios, df_sal, cat_docentes)

    # Fase 3: Docentes
    print("\n" + "─" * 65)
    print("  FASE 3 — ASIGNACIÓN DE DOCENTES")
    print("─" * 65)
    asignaciones = asignar_docentes(grupos, horarios, cat_docentes, dfs['docentes_cat'])

    # Exportar
    print("\n" + "─" * 65)
    print("  EXPORTANDO")
    print("─" * 65)
    df_banner = formatear_banner(grupos, horarios, asignaciones, cat_docentes)
    df_banner.to_excel(output_path, index=False)
    print(f"  ✅ Excel exportado: {output_path}")

    # Validar
    print("\n" + "─" * 65)
    print("  VALIDACIÓN AUTOMÁTICA")
    print("─" * 65)
    ok = _correr_validator(output_path)

    # Resumen final
    t_total = time.time() - t_inicio
    h, r = divmod(int(t_total), 3600)
    m, s = divmod(r, 60)
    print("\n" + "=" * 65)
    print(f"  Tiempo total: {h}h {m}min {s}s")
    print(f"  Resultado:    {'✅ Listo para Banner' if ok else '⚠️  Revisar errores antes de subir'}")
    print("=" * 65)

    sys.exit(0 if ok else 1)


def _correr_validator(path_excel):
    """Corre el validator y retorna True si no hay errores críticos."""
    try:
        from src.validator import generar_reporte
    except ImportError:
        print("  ⚠️  validator.py no encontrado — saltando validación.")
        return True

    reporte_path = os.path.join(os.path.dirname(path_excel), 'reporte_validacion.txt')
    ok = generar_reporte(path_excel, reporte_path)
    return ok


if __name__ == '__main__':
    main()