/**
 * Las mismas 12 solicitudes del Examen 1. Alli el greedy maximizaba la
 * CANTIDAD de motos atendidas; aqui el objetivo es la FACTURACION.
 */

import type { Servicio } from "./tipos";

const h = (hora: number, minuto = 0): number => hora * 60 + minuto;

export const SERVICIOS_INICIALES: Servicio[] = [
  { id: "S01", moto: "Boxer CT 100 · KLM12D", descripcion: "Cambio de aceite y filtro", inicio: h(8), fin: h(9), ingreso: 85_000 },
  { id: "S02", moto: "Pulsar NS 200 · TQR45E", descripcion: "Reparación de motor", inicio: h(7, 30), fin: h(11, 30), ingreso: 480_000 },
  { id: "S03", moto: "Yamaha FZ 2.0 · WPA88F", descripcion: "Revisión de frenos", inicio: h(9), fin: h(10), ingreso: 95_000 },
  { id: "S04", moto: "Honda CB 125F · JHS30G", descripcion: "Sincronización", inicio: h(9, 30), fin: h(11), ingreso: 150_000 },
  { id: "S05", moto: "Suzuki Gixxer · MNO77H", descripcion: "Cambio de guaya de embrague", inicio: h(10), fin: h(11), ingreso: 70_000 },
  { id: "S06", moto: "AKT NKD 125 · RTY19J", descripcion: "Cambio de kit de arrastre", inicio: h(11), fin: h(12, 30), ingreso: 180_000 },
  { id: "S07", moto: "Bajaj Discover · LOP61K", descripcion: "Pintura de tanque", inicio: h(11, 30), fin: h(14), ingreso: 320_000 },
  { id: "S08", moto: "Yamaha NMAX · ZXC04L", descripcion: "Cambio de llanta trasera", inicio: h(12, 30), fin: h(13, 30), ingreso: 120_000 },
  { id: "S09", moto: "KTM Duke 200 · GBN52M", descripcion: "Overhaul de suspensión", inicio: h(13), fin: h(16), ingreso: 400_000 },
  { id: "S10", moto: "Honda XR 150 · VFD27N", descripcion: "Diagnóstico eléctrico", inicio: h(13, 30), fin: h(15), ingreso: 160_000 },
  { id: "S11", moto: "Kawasaki Z400 · QAS93P", descripcion: "Cambio de pastillas", inicio: h(15), fin: h(16), ingreso: 75_000 },
  { id: "S12", moto: "Royal Enfield 350 · HUI36R", descripcion: "Mantenimiento mayor", inicio: h(15, 30), fin: h(18), ingreso: 350_000 },
];
