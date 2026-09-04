/** Funciones pequenas de apoyo: convertir horas y formatear plata. */

/** Hora en que abre el taller (07:00). */
export const APERTURA = 7 * 60;

/** Hora en que cierra el taller (19:00). */
export const CIERRE = 19 * 60;

/** Convierte minutos desde medianoche a texto "HH:MM". */
export function aHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Convierte un texto "HH:MM" a minutos desde medianoche. Devuelve null si no sirve. */
export function aMinutos(texto: string): number | null {
  const partes = texto.split(":");
  if (partes.length !== 2) return null;
  const h = Number(partes[0]);
  const m = Number(partes[1]);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** Formatea un numero como pesos colombianos. */
export function aPesos(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Duracion en formato "1h 30m". */
export function aDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Escapa texto para insertarlo sin riesgo dentro del HTML que generamos. */
export function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
