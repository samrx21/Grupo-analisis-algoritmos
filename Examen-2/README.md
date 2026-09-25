# Examen 2 — Análisis de Algoritmos

**¿Por dónde mando la grúa? Ruta más rápida con el algoritmo de Dijkstra.**

Opción seleccionada: **Opción 1 – Desarrollo web**.

| | |
|---|---|
| **Integrantes** | Samuel Restrepo · Cadavid |
| **Algoritmo** | Dijkstra (camino más corto en grafo ponderado) |
| **Estructuras** | Lista de adyacencia · Cola de prioridad (min-heap propio) |
| **Comparación** | BFS (búsqueda en anchura) |
| **Tecnologías** | TypeScript, Vite, Tailwind CSS v4 |
| **Video de sustentación** | https://youtu.be/NZ6NeUQbbTs |

---

## 1. El problema

Un taller de motos tiene una grúa para recoger motos varadas. Cuando un cliente llama,
el taller tiene que decidir **por qué vías mandar la grúa para llegar en el menor
tiempo posible**.

No sirve escoger "el camino con menos calles": algunas vías son cortas en cantidad de
tramos pero lentas (una loma, un trancón, una vía cargada). Lo que importa es la
**suma de minutos**.

### Modelado como grafo

| Elemento del problema | Elemento del grafo |
|---|---|
| Barrio o punto de la ciudad | Nodo (14 en total) |
| Vía entre dos puntos | Arista (22 en total) |
| Minutos que tarda la grúa en la vía | Peso de la arista |
| Las vías son de doble sentido | Grafo **no dirigido** |
| No existe una vía que "devuelva" tiempo | Pesos **no negativos** |

El mapa es una versión simplificada del Valle de Aburrá. Los tiempos son aproximados
e inventados para el ejercicio.

---

## 2. El algoritmo: Dijkstra

Dijkstra encuentra el camino de costo mínimo desde un nodo origen hacia los demás en
un grafo con pesos no negativos.

### Idea

1. Todas las distancias arrancan en **infinito**, excepto el origen, que vale **0**.
2. Se saca de una **cola de prioridad** el nodo con la menor distancia conocida.
   Como no hay pesos negativos, ningún otro camino puede mejorarla: su distancia
   queda **definitiva**.
3. Se **relajan** sus vecinos: si llegar a un vecino pasando por este nodo es más
   rápido que lo que se conocía, se actualiza su distancia y se anota de dónde vino
   (`previo`).
4. Se repite hasta sacar el destino de la cola.
5. La ruta se reconstruye siguiendo `previo` desde el destino hacia atrás.

### Pseudocódigo

```
DIJKSTRA(G, origen, destino)
  para cada nodo v: dist[v] <- ∞, previo[v] <- nulo
  dist[origen] <- 0
  cola.insertar(origen, 0)

  mientras la cola no esté vacía:
      (u, d) <- cola.extraerMinimo()
      si u ya fue visitado: continuar
      marcar u como visitado
      si u = destino: terminar

      para cada vecino v de u con peso w:              ← relajación
          si d + w < dist[v]:
              dist[v]   <- d + w
              previo[v] <- u
              cola.insertar(v, dist[v])

  reconstruir la ruta siguiendo previo[] desde destino
```

### Complejidad

Con cola de prioridad implementada como min-heap: **O((V + E) log V)**, donde V son
los nodos y E las aristas. Cada nodo se extrae una vez y cada arista provoca como
máximo una inserción en el heap, y ambas operaciones cuestan O(log V).

Con una lista simple en vez de heap, buscar el mínimo costaría O(V) cada vez y el
total subiría a O(V²).

### Por qué la distancia que sale de la cola es definitiva

Supongamos que el nodo `u` sale de la cola con distancia `d`. Cualquier otro camino
hacia `u` tiene que pasar por algún nodo que todavía está en la cola, y ese nodo ya
tiene distancia ≥ `d` (por eso no salió primero). Como los pesos no son negativos,
seguir caminando desde ahí solo puede sumar. Entonces ningún camino alternativo baja
de `d`. Por eso Dijkstra **no funciona con pesos negativos**: ahí sí se podría
"descontar" tiempo después, y habría que usar Bellman-Ford.

---

## 3. La solución implementada

### Qué se puede hacer en la aplicación

- **Ver el grafo** con los pesos de cada vía y la distancia que conoce el algoritmo
  dentro de cada nodo.
- **Avanzar el algoritmo paso a paso**: qué nodo sale de la cola en cada iteración y
  qué pasa con cada vecino (si mejora o no). El mapa se colorea según el estado:
  sin descubrir, en la cola, procesándose, definitivo.
- **Cambiar origen y destino.**
- **Cerrar vías** (trancón, obra, accidente) y ver cómo el algoritmo recalcula.
- **Comparar contra BFS**, que busca el camino con menos tramos sin mirar los pesos.
- **Ver la traza completa** de todas las iteraciones.

### Estructura

```
Examen 2/
├── docs/
│   ├── guion-sustentacion.md
│   └── plan-de-commits.md
└── src/
    ├── tipos.ts                 Nodo, Arista, Paso, Resultado
    ├── datos.ts                 El mapa: 14 nodos y 22 vías
    ├── grafo.ts                 Lista de adyacencia
    ├── algoritmos/
    │   ├── colaPrioridad.ts     Min-heap propio
    │   ├── dijkstra.ts          Algoritmo principal, con traza
    │   └── bfs.ts               Comparación
    ├── ui/                      Mapa SVG, paso a paso, controles, resultados, traza
    └── main.ts
```

### Decisiones técnicas

- **Lista de adyacencia en vez de matriz.** Cada barrio se conecta con 2 a 4 vías, no
  con los 14. La lista ocupa O(V + E); la matriz ocuparía O(V²), casi toda en ceros.
- **Min-heap propio** para la cola de prioridad. Es lo que lleva la complejidad a
  O((V + E) log V).
- **Inserción perezosa en el heap.** Cuando una distancia mejora, en vez de buscar y
  modificar la entrada vieja dentro del heap, se inserta una nueva. Si la vieja sale
  después, se ignora porque el nodo ya está visitado.
- **Parada temprana.** El algoritmo se detiene al sacar el destino: su distancia ya es
  mínima y no hace falta explorar el resto del mapa.
- **Vías cerradas.** Una vía cerrada simplemente no se agrega al grafo, así que el
  algoritmo no necesita ningún caso especial.

---

## 4. Resultados

Caso de ejemplo: **Taller (Laureles) → Envigado**.

| Algoritmo | Minimiza | Tramos | Minutos | Ruta |
|---|---|---|---|---|
| **Dijkstra** | Tiempo | 4 | **34** | Taller → Belén → Guayabal → El Poblado → Envigado |
| BFS | Tramos | 3 | 39 | Taller → Belén → Itagüí → Envigado |

- Dijkstra terminó en **13 iteraciones** de 14 nodos posibles: Sabaneta nunca llegó a
  ser definitiva porque el destino salió antes de la cola.
- BFS encuentra un camino con una vía menos, pero **5 minutos más lento**, porque pasa
  por Belén → Itagüí (18 min). Menos tramos no significa menos tiempo.

### Momentos clave de la traza

| Iteración | Sale de la cola | Qué pasa |
|---|---|---|
| 1 | Taller (0) | Descubre Estadio (5), Belén (9) y Centro (12) |
| 2 | Estadio (5) | **Centro mejora de 12 a 11** pasando por el Estadio |
| 3 | Belén (9) | Descubre Guayabal (17) e Itagüí (27) |
| 6 | Guayabal (17) | El Poblado mejora de 29 a 26; Itagüí de 27 a 24 |
| 10 | Itagüí (24) | Envigado aparece por primera vez con 36 |
| 11 | El Poblado (26) | **Envigado mejora de 36 a 34** |
| 13 | Envigado (34) | Sale el destino: el algoritmo termina |

### Escenario con vía cerrada

Cerrando **Guayabal — El Poblado**, Dijkstra recalcula y encuentra
Taller → Belén → Guayabal → Itagüí → Envigado en **36 minutos**.

---

## 5. Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd "Examen 2"
npm install        # o pnpm install
npm run dev
```

Abre `http://localhost:5173`.

```bash
npm run build      # valida tipos con tsc y compila con Vite
```

---