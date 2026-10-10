/**
 * Punto de entrada: estado, render y eventos. Cada cambio vuelve a llenar la
 * tabla, asi que todo lo que se ve sale de una ejecucion real.
 */

import "./style.css";

import { contarLlamadas } from "./algoritmos/recursionIngenua";
import { fuerzaBruta } from "./algoritmos/fuerzaBruta";
import { greedyPorFin, greedyPorIngreso } from "./algoritmos/greedy";
import { llenarTabla } from "./algoritmos/programacionDinamica";
import { reconstruir } from "./algoritmos/reconstruccion";
import { SERVICIOS_INICIALES } from "./datos";
import type { Servicio } from "./tipos";
import { renderComparativa } from "./ui/comparativa";
import { renderLineaTiempo } from "./ui/lineaTiempo";
import { renderServicios } from "./ui/servicios";
import { renderTablaDP } from "./ui/tablaDP";
import { aMinutos, aPesos } from "./utilidades";

interface Estado {
  servicios: Servicio[];
  /** null = tabla completa; k = paso a paso con k filas llenas. */
  paso: number | null;
  error: string;
}

const estado: Estado = { servicios: [...SERVICIOS_INICIALES], paso: null, error: "" };
const app = document.querySelector<HTMLDivElement>("#app")!;

function tarjeta(titulo: string, valor: string, detalle: string, destacada = false): string {
  return `
    <div class="rounded-lg border px-4 py-3 ${destacada ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}">
      <div class="text-xs uppercase tracking-wide text-slate-500">${titulo}</div>
      <div class="text-2xl font-semibold mt-1 ${destacada ? "text-emerald-700" : ""}">${valor}</div>
      <div class="text-xs text-slate-500 mt-0.5">${detalle}</div>
    </div>`;
}

function pintar(): void {
  const resultado = llenarTabla(estado.servicios);
  const rec = reconstruir(resultado);
  const n = resultado.ordenados.length;
  const optimo = resultado.dp[n] ?? 0;
  const examen1 = greedyPorFin(estado.servicios);

  const agendas = [
    { nombre: "Programación dinámica", seleccionados: rec.seleccionados, ingreso: optimo },
    examen1,
    greedyPorIngreso(estado.servicios),
  ];

  app.innerHTML = `
    <header class="bg-slate-900 text-white">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">Análisis de Algoritmos · Examen 3 · Programación dinámica</p>
        <h1 class="text-3xl sm:text-4xl font-semibold leading-tight">¿Qué servicios le dejan más plata al taller?</h1>
        <p class="mt-4 max-w-3xl text-slate-300 text-sm leading-relaxed">
          El taller tiene una sola bahía y le llegan más solicitudes de las que caben. Cada una tiene horario y
          un valor. En el Examen 1 maximizamos la <em>cantidad</em> de motos con un greedy; aquí el objetivo es la
          <strong>facturación</strong>, y para eso el greedy ya no sirve: lo resolvemos con
          <strong>programación dinámica</strong> (<em>weighted interval scheduling</em>).
        </p>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        ${tarjeta("Facturación óptima", aPesos(optimo), "dp[n], la última casilla", true)}
        ${tarjeta("Servicios en la agenda", `${rec.seleccionados.length}`, `de ${n} solicitudes`)}
        ${tarjeta("Greedy del Examen 1", aPesos(examen1.ingreso), `${examen1.seleccionados.length} motos, maximiza cantidad`)}
        ${tarjeta("Ganancia extra", aPesos(optimo - examen1.ingreso), "frente al greedy del Examen 1")}
      </section>
      ${renderTablaDP(resultado, rec, { paso: estado.paso })}
      ${renderLineaTiempo(estado.servicios, rec.seleccionados)}
      ${renderComparativa(agendas, optimo, fuerzaBruta(estado.servicios), contarLlamadas(resultado), n)}
      ${renderServicios(estado.servicios, rec.seleccionados, estado.error)}
    </main>

    <footer class="max-w-6xl mx-auto px-6 py-10 text-xs text-slate-500">
      Weighted interval scheduling · dp[i] = max(dp[i − 1], ingreso<sub>i</sub> + dp[p(i)]) · O(n log n) · código en
      <code class="font-mono">src/algoritmos/</code>
    </footer>`;
}

function siguienteId(): string {
  const maximo = Math.max(0, ...estado.servicios.map((s) => Number(s.id.replace(/\D/g, "")) || 0));
  return `S${String(maximo + 1).padStart(2, "0")}`;
}

function agregar(): void {
  const leer = (id: string) => document.querySelector<HTMLInputElement>(id)?.value.trim() ?? "";
  const inicio = aMinutos(leer("#in-inicio"));
  const fin = aMinutos(leer("#in-fin"));
  const ingreso = Number(leer("#in-ingreso"));

  if (inicio === null || fin === null) estado.error = "Revisa las horas.";
  else if (fin <= inicio) estado.error = "El fin debe ser después del inicio.";
  else if (!Number.isFinite(ingreso) || ingreso <= 0) estado.error = "El ingreso debe ser mayor que cero.";
  else {
    estado.servicios.push({
      id: siguienteId(),
      moto: "Moto nueva",
      descripcion: leer("#in-descripcion") || "Servicio nuevo",
      inicio,
      fin,
      ingreso,
    });
    estado.error = "";
    estado.paso = null;
  }
  pintar();
}

app.addEventListener("click", (evento) => {
  const boton = (evento.target as HTMLElement).closest<HTMLButtonElement>("button");
  if (!boton) return;
  const n = estado.servicios.length;

  switch (boton.id) {
    case "btn-inicio": estado.paso = 0; break;
    case "btn-anterior": estado.paso = estado.paso === null ? n : Math.max(0, estado.paso - 1); break;
    case "btn-siguiente": estado.paso = estado.paso !== null && estado.paso < n ? estado.paso + 1 : null; break;
    case "btn-final": estado.paso = null; break;
    case "btn-agregar": agregar(); return;
    case "btn-restaurar": estado.servicios = [...SERVICIOS_INICIALES]; estado.paso = null; estado.error = ""; break;
    default:
      if (boton.dataset.quitar) {
        estado.servicios = estado.servicios.filter((s) => s.id !== boton.dataset.quitar);
        estado.paso = null;
      } else return;
  }
  pintar();
});

pintar();
