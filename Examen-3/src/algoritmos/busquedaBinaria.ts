/**
 * p(i): el ultimo servicio, en el orden por fin, que termina antes o justo
 * cuando empieza el servicio i. Es el "hasta donde me puedo devolver" si
 * decido hacer el servicio i. Si ninguno es compatible, p(i) = 0.
 *
 * Como los servicios estan ordenados por fin, los fines forman una lista
 * creciente y p(i) se encuentra con busqueda binaria: O(log n) por servicio,
 * O(n log n) para todos.
 */

import type { Servicio } from "../tipos";

export function calcularP(ordenados: readonly Servicio[]): number[] {
  const n = ordenados.length;
  const p = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const inicio = ordenados[i - 1]!.inicio;

    // Buscar el mayor j en [1, i - 1] con fin_j <= inicio_i.
    let bajo = 1;
    let alto = i - 1;
    let respuesta = 0;
    while (bajo <= alto) {
      const medio = (bajo + alto) >> 1;
      if (ordenados[medio - 1]!.fin <= inicio) {
        respuesta = medio;
        bajo = medio + 1;
      } else {
        alto = medio - 1;
      }
    }
    p[i] = respuesta;
  }

  return p;
}
