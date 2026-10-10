/**
 * La misma recurrencia escrita como recursion directa, SIN guardar
 * resultados. Sirve para mostrar por que hace falta la tabla: los mismos
 * subproblemas se recalculan una y otra vez (subproblemas superpuestos) y
 * el numero de llamadas crece de forma exponencial.
 *
 * Se compara contra la version con memoria, que resuelve cada dp[i] una vez.
 */

import type { ResultadoDP } from "../tipos";

export const TOPE_RECURSION = 30;

export interface ConteoLlamadas {
  sinMemoria: number | null;
  conMemoria: number;
}

export function contarLlamadas({ ordenados, p }: ResultadoDP): ConteoLlamadas {
  const n = ordenados.length;
  const ingreso = (i: number) => ordenados[i - 1]!.ingreso;

  // Con memoria: cada subproblema se resuelve una sola vez.
  let conMemoria = 0;
  const memo = new Map<number, number>();
  const opt = (i: number): number => {
    conMemoria++;
    if (i === 0) return 0;
    const guardado = memo.get(i);
    if (guardado !== undefined) return guardado;
    const valor = Math.max(opt(i - 1), ingreso(i) + opt(p[i]!));
    memo.set(i, valor);
    return valor;
  };
  opt(n);

  if (n > TOPE_RECURSION) return { sinMemoria: null, conMemoria };

  // Sin memoria: se cuentan las llamadas de la recursion ingenua.
  // llamadas(i) = 1 + llamadas(i - 1) + llamadas(p(i)), con llamadas(0) = 1.
  const llamadas = new Array<number>(n + 1).fill(1);
  for (let i = 1; i <= n; i++) llamadas[i] = 1 + llamadas[i - 1]! + llamadas[p[i]!]!;

  return { sinMemoria: llamadas[n]!, conMemoria };
}
