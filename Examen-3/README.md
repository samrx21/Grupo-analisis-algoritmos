# Examen 3 — Análisis de Algoritmos

**¿Qué servicios le dejan más plata al taller? Agenda de mayor facturación con Programación Dinámica.**

Opción seleccionada: **Opción 1 – Desarrollo web**.

| | |
|---|---|
| **Integrantes** | Samuel Metaute Restrepo · Cadavid |
| **Algoritmo** | Programación Dinámica — *Weighted Interval Scheduling* |
| **Tecnologías** | TypeScript, Vite, Tailwind CSS v4 |
| **Video de sustentación** | `https://youtu.be/1S1Om-tkwhw` |

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

## 4. Resultados

Con las 12 solicitudes del ejemplo:

| Estrategia | Motos | Facturación | Frente al óptimo |
|---|---|---|---|
| **Programación dinámica** | **3** | **$1.150.000** | **óptimo** |
| Greedy "el que termine primero" (Examen 1) | 7 | $785.000 | − $365.000 |
| Greedy "el que deje más plata" | 2 | $880.000 | − $270.000 |

- **Agenda óptima:** S02 Reparación de motor (07:30–11:30, $480.000) → S07 Pintura de
  tanque (11:30–14:00, $320.000) → S12 Mantenimiento mayor (15:30–18:00, $350.000).
- **Verificación:** la fuerza bruta revisa los **4.096** subconjuntos (2¹²) y confirma
  que el máximo es $1.150.000, igual a `dp[12]`.
- **Costo:** la recursión sin memoria hace **611** llamadas; la tabla resuelve cada
  subproblema una sola vez.
- **Lección:** el greedy del Examen 1 atiende más motos, pero factura $365.000 menos.
  Cambiar el objetivo cambia el algoritmo.

### Tabla completa

| i | Servicio | p(i) | Saltar `dp[i−1]` | Tomar `ingreso + dp[p(i)]` | `dp[i]` |
|---|---|---|---|---|---|
| 0 | — | — | — | — | 0 |
| 1 | S01 08:00–09:00 · 85k | 0 | 0 | 85k | 85k |
| 2 | S03 09:00–10:00 · 95k | 1 | 85k | 180k | 180k |
| 3 | S04 09:30–11:00 · 150k | 1 | 180k | 235k | 235k |
| 4 | S05 10:00–11:00 · 70k | 2 | 235k | 250k | 250k |
| 5 | S02 07:30–11:30 · 480k | 0 | 250k | 480k | 480k |
| 6 | S06 11:00–12:30 · 180k | 4 | 480k | 430k | 480k |
| 7 | S08 12:30–13:30 · 120k | 6 | 480k | 600k | 600k |
| 8 | S07 11:30–14:00 · 320k | 5 | 600k | 800k | 800k |
| 9 | S10 13:30–15:00 · 160k | 7 | 800k | 760k | 800k |
| 10 | S09 13:00–16:00 · 400k | 6 | 800k | 880k | 880k |
| 11 | S11 15:00–16:00 · 75k | 9 | 880k | 875k | 880k |
| 12 | S12 15:30–18:00 · 350k | 9 | 880k | 1.150k | **1.150k** |

---

## 5. Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd "Examen 3"
npm install        # o pnpm install
npm run dev
```

Abre `http://localhost:5173`. Para validar tipos y compilar: `npm run build`.

---