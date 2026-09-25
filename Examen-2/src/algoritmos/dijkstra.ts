/**
 * Algoritmo de Dijkstra: camino mas corto desde un origen en un grafo con
 * pesos NO negativos.
 *
 * Idea:
 *   1. Todas las distancias arrancan en infinito, menos el origen, que es 0.
 *   2. Se saca de la cola el nodo con menor distancia conocida. Como no hay
 *      pesos negativos, ningun otro camino puede mejorarla: queda DEFINITIVA.
 *   3. Se RELAJAN sus vecinos: si llegar a un vecino pasando por este nodo es
 *      mas rapido que lo que se conocia, se actualiza y se anota de donde vino.
 *   4. Se repite hasta sacar el destino (o vaciar la cola).
 *
 * Complejidad con min-heap: O((V + E) log V).
 */

import type { Grafo } from "../grafo";
import type { PasoDijkstra, Relajacion, ResultadoDijkstra } from "../tipos";
import { ColaPrioridad } from "./colaPrioridad";

export function dijkstra(grafo: Grafo, origen: string, destino: string): ResultadoDijkstra {
  const distancia: Record<string, number> = {};
  const previo: Record<string, string | null> = {};
  const visitados = new Set<string>();
  const pasos: PasoDijkstra[] = [];

  // Paso 1: todo en infinito, el origen en 0.
  for (const id of grafo.nodos()) {
    distancia[id] = Infinity;
    previo[id] = null;
  }
  distancia[origen] = 0;

  const cola = new ColaPrioridad<string>();
  cola.insertar(origen, 0);

  while (!cola.estaVacia()) {
    // Paso 2: el de menor distancia conocida.
    const { valor: actual, prioridad } = cola.extraerMinimo()!;

    // Un nodo puede quedar repetido en la cola con una distancia vieja.
    // Si ya es definitivo, esa entrada se ignora.
    if (visitados.has(actual)) continue;
    visitados.add(actual);

    // Paso 3: relajar los vecinos.
    const relajaciones: Relajacion[] = [];
    for (const vecino of grafo.vecinos(actual)) {
      if (visitados.has(vecino.id)) continue;

      const antes = distancia[vecino.id]!;
      const candidata = prioridad + vecino.minutos;
      const mejora = candidata < antes;

      if (mejora) {
        distancia[vecino.id] = candidata;
        previo[vecino.id] = actual;
        cola.insertar(vecino.id, candidata);
      }
      relajaciones.push({ hacia: vecino.id, antes, candidata, mejora });
    }

    pasos.push({
      numero: pasos.length + 1,
      actual,
      distanciaActual: prioridad,
      relajaciones,
      distancias: { ...distancia },
      visitados: [...visitados],
      frontera: grafo
        .nodos()
        .filter((id) => !visitados.has(id) && distancia[id] !== Infinity),
    });

    // Paso 4: cuando el destino sale de la cola, su distancia ya es la minima.
    if (actual === destino) break;
  }

  // Reconstruir la ruta siguiendo los "previo" desde el destino hacia atras.
  const alcanzable = distancia[destino] !== Infinity;
  const ruta: string[] = [];
  if (alcanzable) {
    let nodo: string | null = destino;
    while (nodo !== null) {
      ruta.unshift(nodo);
      nodo = previo[nodo] ?? null;
    }
  }

  return {
    alcanzable,
    ruta,
    minutos: distancia[destino]!,
    tramos: Math.max(ruta.length - 1, 0),
    pasos,
  };
}
