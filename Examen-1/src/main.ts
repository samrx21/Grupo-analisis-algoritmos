/**
 * Punto de entrada de la aplicacion.
 *
 * Maneja un estado muy simple (la lista de servicios + el criterio elegido),
 * vuelve a pintar todo cuando algo cambia y engancha los eventos por
 * delegacion sobre el contenedor principal.
 */

import "./style.css";

import { obtenerEstrategia, type Estrategia } from "./algoritmos/estrategias";
import { planificar } from "./algoritmos/greedy";
import { SERVICIOS_INICIALES } from "./datos";
import type { Servicio } from "./tipos";
import { aMinutos, escapar } from "./utilidades";

import { renderComparativa } from "./ui/comparativa";
import { renderLineaTiempo } from "./ui/linea-tiempo";
import {
  renderMetricas,
  renderSelectorEstrategia,
  renderTraza,
} from "./ui/panel-resultados";
import { renderTablaServicios } from "./ui/tabla-servicios";

interface Estado {
  servicios: Servicio[];
  estrategiaId: string;
  error: string;
}

const estado: Estado = {
  servicios: [...SERVICIOS_INICIALES],
  estrategiaId: "fin-temprano",
  error: "",
};

const contenedor = document.querySelector<HTMLDivElement>("#app")!;

function encabezado(estrategia: Estrategia): string {
  return `
    <header class="bg-slate-900 text-white">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
          Analisis de Algoritmos · Examen 1
        </p>
        <h1 class="text-3xl sm:text-4xl font-semibold leading-tight">
          Agenda de un taller de motos con una sola bahia
        </h1>
        <p class="mt-4 max-w-3xl text-slate-300 text-sm leading-relaxed">
          El taller recibe mas solicitudes de servicio de las que caben en un dia y
          tiene una sola bahia disponible. Dos servicios no se pueden hacer al mismo
          tiempo. La pregunta es cuales aceptar para atender la mayor cantidad de motos
          posible. Lo resolvemos con un algoritmo <strong>Greedy de seleccion de
          actividades</strong>, con criterio "${escapar(estrategia.nombre)}".
        </p>
      </div>
    </header>
  `;
}

function pie(): string {
  return `
    <footer class="max-w-6xl mx-auto px-6 py-10 text-xs text-slate-500">
      Greedy de seleccion de actividades · O(n log n) por el merge sort propio +
      O(n) por el recorrido. Codigo en <code class="font-mono">src/algoritmos/</code>.
    </footer>
  `;
}

function pintar(): void {
  const estrategia = obtenerEstrategia(estado.estrategiaId);
  const resultado = planificar(estado.servicios, estrategia.comparador, estrategia.id);

  contenedor.innerHTML = `
    ${encabezado(estrategia)}
    <main class="max-w-6xl mx-auto px-6 py-8 space-y-6">
      ${renderSelectorEstrategia(estrategia)}
      ${renderMetricas(resultado, estado.servicios.length, estrategia)}
      ${renderLineaTiempo(estado.servicios, resultado.seleccionados)}
      ${renderTraza(resultado)}
      ${renderComparativa(estado.servicios)}
      ${renderTablaServicios(estado.servicios, resultado.seleccionados)}
    </main>
    ${pie()}
  `;

  const mensaje = document.querySelector<HTMLSpanElement>("#mensaje-error");
  if (mensaje) mensaje.textContent = estado.error;
}

/** Genera un id nuevo que no choque con los que ya existen. */
function siguienteId(): string {
  const numeros = estado.servicios
    .map((s) => Number(s.id.replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const maximo = numeros.length > 0 ? Math.max(...numeros) : 0;
  return `S${String(maximo + 1).padStart(2, "0")}`;
}

function agregarServicio(): void {
  const valor = (selector: string): string =>
    document.querySelector<HTMLInputElement>(selector)?.value.trim() ?? "";

  const moto = valor("#in-moto") || "Moto sin identificar";
  const descripcion = valor("#in-descripcion") || "Servicio general";
  const inicio = aMinutos(valor("#in-inicio"));
  const fin = aMinutos(valor("#in-fin"));
  const ingreso = Number(valor("#in-ingreso"));

  if (inicio === null || fin === null) {
    estado.error = "Revisa las horas, deben tener formato HH:MM.";
    pintar();
    return;
  }
  if (fin <= inicio) {
    estado.error = "La hora de fin debe ser posterior a la de inicio.";
    pintar();
    return;
  }
  if (!Number.isFinite(ingreso) || ingreso < 0) {
    estado.error = "El ingreso debe ser un numero positivo.";
    pintar();
    return;
  }

  estado.servicios.push({
    id: siguienteId(),
    moto,
    descripcion,
    inicio,
    fin,
    ingreso,
  });
  estado.error = "";
  pintar();
}

// Delegacion de eventos: un solo listener para todos los botones,
// asi no hay que volver a enganchar nada despues de cada repintado.
contenedor.addEventListener("click", (evento) => {
  const objetivo = evento.target as HTMLElement;

  const botonEstrategia = objetivo.closest<HTMLElement>("[data-estrategia]");
  if (botonEstrategia) {
    estado.estrategiaId = botonEstrategia.dataset.estrategia!;
    pintar();
    return;
  }

  const botonEliminar = objetivo.closest<HTMLElement>("[data-eliminar]");
  if (botonEliminar) {
    const id = botonEliminar.dataset.eliminar;
    estado.servicios = estado.servicios.filter((s) => s.id !== id);
    estado.error = "";
    pintar();
    return;
  }

  if (objetivo.closest("#btn-agregar")) {
    agregarServicio();
    return;
  }

  if (objetivo.closest("#btn-restaurar")) {
    estado.servicios = [...SERVICIOS_INICIALES];
    estado.error = "";
    pintar();
  }
});

pintar();
