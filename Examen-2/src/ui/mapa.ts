/**
 * Dibujo del grafo en SVG.
 *
 * Colores de los nodos:
 *   - Morado:  origen y destino.
 *   - Ambar:   el nodo que el algoritmo esta procesando en este paso.
 *   - Oscuro:  visitado (distancia definitiva).
 *   - Azul:    en la frontera (descubierto, esperando en la cola).
 *   - Blanco:  todavia no descubierto (distancia infinita).
 */

import { claveArista } from "../grafo";
import type { Arista, Nodo, PasoDijkstra } from "../tipos";
import { escapar } from "../utilidades";

export interface OpcionesMapa {
  nodos: readonly Nodo[];
  aristas: readonly Arista[];
  cerradas: ReadonlySet<string>;
  origen: string;
  destino: string;
  paso: PasoDijkstra | undefined;
  /** false en el resultado final: ya no hay un nodo "procesandose". */
  resaltarActual: boolean;
  /** Ruta a resaltar en verde. Vacia en modo paso a paso. */
  rutaDijkstra: readonly string[];
  /** Ruta BFS, se dibuja punteada si el usuario la activa. */
  rutaBfs: readonly string[];
}

function tramosDe(ruta: readonly string[]): Set<string> {
  const tramos = new Set<string>();
  for (let i = 0; i < ruta.length - 1; i++) tramos.add(claveArista(ruta[i]!, ruta[i + 1]!));
  return tramos;
}

function etiquetaNodo(n: Nodo): string {
  let x = n.x;
  let y = n.y - 24;
  let ancla = "middle";
  if (n.etiqueta === "abajo") y = n.y + 34;
  if (n.etiqueta === "izquierda") {
    x = n.x - 24;
    y = n.y + 4;
    ancla = "end";
  }
  return `<text x="${x}" y="${y}" text-anchor="${ancla}" font-size="12" font-weight="600" fill="#0f172a">${escapar(n.nombre)}</text>`;
}

export function renderMapa(o: OpcionesMapa): string {
  const posicion = new Map(o.nodos.map((n) => [n.id, n]));
  const tramosDijkstra = tramosDe(o.rutaDijkstra);
  const tramosBfs = tramosDe(o.rutaBfs);
  const visitados = new Set(o.paso?.visitados ?? []);
  const frontera = new Set(o.paso?.frontera ?? []);

  const lineas = o.aristas
    .map((arista) => {
      const a = posicion.get(arista.a)!;
      const b = posicion.get(arista.b)!;
      const clave = claveArista(arista.a, arista.b);
      const cerrada = o.cerradas.has(clave);
      const enRuta = tramosDijkstra.has(clave);

      let trazo = 'stroke="#cbd5e1" stroke-width="3"';
      if (cerrada) trazo = 'stroke="#e11d48" stroke-width="3" stroke-dasharray="6 6"';
      else if (enRuta) trazo = 'stroke="#059669" stroke-width="7" stroke-linecap="round"';

      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;

      const bfs = tramosBfs.has(clave)
        ? `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#7c3aed" stroke-width="3" stroke-dasharray="4 5" />`
        : "";

      return `
        <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" ${trazo} />
        ${bfs}
        <g>
          <rect x="${mx - 13}" y="${my - 9}" width="26" height="18" rx="4" fill="white" stroke="#e2e8f0" />
          <text x="${mx}" y="${my + 4}" text-anchor="middle" font-size="11" font-weight="600"
            fill="${cerrada ? "#e11d48" : "#334155"}">${cerrada ? "X" : arista.minutos}</text>
        </g>
      `;
    })
    .join("");

  const circulos = o.nodos
    .map((n) => {
      const esExtremo = n.id === o.origen || n.id === o.destino;
      const esActual = o.resaltarActual && o.paso?.actual === n.id;

      let relleno = "#ffffff";
      let borde = "#94a3b8";
      if (frontera.has(n.id)) { relleno = "#bae6fd"; borde = "#0284c7"; }
      if (visitados.has(n.id)) { relleno = "#334155"; borde = "#0f172a"; }
      if (esActual) { relleno = "#f59e0b"; borde = "#b45309"; }
      if (esExtremo && !esActual) borde = "#7c3aed";

      const distancia = o.paso?.distancias[n.id] ?? Infinity;
      const colorTextoInterno = visitados.has(n.id) && !esActual ? "#ffffff" : "#0f172a";

      return `
        <g>
          <circle cx="${n.x}" cy="${n.y}" r="17" fill="${relleno}" stroke="${borde}"
            stroke-width="${esExtremo ? 4 : 2}" />
          <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-size="10" font-weight="700"
            fill="${colorTextoInterno}">${distancia === Infinity ? "∞" : distancia}</text>
          ${etiquetaNodo(n)}
        </g>
      `;
    })
    .join("");

  const leyenda = [
    ["#ffffff", "#94a3b8", "Sin descubrir (∞)"],
    ["#bae6fd", "#0284c7", "En la cola"],
    ["#f59e0b", "#b45309", "Procesando ahora"],
    ["#334155", "#0f172a", "Distancia definitiva"],
  ]
    .map(
      ([fondo, borde, texto]) => `
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block w-3.5 h-3.5 rounded-full border-2" style="background:${fondo};border-color:${borde}"></span>
          ${texto}
        </span>`,
    )
    .join("");

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Mapa de la ciudad (grafo)</h2>
      <p class="text-sm text-slate-600 mb-3">
        Cada círculo es un nodo y el número de adentro es la distancia que conoce el algoritmo.
        Cada línea es una vía y su número son los minutos que tarda la grúa.
      </p>
      <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mb-3">
        ${leyenda}
        <span class="inline-flex items-center gap-1.5"><span class="inline-block w-5 h-1.5 rounded bg-emerald-600"></span>Ruta de Dijkstra</span>
        <span class="inline-flex items-center gap-1.5"><span class="inline-block w-5 border-t-2 border-dashed border-violet-600"></span>Ruta de BFS</span>
        <span class="inline-flex items-center gap-1.5"><span class="inline-block w-5 border-t-2 border-dashed border-rose-600"></span>Vía cerrada</span>
      </div>
      <div class="overflow-x-auto">
        <svg viewBox="140 0 520 550" class="w-full min-w-[520px] max-h-[620px]" role="img"
          aria-label="Grafo del mapa">
          ${lineas}
          ${circulos}
        </svg>
      </div>
    </section>
  `;
}
