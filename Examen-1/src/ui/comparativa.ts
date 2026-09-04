/**
 * Comparativa: corre las cuatro estrategias sobre los mismos datos y las
 * enfrenta contra la solucion optima obtenida por fuerza bruta.
 *
 * Esta seccion es la que responde la pregunta obvia del profesor:
 * "y como saben ustedes que ese greedy si da el maximo?".
 */

import { ESTRATEGIAS } from "../algoritmos/estrategias";
import { planificar } from "../algoritmos/greedy";
import { optimoPorFuerzaBruta, TOPE_FUERZA_BRUTA } from "../algoritmos/fuerzaBruta";
import type { Servicio } from "../tipos";
import { aPesos, escapar } from "../utilidades";

export function renderComparativa(servicios: readonly Servicio[]): string {
  const optimo = optimoPorFuerzaBruta(servicios);

  const filas = ESTRATEGIAS.map((estrategia) => {
    const r = planificar(servicios, estrategia.comparador, estrategia.id);
    const alcanzaOptimo = optimo !== null && r.seleccionados.length === optimo.seleccionados.length;

    const marca =
      optimo === null
        ? `<span class="text-slate-400">-</span>`
        : alcanzaOptimo
          ? `<span class="text-emerald-600 font-semibold">Si</span>`
          : `<span class="text-rose-600 font-semibold">No</span>`;

    return `
      <tr class="border-b border-slate-100 last:border-0">
        <td class="py-2 pr-3">
          <div class="text-sm font-medium">${escapar(estrategia.nombre)}</div>
          <div class="text-xs text-slate-500">${escapar(estrategia.criterio)}</div>
        </td>
        <td class="py-2 pr-3 text-sm font-semibold">${r.seleccionados.length}</td>
        <td class="py-2 pr-3 text-sm text-slate-600 whitespace-nowrap">${aPesos(r.ingresoTotal)}</td>
        <td class="py-2 pr-3 text-sm text-slate-600">${r.comparaciones}</td>
        <td class="py-2 text-sm">${marca}</td>
      </tr>
    `;
  }).join("");

  const notaOptimo =
    optimo === null
      ? `<p class="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
           Hay mas de ${TOPE_FUERZA_BRUTA} solicitudes, asi que la verificacion por fuerza bruta
           se desactiva: evaluarlas todas seria del orden de 2^n combinaciones y el navegador
           se quedaria colgado. Esa es justamente la razon de usar un greedy.
         </p>`
      : `<p class="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
           La fuerza bruta evaluo <strong>${optimo.combinaciones.toLocaleString("es-CO")}</strong>
           combinaciones para confirmar que el maximo posible es
           <strong>${optimo.seleccionados.length}</strong> servicios.
           El greedy por hora de finalizacion llega al mismo numero recorriendo la lista una sola vez.
         </p>`;

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Comparativa de criterios</h2>
      <p class="text-sm text-slate-600 mb-4">
        Los cuatro criterios corriendo sobre exactamente los mismos datos.
      </p>

      <div class="overflow-x-auto mb-4">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-3 font-medium">Criterio</th>
              <th class="py-2 pr-3 font-medium">Atendidos</th>
              <th class="py-2 pr-3 font-medium">Facturacion</th>
              <th class="py-2 pr-3 font-medium">Comparaciones</th>
              <th class="py-2 font-medium">Llega al optimo</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      ${notaOptimo}

      <p class="text-xs text-slate-500 mt-3">
        Ojo con la columna de facturacion: el criterio "el que deje mas plata" puede
        facturar mas atendiendo menos motos. El greedy por hora de finalizacion es
        optimo para <em>maximizar la cantidad de servicios</em>, que es el objetivo
        que definimos en este problema, no para maximizar ingresos.
      </p>
    </section>
  `;
}
