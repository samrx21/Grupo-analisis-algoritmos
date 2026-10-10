/** Linea de tiempo: todas las solicitudes arriba, la agenda optima abajo. */

import type { Servicio } from "../tipos";
import { APERTURA, CIERRE, aHora, aPesos, escapar } from "../utilidades";

const VENTANA = CIERRE - APERTURA;

function carriles(servicios: readonly Servicio[]): Servicio[][] {
  const lista = [...servicios].sort((a, b) => a.inicio - b.inicio);
  const salida: Servicio[][] = [];
  for (const s of lista) {
    const carril = salida.find((c) => c[c.length - 1]!.fin <= s.inicio);
    if (carril) carril.push(s);
    else salida.push([s]);
  }
  return salida;
}

function regla(): string {
  let marcas = "";
  for (let m = APERTURA; m <= CIERRE; m += 60) {
    const x = ((m - APERTURA) / VENTANA) * 100;
    marcas += `<div class="absolute top-0 bottom-0 border-l border-slate-200" style="left:${x}%"><span class="absolute -top-5 -translate-x-1/2 text-[10px] text-slate-500">${aHora(m)}</span></div>`;
  }
  return marcas;
}

function pista(servicios: readonly Servicio[], elegidos: ReadonlySet<string>): string {
  const lista = carriles(servicios);
  if (lista.length === 0) return '<p class="text-sm text-slate-500">No hay servicios.</p>';
  return lista
    .map(
      (carril) => `
      <div class="relative h-12 rounded-lg bg-slate-50 border border-slate-200">
        ${regla()}
        ${carril
          .map((s) => {
            const x = ((s.inicio - APERTURA) / VENTANA) * 100;
            const w = ((s.fin - s.inicio) / VENTANA) * 100;
            const color = elegidos.has(s.id)
              ? "bg-emerald-500 border-emerald-600 text-white"
              : "bg-slate-300 border-slate-400 text-slate-700";
            return `<div class="absolute top-1 bottom-1 rounded-md border px-2 py-0.5 overflow-hidden ${color}" style="left:${x}%;width:${w}%" title="${escapar(s.descripcion)} · ${aHora(s.inicio)}–${aHora(s.fin)} · ${aPesos(s.ingreso)}">
              <span class="block text-[11px] font-semibold leading-tight truncate">${s.id}</span>
              <span class="block text-[10px] leading-tight truncate">${aPesos(s.ingreso)}</span>
            </div>`;
          })
          .join("")}
      </div>`,
    )
    .join("");
}

export function renderLineaTiempo(todos: readonly Servicio[], agenda: readonly Servicio[]): string {
  const ids = new Set(agenda.map((s) => s.id));
  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Línea de tiempo de la bahía</h2>
      <p class="text-sm text-slate-600 mb-6">Verde = entra a la agenda de mayor facturación. Gris = se rechaza.</p>
      <h3 class="text-sm font-semibold text-slate-700 mb-6">Todas las solicitudes</h3>
      <div class="space-y-2 mb-8">${pista(todos, ids)}</div>
      <h3 class="text-sm font-semibold text-slate-700 mb-6">Agenda óptima</h3>
      <div class="space-y-2">${pista(agenda, ids)}</div>
    </section>`;
}
