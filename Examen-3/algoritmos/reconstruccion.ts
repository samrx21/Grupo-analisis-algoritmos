/**
 * La tabla dice CUANTO se puede facturar (dp[n]), pero no QUE servicios hacer.
 * Para saberlo se recorre la tabla de atras hacia adelante repitiendo la
 * misma decision de la recurrencia:
 *
 *   - si ingreso_i + dp[p(i)] >= dp[i - 1], el servicio i hace parte de la
 *     agenda optima y se salta a p(i);
 *   - si no, el servicio i no se hace y se baja a i - 1.
 *
 * O(n): cada paso baja al menos una posicion.
 */

import type { Reconstruccion, ResultadoDP, Servicio } from "../tipos";

export function reconstruir({ ordenados, p, dp }: ResultadoDP): Reconstruccion {
  const tomadosAlReves: Servicio[] = [];
  const camino: number[] = [];
  const tomados: number[] = [];

  let i = ordenados.length;
  while (i > 0) {
    camino.push(i);
    const servicio = ordenados[i - 1]!;
    const tomar = servicio.ingreso + dp[p[i]!]!;

    if (tomar >= dp[i - 1]!) {
      tomadosAlReves.push(servicio);
      tomados.push(i);
      i = p[i]!;
    } else {
      i--;
    }
  }
  camino.push(0);

  return { seleccionados: tomadosAlReves.reverse(), camino, tomados };
}
