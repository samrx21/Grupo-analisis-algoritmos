/**
 * Tabla dp con modo paso a paso. Cada fila muestra las dos opciones de la
 * recurrencia y cual gana. En el resultado final se resalta el camino de la
 * reconstruccion.
 */

import type { FilaDP, Reconstruccion, ResultadoDP } from "../tipos";
import { aHora, aMiles, aPesos, escapar } from "../utilidades";

export interface VistaTabla {
  /** null = tabla completa con reconstruccion; k = se han llenado k filas. */
  paso: number | null;
}

function explicacion(fila: FilaDP): string {
  const gana = fila.conviene ? "tomar" : "saltar";
  return `
    <div class="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4 text-sm leading-relaxed">
      <div class="text-xs uppercase tracking-wide text-amber-700 mb-1">Calculando dp[${fila.i}] · ${fila.servicio.id}, ${aHora(fila.servicio.inicio)}–${aHora(fila.servicio.fin)}, ${aPesos(fila.servicio.ingreso)}</div>
      <div><strong>Saltar</strong> el servicio: dp[${fila.i - 1}] = <strong>${aPesos(fila.saltar)}</strong></div>
      <div><strong>Tomar</strong> el servicio: ${aPesos(fila.servicio.ingreso)} + dp[p(${fila.i})] = ${aPesos(fila.servicio.ingreso)} + dp[${fila.p}] = <strong>${aPesos(fila.tomar)}</strong></div>
      <div class="mt-1">dp[${fila.i}] = max(…) = <strong>${aPesos(fila.valor)}</strong> → gana <strong>${gana}</strong>.</div>
    </div>`;
}

export function renderTablaDP(r: ResultadoDP, rec: Reconstruccion, vista: VistaTabla): string {
  const n = r.filas.length;
  const final = vista.paso === null;
  const llenas = final ? n : vista.paso!;
  const camino = new Set(final ? rec.camino : []);
  const tomados = new Set(final ? rec.tomados : []);

  const celda = (valor: number, visible: boolean, clases = "") =>
    `<td class="py-2 px-2 text-right font-mono text-xs ${clases}">${visible ? aMiles(valor) : '<span class="text-slate-300">?</span>'}</td>`;

  const base = `
    <tr class="border-b border-slate-100 ${camino.has(0) ? "bg-emerald-50" : ""}">
      <td class="py-2 px-2 font-mono text-xs">0</td>
      <td class="py-2 px-2 text-xs text-slate-500" colspan="4">Caso base: sin servicios no se factura nada</td>
      <td class="py-2 px-2 text-right font-mono text-xs font-semibold">0</td>
      <td class="py-2 px-2"></td>
    </tr>`;

  const filas = r.filas
    .map((f) => {
      const visible = f.i <= llenas;
      const actual = !final && f.i === llenas;
      let fondo = "";
      if (actual) fondo = "bg-amber-50";
      else if (tomados.has(f.i)) fondo = "bg-emerald-100";
      else if (camino.has(f.i)) fondo = "bg-emerald-50";

      const decision = !visible
        ? ""
        : f.conviene
          ? '<span class="text-emerald-700 font-semibold">tomar</span>'
          : '<span class="text-slate-500">saltar</span>';

      return `
        <tr class="border-b border-slate-100 last:border-0 ${fondo}">
          <td class="py-2 px-2 font-mono text-xs">${f.i}</td>
          <td class="py-2 px-2">
            <div class="text-sm font-medium">${f.servicio.id} · ${escapar(f.servicio.descripcion)}</div>
            <div class="text-xs text-slate-500">${aHora(f.servicio.inicio)}–${aHora(f.servicio.fin)} · ${aPesos(f.servicio.ingreso)}</div>
          </td>
          <td class="py-2 px-2 text-center font-mono text-xs">${f.p}</td>
          ${celda(f.saltar, visible, f.conviene ? "text-slate-400" : "font-semibold")}
          ${celda(f.tomar, visible, f.conviene ? "font-semibold" : "text-slate-400")}
          ${celda(f.valor, visible, "font-semibold")}
          <td class="py-2 px-2 text-xs">${decision}${tomados.has(f.i) ? ' <span class="ml-1 rounded bg-emerald-600 text-white px-1.5 py-0.5">en la agenda</span>' : ""}</td>
        </tr>`;
    })
    .join("");

  const filaActual = !final && llenas > 0 ? r.filas[llenas - 1] : undefined;
  const boton = "rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  const pie = final
    ? `<p class="text-sm text-slate-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 mt-4">
         <strong>Reconstrucción:</strong> se recorre la tabla desde dp[${n}] hacia atrás
         (${rec.camino.join(" → ")}). Cuando ganó <em>tomar</em>, el servicio entra a la agenda y se
         salta a p(i); cuando ganó <em>saltar</em>, se baja a i − 1. Las filas en verde intenso son la agenda.
       </p>`
    : "";

  return `
    <section id="tabla-dp" class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h2 class="text-lg font-semibold">Tabla de programación dinámica</h2>
        <span class="text-sm text-slate-500">${final ? "Tabla completa" : `Fila ${llenas} de ${n}`}</span>
      </div>
      <p class="text-sm text-slate-600 mb-4">
        <code class="font-mono">dp[i] = max(dp[i − 1], ingreso<sub>i</sub> + dp[p(i)])</code>, con
        <code class="font-mono">dp[0] = 0</code>. Los servicios van ordenados por hora de fin.
      </p>
      <div class="flex flex-wrap gap-2 mb-4">
        <button type="button" id="btn-inicio" class="${boton}">⏮ Inicio</button>
        <button type="button" id="btn-anterior" class="${boton}" ${!final && llenas === 0 ? "disabled" : ""}>◀ Anterior</button>
        <button type="button" id="btn-siguiente" class="${boton}" ${final ? "disabled" : ""}>Siguiente ▶</button>
        <button type="button" id="btn-final" class="rounded-md bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-700 cursor-pointer">Tabla completa y reconstrucción</button>
      </div>
      ${filaActual ? explicacion(filaActual) : !final ? '<p class="text-sm text-slate-500 mb-4">Solo está el caso base. Denle a <strong>Siguiente</strong> para llenar dp[1].</p>' : ""}
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              <th class="py-2 px-2 font-medium">i</th>
              <th class="py-2 px-2 font-medium">Servicio</th>
              <th class="py-2 px-2 font-medium text-center">p(i)</th>
              <th class="py-2 px-2 font-medium text-right">Saltar<br><span class="normal-case">dp[i−1]</span></th>
              <th class="py-2 px-2 font-medium text-right">Tomar<br><span class="normal-case">ingreso + dp[p(i)]</span></th>
              <th class="py-2 px-2 font-medium text-right">dp[i]</th>
              <th class="py-2 px-2 font-medium">Decisión</th>
            </tr>
          </thead>
          <tbody>${base}${filas}</tbody>
        </table>
      </div>
      ${pie}
    </section>`;
}
