/**
 * Fuerza bruta: prueba TODAS las combinaciones posibles de servicios y se
 * queda con la mejor. Sirve como "juez" para comprobar que el greedy por hora
 * de finalizacion si esta dando el maximo, y para mostrar en vivo la diferencia
 * de costo entre O(n log n) y O(2^n).
 *
 * Complejidad: O(2^n). Por eso hay un tope: mas alla de 20 servicios el
 * navegador se congelaria.
 */

import type { Servicio } from "../tipos";
import { mergeSort } from "./ordenamiento";

export const TOPE_FUERZA_BRUTA = 20;

export interface ResultadoFuerzaBruta {
  /** La mejor agenda encontrada. */
  seleccionados: Servicio[];
  /** Cuantas combinaciones completas se evaluaron. */
  combinaciones: number;
}

export function optimoPorFuerzaBruta(
  servicios: readonly Servicio[],
): ResultadoFuerzaBruta | null {
  if (servicios.length > TOPE_FUERZA_BRUTA) return null;

  const ordenados = mergeSort(servicios, (a, b) => a.inicio - b.inicio).datos;

  let mejor: Servicio[] = [];
  let combinaciones = 0;

  // En cada servicio hay dos caminos: incluirlo (si cabe) o saltarlo.
  const explorar = (indice: number, actual: Servicio[], finActual: number): void => {
    if (indice === ordenados.length) {
      combinaciones++;
      if (actual.length > mejor.length) mejor = [...actual];
      return;
    }

    const servicio = ordenados[indice]!;

    // Camino 1: incluirlo, solo si no se cruza con lo que ya lleva.
    if (servicio.inicio >= finActual) {
      actual.push(servicio);
      explorar(indice + 1, actual, servicio.fin);
      actual.pop();
    }

    // Camino 2: saltarlo.
    explorar(indice + 1, actual, finActual);
  };

  explorar(0, [], 0);

  return { seleccionados: mejor, combinaciones };
}
