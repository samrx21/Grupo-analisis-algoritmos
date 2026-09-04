/**
 * Merge Sort implementado a mano.
 *
 * No usamos Array.prototype.sort a proposito: el examen pide evidenciar el
 * algoritmo, y ademas necesitamos contar cuantas comparaciones se hacen para
 * mostrar el costo real en pantalla.
 *
 * Complejidad: O(n log n) en tiempo, O(n) en memoria adicional.
 * Es estable: dos elementos "empatados" conservan su orden original.
 */

/** Devuelve un numero negativo si a va antes que b, positivo si va despues, 0 si empatan. */
export type Comparador<T> = (a: T, b: T) => number;

export interface ResultadoOrdenamiento<T> {
  /** Lista nueva, ya ordenada. La original no se toca. */
  datos: T[];
  /** Cuantas veces se llamo al comparador. */
  comparaciones: number;
}

export function mergeSort<T>(
  lista: readonly T[],
  comparar: Comparador<T>,
): ResultadoOrdenamiento<T> {
  // El contador va en un objeto para que todas las llamadas recursivas
  // escriban sobre la misma referencia.
  const contador = { valor: 0 };
  const datos = dividir([...lista], comparar, contador);
  return { datos, comparaciones: contador.valor };
}

/** Paso "divide": parte la lista por la mitad hasta llegar a listas de 1 elemento. */
function dividir<T>(
  lista: T[],
  comparar: Comparador<T>,
  contador: { valor: number },
): T[] {
  if (lista.length <= 1) return lista;

  const mitad = Math.floor(lista.length / 2);
  const izquierda = dividir(lista.slice(0, mitad), comparar, contador);
  const derecha = dividir(lista.slice(mitad), comparar, contador);

  return mezclar(izquierda, derecha, comparar, contador);
}

/** Paso "vencer": une dos listas ya ordenadas en una sola lista ordenada. */
function mezclar<T>(
  izquierda: T[],
  derecha: T[],
  comparar: Comparador<T>,
  contador: { valor: number },
): T[] {
  const salida: T[] = [];
  let i = 0;
  let j = 0;

  while (i < izquierda.length && j < derecha.length) {
    contador.valor++;
    // "<= 0" en vez de "< 0" es lo que hace estable al merge sort.
    if (comparar(izquierda[i]!, derecha[j]!) <= 0) {
      salida.push(izquierda[i]!);
      i++;
    } else {
      salida.push(derecha[j]!);
      j++;
    }
  }

  // Lo que sobre de cualquiera de los dos lados ya viene ordenado.
  while (i < izquierda.length) {
    salida.push(izquierda[i]!);
    i++;
  }
  while (j < derecha.length) {
    salida.push(derecha[j]!);
    j++;
  }

  return salida;
}
