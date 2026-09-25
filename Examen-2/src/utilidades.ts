/** Funciones pequenas de formato. */

export function aMinutos(valor: number): string {
  return valor === Infinity ? "∞" : `${valor} min`;
}

export function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
