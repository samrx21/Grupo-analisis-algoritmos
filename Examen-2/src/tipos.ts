/**
 * Tipos del dominio.
 *
 * El mapa se modela como un grafo:
 *   - Cada barrio o punto de la ciudad es un NODO.
 *   - Cada via que conecta dos puntos es una ARISTA.
 *   - El PESO de la arista son los minutos que tarda la grua en recorrerla.
 * Las vias son de doble sentido, asi que el grafo es NO DIRIGIDO.
 */

export interface Nodo {
  id: string;
  nombre: string;
  /** Posicion en el dibujo del mapa (coordenadas del SVG). */
  x: number;
  y: number;
  /** Donde va el nombre respecto al circulo, para que no choque con las vias. */
  etiqueta?: "arriba" | "abajo" | "izquierda";
}

export interface Arista {
  a: string;
  b: string;
  /** Minutos que tarda la grua en recorrer esta via. */
  minutos: number;
}

/** Lo que paso al revisar un vecino desde el nodo actual. */
export interface Relajacion {
  hacia: string;
  /** Mejor distancia conocida antes de revisar. Infinity = no se conocia camino. */
  antes: number;
  /** Distancia pasando por el nodo actual. */
  candidata: number;
  /** true si la candidata mejoro la distancia conocida. */
  mejora: boolean;
}

/** Foto del algoritmo en una iteracion. Sirve para el modo paso a paso. */
export interface PasoDijkstra {
  numero: number;
  /** Nodo que se saco de la cola de prioridad en esta iteracion. */
  actual: string;
  /** Su distancia, que a partir de aqui es definitiva. */
  distanciaActual: number;
  relajaciones: Relajacion[];
  /** Copia de todas las distancias al terminar la iteracion. */
  distancias: Record<string, number>;
  /** Nodos con distancia ya definitiva. */
  visitados: string[];
  /** Nodos descubiertos que siguen esperando en la cola. */
  frontera: string[];
}

export interface ResultadoRuta {
  alcanzable: boolean;
  /** Ids de los nodos del camino, desde el origen hasta el destino. */
  ruta: string[];
  minutos: number;
  tramos: number;
}

export interface ResultadoDijkstra extends ResultadoRuta {
  pasos: PasoDijkstra[];
}
