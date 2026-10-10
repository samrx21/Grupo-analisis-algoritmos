/**
 * Fuerza bruta: prueba los 2^n subconjuntos de servicios, descarta los que
 * tienen cruces y se queda con el de mayor facturacion. Es el juez para
 * comprobar que la tabla da el optimo. O(2^n * n), por eso tiene tope.
 */

import type { Servicio } from "../tipos";
import { ordenarPorFin } from "./ordenamiento";

export const TOPE_FUERZA_BRUTA = 18;

export interface ResultadoFuerzaBruta {
  ingreso: number;
  subconjuntos: number;
}

export function fuerzaBruta(servicios: readonly Servicio[]): ResultadoFuerzaBruta | null {
  const n = servicios.length;
  if (n > TOPE_FUERZA_BRUTA) return null;

  const ordenados = ordenarPorFin(servicios);
  let mejor = 0;
  const total = 1 << n;

  for (let mascara = 0; mascara < total; mascara++) {
    let ingreso = 0;
    let finAnterior = -1;
    let valido = true;

    for (let k = 0; k < n && valido; k++) {
      if (!(mascara & (1 << k))) continue;
      const s = ordenados[k]!;
      if (s.inicio < finAnterior) valido = false;
      else {
        ingreso += s.ingreso;
        finAnterior = s.fin;
      }
    }

    if (valido && ingreso > mejor) mejor = ingreso;
  }

  return { ingreso: mejor, subconjuntos: total };
}
