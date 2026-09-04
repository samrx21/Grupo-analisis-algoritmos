/**
 * Tipos de dominio del problema.
 *
 * Todo el tiempo se maneja en MINUTOS desde la medianoche.
 * Ejemplo: las 08:30 son 8 * 60 + 30 = 510.
 * Trabajar con numeros enteros hace que comparar horas sea una simple resta.
 */

/** Una solicitud de servicio que un cliente quiere que le hagan a su moto. */
export interface Servicio {
  /** Identificador corto, sirve como llave al renderizar. */
  id: string;
  /** Modelo y placa de la moto. */
  moto: string;
  /** Que le van a hacer: cambio de aceite, sincronizacion, frenos, etc. */
  descripcion: string;
  /** Minuto en que el cliente puede dejar la moto. */
  inicio: number;
  /** Minuto en que la moto debe estar entregada. */
  fin: number;
  /** Cuanto factura el taller si ese servicio se alcanza a hacer (COP). */
  ingreso: number;
}

/**
 * Registro de lo que el algoritmo decidio en cada iteracion.
 * Se usa para mostrar la traza paso a paso en pantalla, que es la evidencia
 * de que el greedy realmente se esta ejecutando y no es una animacion.
 */
export interface Paso {
  /** Numero de iteracion, empezando en 1. */
  numero: number;
  /** Servicio que se estaba evaluando en esa iteracion. */
  servicio: Servicio;
  /** true si entro a la agenda, false si se descarto por cruce. */
  aceptado: boolean;
  /** Explicacion en lenguaje natural de por que se acepto o se descarto. */
  motivo: string;
  /** Hora hasta la que quedo ocupada la bahia despues de decidir. */
  finBahia: number;
}

/** Resultado completo de correr una estrategia sobre una lista de servicios. */
export interface Resultado {
  /** Id de la estrategia que produjo este resultado. */
  estrategiaId: string;
  /** Servicios que si se alcanzan a atender, en orden cronologico. */
  seleccionados: Servicio[];
  /** Traza de decisiones, util para explicar y para depurar. */
  pasos: Paso[];
  /** Comparaciones que hizo el merge sort al ordenar. */
  comparaciones: number;
  /** Plata que factura el taller con esa agenda. */
  ingresoTotal: number;
  /** Minutos de la jornada en los que la bahia esta trabajando. */
  minutosOcupados: number;
}
