/**
 * Linea de tiempo de la jornada.
 *
 * Arriba se ven todas las solicitudes que llegaron (repartidas en carriles
 * porque se cruzan entre si) y abajo la agenda que armo el algoritmo, donde
 * por construccion ninguna barra se toca con otra.
 */

import type { Servicio } from "../tipos";
import { APERTURA, CIERRE, aHora, escapar } from "../utilidades";

const VENTANA = CIERRE - APERTURA;

/** Posicion horizontal de una barra, en porcentaje del ancho total. */
function posicion(servicio: Servicio): { izquierda: number; ancho: number } {
  const izquierda = ((servicio.inicio - APERTURA) / VENTANA) * 100;
  const ancho = ((servicio.fin - servicio.inicio) / VENTANA) * 100;
  return { izquierda, ancho };
}

/**
 * Reparte los servicios en carriles para que dos barras que se cruzan
 * no queden una encima de la otra.
 */
function repartirEnCarriles(servicios: readonly Servicio[]): Servicio[][] {
  const carriles: Servicio[][] = [];
  const ordenados = [...servicios].sort((a, b) => a.inicio - b.inicio);

  for (const servicio of ordenados) {
    let ubicado = false;
    for (const carril of carriles) {
      const ultimo = carril[carril.length - 1]!;
      if (servicio.inicio >= ultimo.fin) {
        carril.push(servicio);
        ubicado = true;
        break;
      }
    }
    if (!ubicado) carriles.push([servicio]);
  }

  return carriles;
}

function barra(servicio: Servicio, seleccionado: boolean): string {
  const { izquierda, ancho } = posicion(servicio);
  const colores = seleccionado
    ? "bg-emerald-500 border-emerald-600 text-white"
    : "bg-slate-300 border-slate-400 text-slate-700";

  return `
    <div
      class="barra-servicio absolute top-1 bottom-1 rounded-md border px-2 py-1 overflow-hidden ${colores}"
      style="left:${izquierda.toFixed(3)}%;width:${ancho.toFixed(3)}%"
      title="${escapar(servicio.moto)} — ${escapar(servicio.descripcion)} (${aHora(servicio.inicio)} a ${aHora(servicio.fin)})"
    >
      <span class="block text-[11px] font-semibold leading-tight truncate">${servicio.id}</span>
      <span class="block text-[10px] leading-tight truncate">${escapar(servicio.descripcion)}</span>
    </div>
  `;
}

function reglaHoras(): string {
  const marcas: string[] = [];
  for (let minuto = APERTURA; minuto <= CIERRE; minuto += 60) {
    const izquierda = ((minuto - APERTURA) / VENTANA) * 100;
    marcas.push(`
      <div class="absolute top-0 bottom-0 border-l border-slate-200" style="left:${izquierda.toFixed(3)}%">
        <span class="absolute -top-5 -translate-x-1/2 text-[10px] text-slate-500">${aHora(minuto)}</span>
      </div>
    `);
  }
  return marcas.join("");
}

function pista(servicios: readonly Servicio[], seleccionados: ReadonlySet<string>): string {
  const carriles = repartirEnCarriles(servicios);
  if (carriles.length === 0) {
    return `<p class="text-sm text-slate-500 py-4">No hay solicitudes cargadas.</p>`;
  }

  return carriles
    .map(
      (carril) => `
        <div class="relative h-11 rounded-lg bg-slate-50 border border-slate-200">
          ${reglaHoras()}
          ${carril.map((s) => barra(s, seleccionados.has(s.id))).join("")}
        </div>
      `,
    )
    .join("");
}

export function renderLineaTiempo(
  todos: readonly Servicio[],
  seleccionados: readonly Servicio[],
): string {
  const ids = new Set(seleccionados.map((s) => s.id));

  return `
    <section class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 class="text-lg font-semibold mb-1">Linea de tiempo de la jornada</h2>
      <p class="text-sm text-slate-600 mb-6">
        Verde = servicio que entra a la agenda. Gris = servicio que toca rechazar porque se cruza.
      </p>

      <h3 class="text-sm font-semibold text-slate-700 mb-6">Todas las solicitudes que llegaron</h3>
      <div class="space-y-2 mb-8">
        ${pista(todos, ids)}
      </div>

      <h3 class="text-sm font-semibold text-slate-700 mb-6">Agenda final de la bahia</h3>
      <div class="space-y-2">
        ${pista(seleccionados, ids)}
      </div>
    </section>
  `;
}
