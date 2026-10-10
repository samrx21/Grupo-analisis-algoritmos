/**
 * Tipos del dominio. El tiempo se maneja en minutos desde la medianoche
 * (las 08:30 son 510) para que comparar horas sea una resta de enteros.
 */

export interface Servicio {
  id: string;
  moto: string;
  descripcion: string;
  inicio: number;
  fin: number;
  /** Lo que factura el taller si hace este servicio (COP). */
  ingreso: number;
}

/** Una fila de la tabla dp: como se lleno la casilla dp[i]. */
export interface FilaDP {
  i: number;
  servicio: Servicio;
  /** p(i): ultimo servicio (en orden por fin) compatible con el i-esimo. 0 si ninguno. */
  p: number;
  /** Opcion "no hacer el servicio i": dp[i - 1]. */
  saltar: number;
  /** Opcion "hacer el servicio i": ingreso_i + dp[p(i)]. */
  tomar: number;
  /** dp[i] = max(saltar, tomar). */
  valor: number;
  /** true si dp[i] salio de la opcion tomar. */
  conviene: boolean;
}

export interface ResultadoDP {
  /** Servicios ordenados por hora de fin. ordenados[i - 1] es el servicio i. */
  ordenados: Servicio[];
  /** p[i] para i = 0..n (p[0] = 0). */
  p: number[];
  /** dp[i] para i = 0..n. dp[0] = 0 es el caso base. */
  dp: number[];
  filas: FilaDP[];
}

export interface Reconstruccion {
  /** Servicios de la agenda optima, en orden cronologico. */
  seleccionados: Servicio[];
  /** Indices i de la tabla que se visitaron al reconstruir, de n hacia 0. */
  camino: number[];
  /** Indices i que se tomaron. */
  tomados: number[];
}

/** Resumen de una agenda, para comparar estrategias. */
export interface Agenda {
  nombre: string;
  seleccionados: Servicio[];
  ingreso: number;
}
