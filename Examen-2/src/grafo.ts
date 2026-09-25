/**
 * Grafo representado con LISTA DE ADYACENCIA.
 *
 * Para cada nodo se guarda la lista de sus vecinos y el peso de la via.
 * Se escogio sobre una matriz de adyacencia porque el mapa es disperso:
 * cada barrio se conecta con 2 a 4 barrios, no con todos. La lista usa
 * memoria O(V + E) y recorrer los vecinos de un nodo cuesta solo su grado.
 */

import type { Arista, Nodo } from "./tipos";

export interface Vecino {
  id: string;
  minutos: number;
}

/** Llave unica de una via, sin importar el sentido: "A|B" == "B|A". */
export function claveArista(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export class Grafo {
  private readonly adyacencia = new Map<string, Vecino[]>();

  constructor(nodos: readonly Nodo[], aristas: readonly Arista[], cerradas: ReadonlySet<string> = new Set()) {
    for (const nodo of nodos) this.adyacencia.set(nodo.id, []);

    for (const arista of aristas) {
      // Una via cerrada simplemente no existe para el algoritmo.
      if (cerradas.has(claveArista(arista.a, arista.b))) continue;
      // No dirigido: se agrega en los dos sentidos.
      this.adyacencia.get(arista.a)!.push({ id: arista.b, minutos: arista.minutos });
      this.adyacencia.get(arista.b)!.push({ id: arista.a, minutos: arista.minutos });
    }
  }

  nodos(): string[] {
    return [...this.adyacencia.keys()];
  }

  vecinos(id: string): readonly Vecino[] {
    return this.adyacencia.get(id) ?? [];
  }

  /** Minutos de la via directa entre dos nodos. */
  peso(a: string, b: string): number {
    return this.vecinos(a).find((v) => v.id === b)?.minutos ?? Infinity;
  }
}
