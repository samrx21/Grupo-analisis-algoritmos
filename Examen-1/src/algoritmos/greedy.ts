/**
 * Motor Greedy: seleccion de actividades sobre un unico recurso (la bahia).
 *
 * La idea del algoritmo voraz es siempre la misma:
 *   1. Ordenar los candidatos segun un criterio.
 *   2. Recorrerlos de principio a fin.
 *   3. Tomar el candidato si es compatible con lo que ya se tomo,
 *      y descartarlo si no. Nunca se devuelve a reconsiderar.
 *
 * Aqui el criterio se recibe por parametro para poder comparar varias
 * estrategias con el mismo motor y demostrar que solo una es optima.
 *
 * Complejidad: O(n log n) por el ordenamiento + O(n) por el recorrido.
 * El costo lo domina el ordenamiento, asi que queda en O(n log n).
 */

import type { Paso, Resultado, Servicio } from "../tipos";
import { aHora } from "../utilidades";
import { mergeSort, type Comparador } from "./ordenamiento";

export function planificar(
  servicios: readonly Servicio[],
  comparar: Comparador<Servicio>,
  estrategiaId: string,
): Resultado {
  // Paso 1: ordenar segun el criterio de la estrategia.
  const { datos: ordenados, comparaciones } = mergeSort(servicios, comparar);

  const seleccionados: Servicio[] = [];
  const pasos: Paso[] = [];

  // Hasta que minuto quedo ocupada la bahia. Arranca en 0 = libre.
  let finBahia = 0;

  // Paso 2 y 3: recorrer una sola vez y decidir sin volver atras.
  ordenados.forEach((servicio, indice) => {
    const ocupadaHasta = finBahia;
    const compatible = servicio.inicio >= ocupadaHasta;

    if (compatible) {
      seleccionados.push(servicio);
      finBahia = servicio.fin;
      pasos.push({
        numero: indice + 1,
        servicio,
        aceptado: true,
        motivo:
          ocupadaHasta === 0
            ? "La bahia esta libre, es el primer servicio de la jornada."
            : `Arranca ${aHora(servicio.inicio)} y la bahia se desocupo ${aHora(ocupadaHasta)}. Cabe.`,
        finBahia,
      });
    } else {
      pasos.push({
        numero: indice + 1,
        servicio,
        aceptado: false,
        motivo: `Se cruza: arranca ${aHora(servicio.inicio)} pero la bahia esta ocupada hasta ${aHora(ocupadaHasta)}.`,
        finBahia,
      });
    }
  });

  // La lista seleccionada ya queda cronologica cuando el criterio es por fin,
  // pero la reordenamos para que la linea de tiempo se vea bien con cualquier criterio.
  const cronologicos = mergeSort(seleccionados, (a, b) => a.inicio - b.inicio).datos;

  const ingresoTotal = cronologicos.reduce((suma, s) => suma + s.ingreso, 0);
  const minutosOcupados = cronologicos.reduce((suma, s) => suma + (s.fin - s.inicio), 0);

  return {
    estrategiaId,
    seleccionados: cronologicos,
    pasos,
    comparaciones,
    ingresoTotal,
    minutosOcupados,
  };
}
