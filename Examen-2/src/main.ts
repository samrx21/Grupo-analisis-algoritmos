/**
 * Punto de entrada: estado de la aplicacion, render y eventos.
 * Cada vez que algo cambia se reconstruye el grafo y se vuelve a correr
 * Dijkstra, asi que todo lo que se ve en pantalla sale de una ejecucion real.
 */

import "./style.css";

import { bfs } from "./algoritmos/bfs";
import { dijkstra } from "./algoritmos/dijkstra";
import { ARISTAS, DESTINO_INICIAL, NODOS, ORIGEN_INICIAL, nombreDe } from "./datos";
import { Grafo } from "./grafo";
import { renderControles } from "./ui/controles";
import { renderMapa } from "./ui/mapa";
import { renderPasoAPaso } from "./ui/pasoAPaso";
import { renderResultados } from "./ui/resultados";
import { renderTraza } from "./ui/traza";
import { escapar } from "./utilidades";

interface Estado {
  origen: string;
  destino: string;
  cerradas: Set<string>;
  mostrarBfs: boolean;
  /** true = se ve el resultado final; false = modo paso a paso. */
  modoFinal: boolean;
  indicePaso: number;
}

const estado: Estado = {
  origen: ORIGEN_INICIAL,
  destino: DESTINO_INICIAL,
  cerradas: new Set(),
  mostrarBfs: false,
  modoFinal: true,
  indicePaso: 0,
};

const contenedor = document.querySelector<HTMLDivElement>("#app")!;

function pintar(): void {
  const grafo = new Grafo(NODOS, ARISTAS, estado.cerradas);
  const resultado = dijkstra(grafo, estado.origen, estado.destino);
  const resultadoBfs = bfs(grafo, estado.origen, estado.destino);

  const pasos = resultado.pasos;
  estado.indicePaso = Math.min(estado.indicePaso, pasos.length - 1);
  const pasoVisible = estado.modoFinal ? pasos[pasos.length - 1] : pasos[estado.indicePaso];

  contenedor.innerHTML = `
    <header class="bg-slate-900 text-white">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
          Análisis de Algoritmos · Examen 2 · Grafos
        </p>
        <h1 class="text-3xl sm:text-4xl font-semibold leading-tight">
          ¿Por dónde mando la grúa?
        </h1>
        <p class="mt-4 max-w-3xl text-slate-300 text-sm leading-relaxed">
          El taller tiene una grúa para recoger motos varadas. Cuando un cliente llama, hay que
          decidir por qué vías ir para llegar en el menor tiempo posible. El mapa es un grafo
          ponderado y la ruta se calcula con el <strong>algoritmo de Dijkstra</strong>.
          Ahora mismo: de <strong>${escapar(nombreDe(estado.origen))}</strong> a
          <strong>${escapar(nombreDe(estado.destino))}</strong>.
        </p>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          ${renderMapa({
            nodos: NODOS,
            aristas: ARISTAS,
            cerradas: estado.cerradas,
            origen: estado.origen,
            destino: estado.destino,
            paso: pasoVisible,
            resaltarActual: !estado.modoFinal,
            rutaDijkstra: estado.modoFinal ? resultado.ruta : [],
            rutaBfs: estado.mostrarBfs ? resultadoBfs.ruta : [],
          })}
        </div>
        <div class="space-y-6">
          ${renderPasoAPaso(pasos, estado.indicePaso, estado.modoFinal)}
          ${renderControles(NODOS, ARISTAS, estado.origen, estado.destino, estado.cerradas, estado.mostrarBfs)}
        </div>
      </div>
      ${renderResultados(resultado, resultadoBfs, NODOS.length)}
      ${renderTraza(pasos, estado.modoFinal ? null : estado.indicePaso)}
    </main>

    <footer class="max-w-6xl mx-auto px-6 py-10 text-xs text-slate-500">
      Dijkstra con cola de prioridad (min-heap propio) · O((V + E) log V) ·
      código en <code class="font-mono">src/algoritmos/</code>.
    </footer>
  `;
}

/** Cualquier cambio en los datos reinicia el paso a paso al resultado final. */
function recalcular(): void {
  estado.modoFinal = true;
  estado.indicePaso = 0;
  pintar();
}

contenedor.addEventListener("click", (evento) => {
  const objetivo = evento.target as HTMLElement;
  const boton = objetivo.closest<HTMLElement>("button");
  if (!boton) return;

  const totalPasos = dijkstra(new Grafo(NODOS, ARISTAS, estado.cerradas), estado.origen, estado.destino).pasos.length;

  switch (boton.id) {
    case "btn-inicio":
      estado.modoFinal = false;
      estado.indicePaso = 0;
      break;
    case "btn-anterior":
      if (estado.modoFinal) {
        estado.modoFinal = false;
        estado.indicePaso = totalPasos - 1;
      } else {
        estado.indicePaso = Math.max(0, estado.indicePaso - 1);
      }
      break;
    case "btn-siguiente":
      if (estado.indicePaso >= totalPasos - 1) estado.modoFinal = true;
      else estado.indicePaso++;
      break;
    case "btn-final":
      estado.modoFinal = true;
      break;
    case "btn-cerrar": {
      const via = document.querySelector<HTMLSelectElement>("#sel-via")?.value;
      if (via) estado.cerradas.add(via);
      recalcular();
      return;
    }
    case "btn-restaurar":
      estado.origen = ORIGEN_INICIAL;
      estado.destino = DESTINO_INICIAL;
      estado.cerradas.clear();
      estado.mostrarBfs = false;
      recalcular();
      return;
    default:
      if (boton.dataset.reabrir) {
        estado.cerradas.delete(boton.dataset.reabrir);
        recalcular();
      }
      return;
  }
  pintar();
});

contenedor.addEventListener("change", (evento) => {
  const objetivo = evento.target as HTMLInputElement | HTMLSelectElement;
  if (objetivo.id === "sel-origen") estado.origen = objetivo.value;
  else if (objetivo.id === "sel-destino") estado.destino = objetivo.value;
  else if (objetivo.id === "chk-bfs") {
    estado.mostrarBfs = (objetivo as HTMLInputElement).checked;
    pintar();
    return;
  } else return;
  recalcular();
});

pintar();
