/** Controles: origen, destino y cierre de vias. */

import { claveArista } from "../grafo";
import type { Arista, Nodo } from "../tipos";
import { escapar } from "../utilidades";
import { nombreDe } from "../datos";

export function renderControles(
  nodos: readonly Nodo[],
  aristas: readonly Arista[],
  origen: string,
  destino: string,
  cerradas: ReadonlySet<string>,
  mostrarBfs: boolean,
): string {
  const opciones = (seleccionado: string) =>
    nodos
      .map((n) => `<option value="${n.id}" ${n.id === seleccionado ? "selected" : ""}>${escapar(n.nombre)}</option>`)
      .join("");

  const viasAbiertas = aristas
    .filter((a) => !cerradas.has(claveArista(a.a, a.b)))
    .map((a) => {
      const clave = claveArista(a.a, a.b);
      return `<option value="${clave}">${escapar(nombreDe(a.a))} — ${escapar(nombreDe(a.b))} (${a.minutos} min)</option>`;
    })
    .join("");

  const chipsCerradas = [...cerradas]
    .map((clave) => {
      const [a, b] = clave.split("|");
      return `
        <span class="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-1">
          ${escapar(nombreDe(a!))} — ${escapar(nombreDe(b!))}
          <button type="button" data-reabrir="${clave}" class="font-semibold hover:underline cursor-pointer">Reabrir</button>
        </span>`;
    })
    .join("");

  const clasesSelect = "mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm bg-white";

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">Servicio de grúa</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="text-xs text-slate-600">Sale desde
          <select id="sel-origen" class="${clasesSelect}">${opciones(origen)}</select>
        </label>
        <label class="text-xs text-slate-600">Moto varada en
          <select id="sel-destino" class="${clasesSelect}">${opciones(destino)}</select>
        </label>
      </div>

      <div class="mt-5 border-t border-slate-200 pt-4">
        <h3 class="text-sm font-semibold mb-2">Cerrar una vía (trancón, obra, accidente)</h3>
        <div class="flex flex-col sm:flex-row gap-2">
          <select id="sel-via" class="${clasesSelect} sm:mt-0">${viasAbiertas}</select>
          <button type="button" id="btn-cerrar"
            class="shrink-0 rounded-md bg-rose-600 text-white text-sm px-4 py-2 hover:bg-rose-700 cursor-pointer">
            Cerrar vía
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">${chipsCerradas || '<span class="text-xs text-slate-500">Todas las vías están abiertas.</span>'}</div>
      </div>

      <div class="mt-5 border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3">
        <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input id="chk-bfs" type="checkbox" ${mostrarBfs ? "checked" : ""} class="w-4 h-4 accent-violet-600" />
          Mostrar la ruta de BFS en el mapa
        </label>
        <button type="button" id="btn-restaurar"
          class="text-xs rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
          Restaurar ejemplo
        </button>
      </div>
    </section>
  `;
}
