/** Resultado final y comparacion contra BFS. */

import { nombreDe } from "../datos";
import type { ResultadoDijkstra, ResultadoRuta } from "../tipos";
import { aMinutos, escapar } from "../utilidades";

function ruta(ids: readonly string[], color: string): string {
  return ids
    .map((id) => `<span class="rounded-md px-2 py-0.5 text-xs font-medium ${color}">${escapar(nombreDe(id))}</span>`)
    .join('<span class="text-slate-400">→</span>');
}

function tarjeta(titulo: string, valor: string, detalle: string): string {
  return `
    <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div class="text-xs uppercase tracking-wide text-slate-500">${titulo}</div>
      <div class="text-2xl font-semibold mt-1">${valor}</div>
      <div class="text-xs text-slate-500 mt-0.5">${detalle}</div>
    </div>`;
}

export function renderResultados(d: ResultadoDijkstra, b: ResultadoRuta, totalNodos: number): string {
  if (!d.alcanzable) {
    return `
      <section class="bg-white rounded-xl border border-rose-200 p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-rose-700">No hay ruta</h2>
        <p class="text-sm text-slate-600 mt-1">
          Con las vías cerradas, el destino quedó desconectado del origen: ningún camino llega.
          Dijkstra lo detecta porque la distancia del destino se queda en infinito.
        </p>
      </section>`;
  }

  const diferencia = b.minutos - d.minutos;

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">Ruta más rápida para la grúa</h2>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        ${tarjeta("Tiempo", aMinutos(d.minutos), "de viaje de la grúa")}
        ${tarjeta("Tramos", `${d.tramos}`, "vías recorridas")}
        ${tarjeta("Iteraciones", `${d.pasos.length}`, `de ${totalNodos} nodos del mapa`)}
      </div>
      <div class="flex flex-wrap items-center gap-1.5">${ruta(d.ruta, "bg-emerald-100 text-emerald-800")}</div>

      <h3 class="text-sm font-semibold mt-6 mb-2">Comparación: Dijkstra contra BFS</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-3 font-medium">Algoritmo</th>
              <th class="py-2 pr-3 font-medium">Qué minimiza</th>
              <th class="py-2 pr-3 font-medium">Tramos</th>
              <th class="py-2 pr-3 font-medium">Minutos</th>
              <th class="py-2 font-medium">Ruta</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-3 font-semibold">Dijkstra</td>
              <td class="py-2 pr-3 text-slate-600">Tiempo total</td>
              <td class="py-2 pr-3">${d.tramos}</td>
              <td class="py-2 pr-3 font-semibold text-emerald-700">${d.minutos}</td>
              <td class="py-2"><div class="flex flex-wrap items-center gap-1">${ruta(d.ruta, "bg-emerald-100 text-emerald-800")}</div></td>
            </tr>
            <tr>
              <td class="py-2 pr-3 font-semibold">BFS</td>
              <td class="py-2 pr-3 text-slate-600">Cantidad de tramos</td>
              <td class="py-2 pr-3">${b.tramos}</td>
              <td class="py-2 pr-3 font-semibold text-violet-700">${b.minutos}</td>
              <td class="py-2"><div class="flex flex-wrap items-center gap-1">${ruta(b.ruta, "bg-violet-100 text-violet-800")}</div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-3">
        ${
          diferencia > 0
            ? `BFS encuentra un camino con menos vías, pero la grúa se demora <strong>${diferencia} minutos más</strong>.
               BFS cuenta tramos; Dijkstra suma minutos.`
            : "En este caso los dos coinciden en tiempo. Prueben otro destino o cierren una vía."
        }
      </p>
    </section>
  `;
}
