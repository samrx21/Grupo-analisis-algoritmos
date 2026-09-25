/**
 * Mapa simplificado del Valle de Aburra.
 *
 * Los tiempos son aproximados e inventados para el ejercicio: representan
 * minutos de recorrido de la grua en hora normal. Dos vias estan cargadas a
 * proposito (Centro - El Poblado y Belen - Itagui) para que el camino con
 * menos tramos NO sea el mas rapido.
 */

import type { Arista, Nodo } from "./tipos";

export const ORIGEN_INICIAL = "TALLER";
export const DESTINO_INICIAL = "ENVIGADO";

export const NODOS: Nodo[] = [
  { id: "TALLER", nombre: "Taller (Laureles)", x: 300, y: 250, etiqueta: "izquierda" },
  { id: "ESTADIO", nombre: "Estadio", x: 350, y: 175 },
  { id: "CENTRO", nombre: "Centro", x: 460, y: 205 },
  { id: "ROBLEDO", nombre: "Robledo", x: 190, y: 140 },
  { id: "CASTILLA", nombre: "Castilla", x: 330, y: 85 },
  { id: "BELLO", nombre: "Bello", x: 440, y: 35 },
  { id: "ARANJUEZ", nombre: "Aranjuez", x: 560, y: 105 },
  { id: "BUENOSAIRES", nombre: "Buenos Aires", x: 610, y: 245 },
  { id: "POBLADO", nombre: "El Poblado", x: 540, y: 345 },
  { id: "BELEN", nombre: "Belén", x: 200, y: 330 },
  { id: "GUAYABAL", nombre: "Guayabal", x: 380, y: 360 },
  { id: "ITAGUI", nombre: "Itagüí", x: 270, y: 460 },
  { id: "SABANETA", nombre: "Sabaneta", x: 440, y: 500, etiqueta: "abajo" },
  { id: "ENVIGADO", nombre: "Envigado", x: 600, y: 455, etiqueta: "abajo" },
];

export const ARISTAS: Arista[] = [
  { a: "TALLER", b: "ESTADIO", minutos: 5 },
  { a: "TALLER", b: "BELEN", minutos: 9 },
  { a: "TALLER", b: "CENTRO", minutos: 12 },
  { a: "ESTADIO", b: "ROBLEDO", minutos: 8 },
  { a: "ESTADIO", b: "CENTRO", minutos: 6 },
  { a: "ROBLEDO", b: "CASTILLA", minutos: 10 },
  { a: "CASTILLA", b: "BELLO", minutos: 14 },
  { a: "CASTILLA", b: "ARANJUEZ", minutos: 9 },
  { a: "CASTILLA", b: "CENTRO", minutos: 11 },
  { a: "BELLO", b: "ARANJUEZ", minutos: 12 },
  { a: "ARANJUEZ", b: "CENTRO", minutos: 8 },
  { a: "CENTRO", b: "BUENOSAIRES", minutos: 7 },
  { a: "CENTRO", b: "POBLADO", minutos: 18 },
  { a: "BUENOSAIRES", b: "POBLADO", minutos: 10 },
  { a: "BELEN", b: "GUAYABAL", minutos: 8 },
  { a: "BELEN", b: "ITAGUI", minutos: 18 },
  { a: "GUAYABAL", b: "POBLADO", minutos: 9 },
  { a: "GUAYABAL", b: "ITAGUI", minutos: 7 },
  { a: "POBLADO", b: "ENVIGADO", minutos: 8 },
  { a: "ITAGUI", b: "SABANETA", minutos: 11 },
  { a: "ITAGUI", b: "ENVIGADO", minutos: 12 },
  { a: "SABANETA", b: "ENVIGADO", minutos: 6 },
];

export function nombreDe(id: string): string {
  return NODOS.find((n) => n.id === id)?.nombre ?? id;
}
