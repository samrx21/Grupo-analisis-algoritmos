/** Tabla con todas las iteraciones del algoritmo. */

import { nombreDe } from "../datos";
import type { PasoDijkstra } from "../tipos";
import { aMinutos, escapar } from "../utilidades";

export function renderTraza(pasos: readonly PasoDijkstra[], indiceActual: number | null): string {
  const filas = pasos
    .map((p, i) => {
      const resaltada = i === indiceActual ? "bg-amber-50" : "";
      const detalle = p.relajaciones.length
        ? p.relajaciones
            .map(
              (r) =>
                `<span class="${r.mejora ? "text-emerald-700" : "text-slate-400"}">${escapar(nombreDe(r.hacia))}: ${aMinutos(r.antes)} → ${r.candidata}${r.mejora ? " ✔" : " ✘"}</span>`,
            )
            .join("<br>")
        : '<span class="text-slate-400">—</span>';

      return `
        <tr class="border-b border-slate-100 last:border-0 align-top ${resaltada}">
          <td class="py-2 pr-3 text-xs text-slate-500">${p.numero}</td>
          <td class="py-2 pr-3 font-medium">${escapar(nombreDe(p.actual))}</td>
          <td class="py-2 pr-3 whitespace-nowrap">${p.distanciaActual} min</td>
          <td class="py-2 text-xs font-mono">${detalle}</td>
        </tr>`;
    })
    .join("");

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Traza completa del algoritmo</h2>
      <p class="text-sm text-slate-600 mb-4">
        Cada fila es una iteración: qué nodo salió de la cola y qué pasó con cada vecino.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-3 font-medium">#</th>
              <th class="py-2 pr-3 font-medium">Sale de la cola</th>
              <th class="py-2 pr-3 font-medium">Distancia</th>
              <th class="py-2 font-medium">Vecinos relajados</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
    </section>
  `;
}
