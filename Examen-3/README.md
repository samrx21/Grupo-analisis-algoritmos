# Examen 3 — Análisis de Algoritmos

**¿Qué servicios le dejan más plata al taller? Agenda de mayor facturación con Programación Dinámica.**

Opción seleccionada: **Opción 1 – Desarrollo web**.

| | |
|---|---|
| **Integrantes** | Samuel Metaute Restrepo · Cadavid |
| **Algoritmo** | Programación Dinámica — *Weighted Interval Scheduling* |
| **Tecnologías** | TypeScript, Vite, Tailwind CSS v4 |
| **Video de sustentación** | `PEGAR_AQUÍ_EL_LINK` |

---

## 1. El problema

Un taller de motos tiene **una sola bahía**: solo puede atender una moto a la vez. En un
día le llegan más solicitudes de las que caben y muchas se cruzan entre sí. Cada
solicitud tiene una hora de inicio, una hora de fin y lo que factura el taller si la
hace.

**Pregunta:** ¿qué solicitudes debe aceptar el taller para **facturar lo máximo
posible** sin que dos servicios se crucen?

### Relación con el Examen 1

En el Examen 1 usamos las mismas 12 solicitudes, pero el objetivo era atender la
**mayor cantidad** de motos. Para eso un greedy ("el que termine primero") es óptimo.
Allí mismo concluimos que, si el objetivo cambiaba a la **plata**, el greedy dejaba de
servir. Este examen resuelve esa versión del problema.

Por qué el greedy no sirve aquí: si hay un servicio de $480.000 que choca con tres de
$85.000, $95.000 y $70.000, ningún criterio local sabe cuál conviene sin comparar las
combinaciones. Hay que probar las dos opciones de cada servicio, y eso es justo lo que
hace la programación dinámica sin volverse exponencial.

---

## 2. El algoritmo: Weighted Interval Scheduling

### Preparación

1. Ordenar los servicios por **hora de fin** (merge sort propio). Así, "los servicios
   anteriores al servicio *i*" son siempre un prefijo de la lista.
2. Calcular **p(i)** para cada servicio: el último servicio de la lista que termina
   antes o justo cuando empieza el servicio *i*. Si ninguno es compatible, `p(i) = 0`.
   Como los fines están ordenados, se encuentra con **búsqueda binaria**.

### Estado (subproblema)

```
dp[i] = la máxima facturación posible usando solo los primeros i servicios
        (en el orden por hora de fin)
```

### Caso base

```
dp[0] = 0      sin servicios no se factura nada
```

### Relación de recurrencia

Para cada servicio *i* hay dos opciones:

- **Saltarlo:** la mejor facturación es la que ya había con los *i − 1* anteriores,
  `dp[i − 1]`.
- **Tomarlo:** se cobra su ingreso y se suma lo mejor que se podía hacer con los
  servicios compatibles con él, `ingreso_i + dp[p(i)]`.

```
dp[i] = max( dp[i − 1] ,  ingreso_i + dp[p(i)] )      para i = 1..n
```

La respuesta es **`dp[n]`**.

La tabla se llena de izquierda a derecha (*bottom-up*). Cuando se calcula `dp[i]`,
los valores `dp[i − 1]` y `dp[p(i)]` ya están listos, porque `p(i) < i`.

### Reconstrucción de la agenda

`dp[n]` dice **cuánto** se puede facturar, no **qué** servicios hacer. Para saberlo se
recorre la tabla desde `i = n` hacia atrás, repitiendo la decisión de la recurrencia:

- si `ingreso_i + dp[p(i)] ≥ dp[i − 1]`, el servicio *i* entra en la agenda y se salta
  a `p(i)`;
- si no, se baja a `i − 1`.

### Por qué es programación dinámica

La recurrencia tiene **subestructura óptima**: la mejor agenda con *i* servicios se
arma con la mejor agenda de un problema más pequeño (`i − 1` o `p(i)`). También tiene
**subproblemas superpuestos**: escrita como recursión directa, el mismo `dp[k]` se
calcula muchas veces. Con los datos de ejemplo, la recursión sin memoria hace **611
llamadas**; con la tabla basta con **25**. Esa diferencia crece de forma exponencial
con *n*.

### Pseudocódigo

```
ordenar servicios por fin
para i = 1..n:  p[i] <- búsqueda binaria del último j < i con fin_j <= inicio_i
dp[0] <- 0
para i = 1..n:
    dp[i] <- max(dp[i - 1], ingreso_i + dp[p[i]])
reconstruir desde i = n
retornar dp[n]
```

### Complejidad

| Etapa | Tiempo |
|---|---|
| Ordenar por fin (merge sort) | O(n log n) |
| Calcular todos los p(i) (búsqueda binaria) | O(n log n) |
| Llenar la tabla | O(n) |
| Reconstruir | O(n) |
| **Total** | **O(n log n)** |

Espacio: **O(n)** para la tabla, p(i) y la lista ordenada.

---

## 3. La implementación

### Qué se puede hacer en la aplicación

- **Ver la tabla dp completa**, con las dos opciones de cada fila (*saltar* y *tomar*)
  y cuál ganó.
- **Llenarla paso a paso**: en cada fila se ve el cálculo, por ejemplo
  `dp[5] = max(250.000, 480.000 + dp[0]) = 480.000`.
- **Ver la reconstrucción**: el camino `12 → 9 → 8 → 5 → 0` resaltado en la tabla.
- **Línea de tiempo** con todas las solicitudes y la agenda óptima.
- **Comparar** la DP contra dos greedy y contra fuerza bruta.
- **Agregar y quitar solicitudes** para recalcular todo con otros datos.

### Estructura

```
Examen 3/
├── docs/
│   ├── guion-sustentacion.md
│   └── plan-de-commits.md
└── src/
    ├── tipos.ts                       Servicio, FilaDP, ResultadoDP
    ├── datos.ts                       Las 12 solicitudes del Examen 1
    ├── utilidades.ts                  Horas y formato de moneda
    ├── algoritmos/
    │   ├── ordenamiento.ts            Merge sort por hora de fin
    │   ├── busquedaBinaria.ts         p(i)
    │   ├── programacionDinamica.ts    Estado, caso base y recurrencia (la tabla)
    │   ├── reconstruccion.ts          Qué servicios forman la agenda
    │   ├── recursionIngenua.ts        Llamadas con y sin memoria
    │   ├── fuerzaBruta.ts             Juez: los 2^n subconjuntos
    │   └── greedy.ts                  Los dos greedy de comparación
    ├── ui/                            Tabla dp, línea de tiempo, comparativa, solicitudes
    └── main.ts
```

El núcleo está en [`src/algoritmos/programacionDinamica.ts`](src/algoritmos/programacionDinamica.ts):

```ts
dp[0] = 0; // caso base

for (let i = 1; i <= n; i++) {
  const servicio = ordenados[i - 1]!;
  const saltar = dp[i - 1]!;
  const tomar = servicio.ingreso + dp[p[i]!]!;
  dp[i] = Math.max(saltar, tomar);
}
```