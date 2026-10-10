/**
 * Programacion Dinamica: Weighted Interval Scheduling.
 *
 * Problema: escoger servicios que no se crucen (una sola bahia) de forma que
 * la FACTURACION total sea maxima.
 *
 * ESTADO
 *   dp[i] = maxima facturacion usando solo los primeros i servicios
 *           (ordenados por hora de fin).
 *
 * CASO BASE
 *   dp[0] = 0  -> sin servicios no se factura nada.
 *
 * RECURRENCIA (para i = 1..n)
 *   dp[i] = max( dp[i - 1],               <- no hacer el servicio i
 *                ingreso_i + dp[p(i)] )   <- hacerlo y seguir con lo compatible
 *
 * RESPUESTA
 *   dp[n]
 *
 * La tabla se llena de izquierda a derecha (bottom-up): cuando se calcula
 * dp[i], dp[i - 1] y dp[p(i)] ya estan listos porque p(i) < i.
 *
 * Tiempo:  O(n log n) por ordenar y por p(i); la tabla en si es O(n).
 * Espacio: O(n).
 */

import type { FilaDP, ResultadoDP, Servicio } from "../tipos";
import { calcularP } from "./busquedaBinaria";
import { ordenarPorFin } from "./ordenamiento";

export function llenarTabla(servicios: readonly Servicio[]): ResultadoDP {
  const ordenados = ordenarPorFin(servicios);
  const n = ordenados.length;
  const p = calcularP(ordenados);

  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 0; // caso base

  const filas: FilaDP[] = [];

  for (let i = 1; i <= n; i++) {
    const servicio = ordenados[i - 1]!;
    const saltar = dp[i - 1]!;
    const tomar = servicio.ingreso + dp[p[i]!]!;

    dp[i] = Math.max(saltar, tomar);

    filas.push({
      i,
      servicio,
      p: p[i]!,
      saltar,
      tomar,
      valor: dp[i]!,
      conviene: tomar >= saltar,
    });
  }

  return { ordenados, p, dp, filas };
}
