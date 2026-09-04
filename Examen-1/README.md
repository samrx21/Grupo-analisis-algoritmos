# Examen 1 — Análisis de Algoritmos

**Agenda de un taller de motos con una sola bahía, resuelta con un algoritmo Greedy.**

Opción seleccionada: **Opción 1 – Desarrollo web**.

| | |
|---|---|
| **Integrantes** | Samuel Metaute Restrepo · Sebastian Cadavid Monsalve |
| **Algoritmo** | Greedy — Selección de actividades (*activity selection*) |
| **Ordenamiento** | Merge Sort implementado a mano |
| **Tecnologías** | TypeScript, Vite, Tailwind CSS v4 |
| **Video de sustentación** | `PEGAR_AQUÍ_EL_LINK` |

---

## 1. El problema

Un taller de motos tiene **una sola bahía de mantenimiento**. En un día normal
llegan más solicitudes de servicio de las que caben en la jornada (07:00 a 19:00),
y muchas se cruzan entre sí: la moto que hay que sincronizar de 9:30 a 11:00 y la
que hay que despachar de 10:00 a 11:00 no se pueden atender al tiempo, porque la
bahía es una sola.

Cada solicitud llega con tres datos fijos que el taller no puede negociar:

- La hora en que el cliente deja la moto.
- La hora en que la moto debe estar entregada.
- Lo que factura ese servicio.

**Pregunta a resolver:** ¿qué subconjunto de solicitudes debe aceptar el taller para
**atender la mayor cantidad de motos posible** sin que dos servicios se pisen?

Es un problema real de asignación de un recurso único, y es exactamente la forma del
problema clásico de *selección de actividades*.

### Por qué no sirve la intuición

Lo natural sería atender por orden de llegada. Con los datos de ejemplo del
proyecto, esa regla atiende **3 motos**. La regla de "primero el trabajo más rápido"
atiende **5**. La regla de "primero el que deje más plata" atiende **2**.

El algoritmo greedy correcto atiende **7**, y hay una demostración de que ese 7 es el
máximo posible.

---

## 2. El algoritmo

### Idea

Un algoritmo **greedy** (voraz) construye la solución tomando, en cada paso, la
opción que se ve mejor en ese momento según un criterio local, **sin volver atrás**
a reconsiderar una decisión ya tomada.

Para este problema el criterio ganador es:

> **Atender siempre el servicio que termine más temprano entre los que todavía caben.**

La intuición: al escoger el que se desocupa primero, uno deja la mayor cantidad de
tiempo libre posible para lo que venga después. Cada minuto que se libera temprano es
un minuto disponible para otra moto.

### Pseudocódigo

```
ENTRADA: lista S de servicios, cada uno con (inicio, fin)
SALIDA:  subconjunto A de servicios compatibles entre sí, de tamaño máximo

1. ordenar S por hora de FIN ascendente          -> merge sort, O(n log n)
2. A <- conjunto vacío
3. finBahia <- 0
4. para cada servicio s en S (en el orden del paso 1):
5.     si s.inicio >= finBahia entonces
6.         agregar s a A
7.         finBahia <- s.fin
8.     fin si
9. fin para
10. retornar A
```

### Complejidad

| Etapa | Costo |
|---|---|
| Ordenar por hora de fin (merge sort) | O(n log n) |
| Recorrer la lista una sola vez | O(n) |
| **Total** | **O(n log n)** |
| Memoria adicional | O(n) |

El costo lo domina el ordenamiento. Por eso el merge sort no es un detalle
secundario del proyecto: es la parte cara del algoritmo.

### Por qué es óptimo

La demostración estándar es por **argumento de intercambio**:

1. Sea `A = {a₁, a₂, …, aₖ}` la solución del greedy, ordenada cronológicamente, y sea
   `O = {o₁, o₂, …, oₘ}` una solución óptima cualquiera, también ordenada.
2. Por construcción, `a₁` es el servicio que termina más temprano de todos los
   posibles, así que `fin(a₁) ≤ fin(o₁)`.
3. Entonces se puede reemplazar `o₁` por `a₁` en `O` sin generar ningún cruce: si `o₂`
   no se cruzaba con `o₁`, mucho menos se cruza con algo que termina antes o al mismo
   tiempo. La solución sigue siendo válida y sigue teniendo `m` elementos.
4. Repitiendo el mismo intercambio para `a₂`, `a₃`, … se transforma `O` en `A` sin
   perder ni un solo elemento en el camino.
5. Por lo tanto `k = m`, y `A` es óptima. ∎

Este argumento es lo que hace que el greedy sea válido aquí. **No siempre lo es**: con
los otros tres criterios que trae la aplicación, el mismo esquema greedy da respuestas
peores. El esquema no es lo que garantiza el óptimo, el criterio sí.

### Verificación empírica

Además de la demostración, la aplicación incluye un módulo de **fuerza bruta**
(`src/algoritmos/fuerzaBruta.ts`) que enumera todas las combinaciones válidas y se
queda con la mejor. Es O(2ⁿ), así que solo corre hasta 20 servicios, pero permite
comprobar en vivo que el greedy llega al mismo número recorriendo la lista una
sola vez.

Con los datos de ejemplo, la fuerza bruta evalúa **306 combinaciones** para confirmar
que el máximo es 7. El greedy lo resuelve con **24 comparaciones**.

---

## 3. La solución implementada

### Qué se puede hacer en la aplicación

- **Cambiar el criterio greedy** entre cuatro opciones y ver cómo cambia el resultado
  en tiempo real.
- **Ver la traza del algoritmo**: iteración por iteración, qué servicio se estaba
  evaluando, si entró o no, y por qué.
- **Ver la línea de tiempo**: arriba todas las solicitudes repartidas en carriles
  (se cruzan), abajo la agenda final donde ninguna barra se toca con otra.
- **Comparar los cuatro criterios** contra el óptimo por fuerza bruta.
- **Agregar y quitar solicitudes** para probar el algoritmo con datos distintos a los
  del ejemplo.

### Estructura del código

```
Examen 1/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── docs/
│   ├── guion-sustentacion.md      Guion del video
│   └── plan-de-commits.md         Reparto de trabajo entre los integrantes
└── src/
    ├── main.ts                    Estado, render y eventos
    ├── tipos.ts                   Interfaces del dominio
    ├── datos.ts                   Caso de ejemplo del taller
    ├── utilidades.ts              Conversión de horas y formato de moneda
    ├── style.css
    ├── algoritmos/
    │   ├── ordenamiento.ts        Merge Sort propio, con contador de comparaciones
    │   ├── greedy.ts              Motor de selección de actividades
    │   ├── estrategias.ts         Los cuatro criterios comparados
    │   └── fuerzaBruta.ts         Verificación del óptimo, O(2ⁿ)
    └── ui/
        ├── linea-tiempo.ts
        ├── tabla-servicios.ts
        ├── panel-resultados.ts
        └── comparativa.ts
```

Todo lo que es algoritmo vive en `src/algoritmos/` y no depende del DOM. Se puede
importar y ejecutar en Node sin navegador.

### Decisiones técnicas

- **Merge sort propio en vez de `Array.prototype.sort`.** El examen pide evidenciar el
  algoritmo, y además necesitábamos contar comparaciones para mostrar el costo real
  en pantalla. La implementación es estable, lo que mantiene la traza predecible.
- **El tiempo se maneja en minutos desde medianoche** (las 08:30 son 510). Comparar
  horas queda en una resta de enteros, sin fechas ni zonas horarias.
- **El criterio se recibe por parámetro** en `planificar()`. Así los cuatro criterios
  corren sobre el mismo motor, y la comparación es honesta: lo único que cambia es el
  comparador.

---

## 4. Resultados

Ejecución sobre las 12 solicitudes del caso de ejemplo:

| Criterio | Motos atendidas | Facturación | Comparaciones | ¿Óptimo? |
|---|---|---|---|---|
| **Hora de finalización más temprana** | **7** | $785.000 | 24 | **Sí** |
| Duración más corta | 5 | $445.000 | 32 | No |
| Orden de llegada | 3 | $875.000 | 21 | No |
| Mayor ingreso | 2 | $880.000 | 33 | No |
| *Fuerza bruta (referencia)* | *7* | — | *306 combinaciones* | *Sí* |

Agenda que arma el algoritmo óptimo: `S01 → S03 → S05 → S06 → S08 → S10 → S11`.

### Un matiz importante

El criterio "mayor ingreso" factura **más plata** ($880.000) atendiendo **menos motos**
(2). Eso no contradice la demostración: el greedy por hora de finalización es óptimo
para **maximizar la cantidad de servicios atendidos**, que es el objetivo que definimos
en el problema. Si el objetivo fuera maximizar ingresos, este greedy ya no sería
óptimo y habría que irse a programación dinámica (*weighted interval scheduling*).

Cambiar el objetivo cambia el algoritmo. Esa es probablemente la lección más útil del
ejercicio.

---

## 5. Cómo ejecutarlo

Requisitos: Node.js 20 o superior.

```bash
cd "Examen 1"
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para generar la versión de producción:

```bash
npm run build      # valida tipos con tsc y compila con Vite
npm run preview
```

---

## 6. Video de sustentación

`PEGAR_AQUÍ_EL_LINK`

El guion usado está en [`docs/guion-sustentacion.md`](docs/guion-sustentacion.md).

## 7. Reparto de trabajo

El detalle de qué implementó cada integrante está en
[`docs/plan-de-commits.md`](docs/plan-de-commits.md) y se puede verificar con:

```bash
git log --pretty=format:"%h %an %s"
```
