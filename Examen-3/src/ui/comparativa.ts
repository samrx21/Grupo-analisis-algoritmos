/**
 * Comparativa: la DP contra dos greedy y contra la fuerza bruta, y el costo
 * de la recursion sin memoria contra la tabla.
 */

import type { ConteoLlamadas } from "../algoritmos/recursionIngenua";
import type { ResultadoFuerzaBruta } from "../algoritmos/fuerzaBruta";
import { TOPE_FUERZA_BRUTA } from "../algoritmos/fuerzaBruta";
import type { Agenda } from "../tipos";
import { aPesos, escapar } from "../utilidades";

export function renderComparativa(
  agendas: readonly Agenda[],
  optimo: number,
  fb: ResultadoFuerzaBruta | null,
  llamadas: ConteoLlamadas,
  n: number,
): string {
  const filas = agendas
    .map((a, k) => {
      const esDP = k === 0;
      const diferencia = optimo - a.ingreso;
      return `
        <tr class="border-b border-slate-100 last:border-0 ${esDP ? "bg-emerald-50" : ""}">
          <td class="py-2 px-2 text-sm ${esDP ? "font-semibold" : ""}">${escapar(a.nombre)}</td>
          <td class="py-2 px-2 text-sm">${a.seleccionados.length}</td>
          <td class="py-2 px-2 text-sm font-semibold ${esDP ? "text-emerald-700" : ""}">${aPesos(a.ingreso)}</td>
          <td class="py-2 px-2 text-sm ${diferencia > 0 ? "text-rose-600" : "text-emerald-700"}">${diferencia > 0 ? `− ${aPesos(diferencia)}` : "óptimo"}</td>
          <td class="py-2 px-2 text-xs text-slate-500 font-mono">${a.seleccionados.map((s) => s.id).join(", ")}</td>
        </tr>`;
    })
    .join("");

  const juez = fb
    ? `La fuerza bruta revisó los <strong>${fb.subconjuntos.toLocaleString("es-CO")}</strong> subconjuntos posibles y el máximo es
       <strong>${aPesos(fb.ingreso)}</strong>. ${fb.ingreso === optimo ? "Coincide con dp[n]." : "<strong class='text-rose-600'>No coincide.</strong>"}`
    : `Con ${n} servicios la fuerza bruta se desactiva (más de ${TOPE_FUERZA_BRUTA}): serían 2^${n} subconjuntos.`;

  const recursion = llamadas.sinMemoria !== null
    ? `La misma recurrencia escrita como recursión <strong>sin guardar resultados</strong> hace
       <strong>${llamadas.sinMemoria.toLocaleString("es-CO")}</strong> llamadas, porque recalcula los mismos dp[i] muchas veces.
       Con la tabla (o con memoria) basta con <strong>${llamadas.conMemoria}</strong>.`
    : `Con ${n} servicios la recursión sin memoria ya sería demasiado lenta para contarla; con la tabla son ${llamadas.conMemoria} llamadas.`;

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Resultados y comparación</h2>
      <p class="text-sm text-slate-600 mb-4">Las mismas solicitudes, cuatro formas de armar la agenda.</p>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 px-2 font-medium">Estrategia</th>
              <th class="py-2 px-2 font-medium">Motos</th>
              <th class="py-2 px-2 font-medium">Facturación</th>
              <th class="py-2 px-2 font-medium">Frente al óptimo</th>
              <th class="py-2 px-2 font-medium">Servicios</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <p class="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"><strong>Verificación.</strong> ${juez}</p>
        <p class="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"><strong>¿Por qué una tabla?</strong> ${recursion}</p>
      </div>
    </section>`;
}
