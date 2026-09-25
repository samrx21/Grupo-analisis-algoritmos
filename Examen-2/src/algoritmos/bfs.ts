/**
 * BFS (busqueda en anchura). Se usa solo como COMPARACION.
 *
 * BFS encuentra el camino con MENOS TRAMOS, porque explora por niveles y
 * no mira los pesos. En un mapa donde cada via tarda distinto, "menos
 * tramos" no significa "menos minutos". Mostrar esa diferencia es lo que
 * justifica usar Dijkstra.
 *
 * Complejidad: O(V + E).
 */

import type { Grafo } from "../grafo";
import type { ResultadoRuta } from "../tipos";

export function bfs(grafo: Grafo, origen: string, destino: string): ResultadoRuta {
  const previo = new Map<string, string | null>([[origen, null]]);
  const cola: string[] = [origen];

  while (cola.length > 0) {
    const actual = cola.shift()!;
    if (actual === destino) break;
    for (const vecino of grafo.vecinos(actual)) {
      if (!previo.has(vecino.id)) {
        previo.set(vecino.id, actual);
        cola.push(vecino.id);
      }
    }
  }

  if (!previo.has(destino)) {
    return { alcanzable: false, ruta: [], minutos: Infinity, tramos: 0 };
  }

  const ruta: string[] = [];
  let nodo: string | null = destino;
  while (nodo !== null) {
    ruta.unshift(nodo);
    nodo = previo.get(nodo) ?? null;
  }

  let minutos = 0;
  for (let i = 0; i < ruta.length - 1; i++) minutos += grafo.peso(ruta[i]!, ruta[i + 1]!);

  return { alcanzable: true, ruta, minutos, tramos: ruta.length - 1 };
}
