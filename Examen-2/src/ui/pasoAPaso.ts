/**
 * Panel de paso a paso: deja avanzar el algoritmo iteracion por iteracion
 * y explica en lenguaje natural que hizo en cada una.
 */

import { nombreDe } from "../datos";
import type { PasoDijkstra } from "../tipos";
import { aMinutos, escapar } from "../utilidades";

export function renderPasoAPaso(
  pasos: readonly PasoDijkstra[],
  indice: number,
  modoFinal: boolean,
): string {
  const paso = pasos[indice];
  const total = pasos.length;

  const relajaciones = paso
    ? paso.relajaciones
        .map((r) => {
          const icono = r.mejora
            ? '<span class="text-emerald-600 font-bold">✔ mejora</span>'
            : '<span class="text-slate-400 font-bold">✘ no mejora</span>';
          return `
            <li class="flex justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
              <span>${escapar(nombreDe(r.hacia))}</span>
              <span class="font-mono text-xs">${aMinutos(r.antes)} → ${r.candidata} min</span>
              ${icono}
            </li>`;
        })
        .join("")
    : "";

  const cuerpo = paso
    ? `
      <div class="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
        <div class="text-xs uppercase tracking-wide text-amber-700">Se saca de la cola</div>
        <div class="text-xl font-semibold">${escapar(nombreDe(paso.actual))}</div>
        <div class="text-sm text-slate-600">
          Distancia <strong>${paso.distanciaActual} min</strong>. Es la menor de la cola, así que ya es definitiva.
        </div>
      </div>
      <h3 class="text-sm font-semibold mb-1">Revisa sus vecinos (relajación)</h3>
      ${
        relajaciones
          ? `<ul class="text-sm">${relajaciones}</ul>`
          : '<p class="text-sm text-slate-500">No le quedan vecinos sin visitar.</p>'
      }`
    : "";

  const clasesBoton = "rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Paso a paso</h2>
        <span class="text-sm text-slate-500">
          ${modoFinal ? "Resultado final" : `Iteración ${indice + 1} de ${total}`}
        </span>
      </div>
      <div class="flex flex-wrap gap-2 mb-4">
        <button type="button" id="btn-inicio" class="${clasesBoton}">⏮ Inicio</button>
        <button type="button" id="btn-anterior" class="${clasesBoton}" ${!modoFinal && indice === 0 ? "disabled" : ""}>◀ Anterior</button>
        <button type="button" id="btn-siguiente" class="${clasesBoton}" ${modoFinal ? "disabled" : ""}>Siguiente ▶</button>
        <button type="button" id="btn-final"
          class="rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-700 cursor-pointer">
          Ver ruta final
        </button>
      </div>
      ${
        modoFinal
          ? `<p class="text-sm text-slate-600">
               El algoritmo terminó en <strong>${total} iteraciones</strong>: se detiene apenas saca el
               destino de la cola, porque en ese momento su distancia ya es la mínima.
               Denle a <strong>Inicio</strong> para verlo avanzar desde el principio.
             </p>`
          : cuerpo
      }
    </section>
  `;
}
