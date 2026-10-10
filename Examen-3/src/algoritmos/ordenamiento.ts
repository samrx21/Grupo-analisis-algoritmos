/**
 * Merge sort propio por hora de fin. La DP necesita los servicios ordenados
 * por fin para que "los anteriores al servicio i" sean un prefijo de la lista.
 * O(n log n), estable.
 */

import type { Servicio } from "../tipos";

export function ordenarPorFin(lista: readonly Servicio[]): Servicio[] {
  if (lista.length <= 1) return [...lista];

  const mitad = lista.length >> 1;
  const izquierda = ordenarPorFin(lista.slice(0, mitad));
  const derecha = ordenarPorFin(lista.slice(mitad));

  const mezcla: Servicio[] = [];
  let i = 0;
  let j = 0;
  while (i < izquierda.length && j < derecha.length) {
    const a = izquierda[i]!;
    const b = derecha[j]!;
    // Desempate por inicio para que la tabla siempre salga igual.
    if (a.fin < b.fin || (a.fin === b.fin && a.inicio <= b.inicio)) {
      mezcla.push(a);
      i++;
    } else {
      mezcla.push(b);
      j++;
    }
  }
  while (i < izquierda.length) mezcla.push(izquierda[i++]!);
  while (j < derecha.length) mezcla.push(derecha[j++]!);
  return mezcla;
}
