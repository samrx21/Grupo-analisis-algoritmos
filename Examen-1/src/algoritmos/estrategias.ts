/**
 * Criterios voraces que vamos a comparar.
 *
 * Un algoritmo greedy no es "un" algoritmo: es un esquema. Lo que cambia todo
 * es la funcion de seleccion, o sea, con que criterio se ordenan los candidatos.
 * Aqui montamos cuatro criterios razonables y en pantalla se ve que solo uno
 * da siempre la mayor cantidad de servicios atendidos.
 */

import type { Servicio } from "../tipos";
import type { Comparador } from "./ordenamiento";

export interface Estrategia {
  id: string;
  nombre: string;
  /** Frase corta que explica el criterio, se muestra en la interfaz. */
  criterio: string;
  /** true solo para el criterio que esta demostrado que es optimo. */
  optima: boolean;
  comparador: Comparador<Servicio>;
}

export const ESTRATEGIAS: Estrategia[] = [
  {
    id: "fin-temprano",
    nombre: "El que termine primero",
    criterio: "Ordena por hora de finalizacion ascendente.",
    optima: true,
    // Desempate por hora de inicio: mantiene la traza estable y facil de leer.
    comparador: (a, b) => a.fin - b.fin || a.inicio - b.inicio,
  },
  {
    id: "inicio-temprano",
    nombre: "El que llegue primero",
    criterio: "Ordena por hora de inicio ascendente (atender por orden de llegada).",
    optima: false,
    comparador: (a, b) => a.inicio - b.inicio || a.fin - b.fin,
  },
  {
    id: "duracion-corta",
    nombre: "El mas rapido",
    criterio: "Ordena por duracion ascendente.",
    optima: false,
    comparador: (a, b) => a.fin - a.inicio - (b.fin - b.inicio) || a.inicio - b.inicio,
  },
  {
    id: "mayor-ingreso",
    nombre: "El que deje mas plata",
    criterio: "Ordena por ingreso descendente.",
    optima: false,
    comparador: (a, b) => b.ingreso - a.ingreso || a.fin - b.fin,
  },
];

/** Busca una estrategia por id. Si no existe cae en la optima. */
export function obtenerEstrategia(id: string): Estrategia {
  return ESTRATEGIAS.find((e) => e.id === id) ?? ESTRATEGIAS[0]!;
}
