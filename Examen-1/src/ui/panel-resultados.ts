/**
 * Panel de resultados: metricas de la agenda y la traza paso a paso.
 *
 * La traza es la parte importante para sustentar: muestra iteracion por
 * iteracion que decidio el algoritmo y por que, en el orden exacto en que
 * quedaron los servicios despues del merge sort.
 */

import type { Estrategia } from "../algoritmos/estrategias";
import { ESTRATEGIAS } from "../algoritmos/estrategias";
import type { Resultado, Servicio } from "../tipos";
import { CIERRE, APERTURA, aHora, aPesos, escapar } from "../utilidades";

function tarjeta(titulo: string, valor: string, detalle: string): string {
  return `
    <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div class="text-xs uppercase tracking-wide text-slate-500">${titulo}</div>
      <div class="text-2xl font-semibold mt-1">${valor}</div>
      <div class="text-xs text-slate-500 mt-0.5">${detalle}</div>
    </div>
  `;
}

export function renderSelectorEstrategia(actual: Estrategia): string {
  const botones = ESTRATEGIAS.map((e) => {
    const activo = e.id === actual.id;
    const clases = activo
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
    const sello = e.optima
      ? `<span class="ml-2 text-[10px] uppercase tracking-wide ${activo ? "text-emerald-300" : "text-emerald-600"}">optimo</span>`
      : "";
    return `
      <button type="button" data-estrategia="${e.id}"
        class="text-left rounded-lg border px-4 py-3 text-sm cursor-pointer ${clases}">
        <span class="font-semibold">${escapar(e.nombre)}</span>${sello}
        <span class="block text-xs mt-1 ${activo ? "text-slate-300" : "text-slate-500"}">${escapar(e.criterio)}</span>
      </button>
    `;
  }).join("");

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Criterio de seleccion</h2>
      <p class="text-sm text-slate-600 mb-4">
        El esquema greedy es el mismo para los cuatro. Lo unico que cambia es
        con que criterio se ordenan los servicios antes de recorrerlos.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">${botones}</div>
    </section>
  `;
}

export function renderMetricas(
  resultado: Resultado,
  total: number,
  estrategia: Estrategia,
): string {
  const jornada = CIERRE - APERTURA;
  const ocupacion = Math.round((resultado.minutosOcupados / jornada) * 100);

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">
        Resultado con "${escapar(estrategia.nombre)}"
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${tarjeta("Atendidos", `${resultado.seleccionados.length}`, `de ${total} solicitudes`)}
        ${tarjeta("Facturacion", aPesos(resultado.ingresoTotal), "de la agenda armada")}
        ${tarjeta("Ocupacion", `${ocupacion}%`, "de la jornada 07:00 a 19:00")}
        ${tarjeta("Comparaciones", `${resultado.comparaciones}`, "que hizo el merge sort")}
      </div>
    </section>
  `;
}

export function renderTraza(resultado: Resultado): string {
  const filas = resultado.pasos
    .map((paso: Resultado["pasos"][number]) => {
      const fondo = paso.aceptado ? "bg-emerald-50" : "bg-white";
      const icono = paso.aceptado
        ? `<span class="text-emerald-600 font-semibold">SI</span>`
        : `<span class="text-slate-400 font-semibold">NO</span>`;
      const s: Servicio = paso.servicio;

      return `
        <tr class="border-b border-slate-100 last:border-0 ${fondo}">
          <td class="py-2 pr-3 text-xs text-slate-500">${paso.numero}</td>
          <td class="py-2 pr-3 font-mono text-xs">${s.id}</td>
          <td class="py-2 pr-3 text-sm whitespace-nowrap">${aHora(s.inicio)} - ${aHora(s.fin)}</td>
          <td class="py-2 pr-3 text-center">${icono}</td>
          <td class="py-2 pr-3 text-sm text-slate-600">${escapar(paso.motivo)}</td>
          <td class="py-2 text-sm text-slate-600 whitespace-nowrap">${aHora(paso.finBahia)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Traza del algoritmo</h2>
      <p class="text-sm text-slate-600 mb-4">
        Las filas van en el orden que dejo el merge sort. El algoritmo las recorre
        una sola vez y nunca se devuelve a cambiar una decision.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-3 font-medium">#</th>
              <th class="py-2 pr-3 font-medium">Id</th>
              <th class="py-2 pr-3 font-medium">Horario</th>
              <th class="py-2 pr-3 font-medium text-center">Entra</th>
              <th class="py-2 pr-3 font-medium">Motivo</th>
              <th class="py-2 font-medium">Bahia libre</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
    </section>
  `;
}
