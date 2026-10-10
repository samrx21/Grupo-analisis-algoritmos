/** Lista de solicitudes y formulario para agregar o quitar. */

import type { Servicio } from "../tipos";
import { aHora, aPesos, escapar } from "../utilidades";

export function renderServicios(servicios: readonly Servicio[], agenda: readonly Servicio[], error: string): string {
  const ids = new Set(agenda.map((s) => s.id));
  const filas = [...servicios]
    .sort((a, b) => a.inicio - b.inicio)
    .map(
      (s) => `
      <tr class="border-b border-slate-100 last:border-0">
        <td class="py-2 px-2 font-mono text-xs text-slate-500">${s.id}</td>
        <td class="py-2 px-2"><div class="text-sm font-medium">${escapar(s.descripcion)}</div><div class="text-xs text-slate-500">${escapar(s.moto)}</div></td>
        <td class="py-2 px-2 text-sm whitespace-nowrap">${aHora(s.inicio)}–${aHora(s.fin)}</td>
        <td class="py-2 px-2 text-sm whitespace-nowrap">${aPesos(s.ingreso)}</td>
        <td class="py-2 px-2">${ids.has(s.id)
          ? '<span class="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-medium">En la agenda</span>'
          : '<span class="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-medium">Rechazado</span>'}</td>
        <td class="py-2 px-2 text-right"><button type="button" data-quitar="${s.id}" class="text-xs text-rose-600 hover:underline cursor-pointer">Quitar</button></td>
      </tr>`,
    )
    .join("");

  const campo = "mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm";

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 class="text-lg font-semibold">Solicitudes del día (${servicios.length})</h2>
        <button type="button" id="btn-restaurar" class="text-xs rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">Restaurar ejemplo</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead><tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
            <th class="py-2 px-2 font-medium">Id</th><th class="py-2 px-2 font-medium">Servicio</th><th class="py-2 px-2 font-medium">Horario</th>
            <th class="py-2 px-2 font-medium">Ingreso</th><th class="py-2 px-2 font-medium">Estado</th><th></th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="mt-6 border-t border-slate-200 pt-4">
        <h3 class="text-sm font-semibold mb-3">Agregar una solicitud</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <label class="lg:col-span-2 text-xs text-slate-600">Servicio<input id="in-descripcion" type="text" placeholder="Cambio de aceite" class="${campo}" /></label>
          <label class="text-xs text-slate-600">Inicio<input id="in-inicio" type="time" value="14:00" step="900" class="${campo}" /></label>
          <label class="text-xs text-slate-600">Fin<input id="in-fin" type="time" value="15:30" step="900" class="${campo}" /></label>
          <label class="lg:col-span-2 text-xs text-slate-600">Ingreso (COP)<input id="in-ingreso" type="number" min="0" step="5000" value="500000" class="${campo}" /></label>
          <div class="lg:col-span-6 flex items-center gap-3">
            <button type="button" id="btn-agregar" class="rounded-md bg-slate-900 text-white text-sm px-4 py-2 hover:bg-slate-700 cursor-pointer">Agregar y recalcular</button>
            <span class="text-xs text-rose-600">${escapar(error)}</span>
          </div>
        </div>
      </div>
    </section>`;
}
