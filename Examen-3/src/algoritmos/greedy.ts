/**
 * Dos criterios voraces para comparar contra la DP:
 *   - "el que termine primero": el greedy del Examen 1 (maximiza cantidad);
 *   - "el que deje mas plata": el que haria un dueno de taller a ojo.
 * Ninguno garantiza la mayor facturacion.
 */

import type { Agenda, Servicio } from "../tipos";
import { ordenarPorFin } from "./ordenamiento";

function seleccionar(ordenados: readonly Servicio[], nombre: string): Agenda {
  const elegidos: Servicio[] = [];
  for (const s of ordenados) {
    const cabe = elegidos.every((e) => s.fin <= e.inicio || s.inicio >= e.fin);
    if (cabe) elegidos.push(s);
  }
  const seleccionados = ordenarPorFin(elegidos);
  return { nombre, seleccionados, ingreso: seleccionados.reduce((t, s) => t + s.ingreso, 0) };
}

export function greedyPorFin(servicios: readonly Servicio[]): Agenda {
  return seleccionar(ordenarPorFin(servicios), "Greedy: el que termine primero (Examen 1)");
}

export function greedyPorIngreso(servicios: readonly Servicio[]): Agenda {
  // Ordenar por ingreso descendente reutilizando el merge sort por fin no
  // aplica, asi que se hace una insercion simple: n es pequeno.
  const lista = [...servicios];
  for (let i = 1; i < lista.length; i++) {
    const actual = lista[i]!;
    let j = i - 1;
    while (j >= 0 && lista[j]!.ingreso < actual.ingreso) {
      lista[j + 1] = lista[j]!;
      j--;
    }
    lista[j + 1] = actual;
  }
  return seleccionar(lista, "Greedy: el que deje más plata");
}
