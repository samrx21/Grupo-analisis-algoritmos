/**
 * Cola de prioridad implementada como MIN-HEAP binario.
 *
 * Dijkstra necesita sacar, una y otra vez, el nodo con la menor distancia
 * conocida. Con una lista normal eso costaria O(V) cada vez; con un heap
 * cuesta O(log V). Esa es la diferencia entre O(V^2) y O((V + E) log V).
 *
 * El heap se guarda en un arreglo: los hijos del indice i estan en
 * 2i + 1 y 2i + 2, y su padre en floor((i - 1) / 2).
 */

interface Entrada<T> {
  prioridad: number;
  valor: T;
}

export class ColaPrioridad<T> {
  private readonly heap: Entrada<T>[] = [];

  get tamano(): number {
    return this.heap.length;
  }

  estaVacia(): boolean {
    return this.heap.length === 0;
  }

  /** Inserta y sube el elemento hasta su lugar. O(log n). */
  insertar(valor: T, prioridad: number): void {
    this.heap.push({ prioridad, valor });
    this.subir(this.heap.length - 1);
  }

  /** Saca el de menor prioridad. O(log n). */
  extraerMinimo(): { valor: T; prioridad: number } | undefined {
    if (this.heap.length === 0) return undefined;
    const minimo = this.heap[0]!;
    const ultimo = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = ultimo;
      this.bajar(0);
    }
    return minimo;
  }

  private subir(i: number): void {
    while (i > 0) {
      const padre = Math.floor((i - 1) / 2);
      if (this.heap[padre]!.prioridad <= this.heap[i]!.prioridad) break;
      this.intercambiar(i, padre);
      i = padre;
    }
  }

  private bajar(i: number): void {
    const n = this.heap.length;
    while (true) {
      const izq = 2 * i + 1;
      const der = 2 * i + 2;
      let menor = i;
      if (izq < n && this.heap[izq]!.prioridad < this.heap[menor]!.prioridad) menor = izq;
      if (der < n && this.heap[der]!.prioridad < this.heap[menor]!.prioridad) menor = der;
      if (menor === i) break;
      this.intercambiar(i, menor);
      i = menor;
    }
  }

  private intercambiar(i: number, j: number): void {
    const temp = this.heap[i]!;
    this.heap[i] = this.heap[j]!;
    this.heap[j] = temp;
  }
}
