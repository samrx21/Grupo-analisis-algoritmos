/**
 * Tabla de solicitudes + formulario para agregar una nueva.
 *
 * Poder agregar y quitar servicios en vivo es lo que permite mostrar en la
 * sustentacion que el algoritmo se esta ejecutando de verdad sobre datos
 * variables, y no que hay un resultado quemado en el codigo.
 */

import type { Servicio } from "../tipos";
import { aDuracion, aHora, aPesos, escapar } from "../utilidades";

export function renderTablaServicios(
  servicios: readonly Servicio[],
  seleccionados: readonly Servicio[],
): string {
  const ids = new Set(seleccionados.map((s) => s.id));

  const filas = servicios
    .map((s) => {
      const entro = ids.has(s.id);
      const etiqueta = entro
        ? `<span class="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-medium">Atendido</span>`
        : `<span class="inline-block rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-medium">Rechazado</span>`;

      return `
        <tr class="border-b border-slate-100 last:border-0">
          <td class="py-2 pr-3 font-mono text-xs text-slate-500">${s.id}</td>
          <td class="py-2 pr-3">
            <div class="font-medium text-sm">${escapar(s.descripcion)}</div>
            <div class="text-xs text-slate-500">${escapar(s.moto)}</div>
          </td>
          <td class="py-2 pr-3 text-sm whitespace-nowrap">${aHora(s.inicio)} - ${aHora(s.fin)}</td>
          <td class="py-2 pr-3 text-sm text-slate-600 whitespace-nowrap">${aDuracion(s.fin - s.inicio)}</td>
          <td class="py-2 pr-3 text-sm text-slate-600 whitespace-nowrap">${aPesos(s.ingreso)}</td>
          <td class="py-2 pr-3">${etiqueta}</td>
          <td class="py-2 text-right">
            <button
              type="button"
              data-eliminar="${s.id}"
              class="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >Quitar</button>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 class="text-lg font-semibold">Solicitudes del dia (${servicios.length})</h2>
        <button
          type="button"
          id="btn-restaurar"
          class="text-xs rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50 cursor-pointer"
        >Restaurar ejemplo</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-3 font-medium">Id</th>
              <th class="py-2 pr-3 font-medium">Servicio</th>
              <th class="py-2 pr-3 font-medium">Horario</th>
              <th class="py-2 pr-3 font-medium">Duracion</th>
              <th class="py-2 pr-3 font-medium">Ingreso</th>
              <th class="py-2 pr-3 font-medium">Estado</th>
              <th class="py-2"></th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      <div class="mt-6 border-t border-slate-200 pt-4">
        <h3 class="text-sm font-semibold mb-3">Agregar una solicitud nueva</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <label class="lg:col-span-2 text-xs text-slate-600">
            Moto
            <input id="in-moto" type="text" placeholder="Boxer CT 100 · ABC12D"
              class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <label class="lg:col-span-2 text-xs text-slate-600">
            Servicio
            <input id="in-descripcion" type="text" placeholder="Cambio de aceite"
              class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <label class="text-xs text-slate-600">
            Inicio
            <input id="in-inicio" type="time" value="09:00" step="900"
              class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <label class="text-xs text-slate-600">
            Fin
            <input id="in-fin" type="time" value="10:00" step="900"
              class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <label class="lg:col-span-2 text-xs text-slate-600">
            Ingreso (COP)
            <input id="in-ingreso" type="number" min="0" step="5000" value="100000"
              class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm" />
          </label>
          <div class="lg:col-span-4 flex items-center gap-3">
            <button
              type="button"
              id="btn-agregar"
              class="rounded-md bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-700 cursor-pointer"
            >Agregar y recalcular</button>
            <span id="mensaje-error" class="text-xs text-rose-600"></span>
          </div>
        </div>
      </div>
    </section>
  `;
}
