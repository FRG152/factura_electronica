export interface Factura {
  id: number;
  numeroFactura: string;
  timbrado: string;
  estado: "PENDIENTE" | "ENVIADO" | "RECHAZADO" | "APROBADO";
  cdc: string;
  lote: string;
  estadoLote: "PENDIENTE" | "ENVIADO" | "RECHAZADO" | "APROBADO";
  fechaCreacion: string;
  xmlConQR?: string;
}

export const estadoOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "APROBADO", label: "Aprobado" },
  { value: "RECHAZADO", label: "Rechazado" },
];

export const unit = [
  { value: "UNI", label: "UNI - Unidad" },
  { value: "KG", label: "KG - Kilogramo" },
  { value: "L", label: "L - Litro" },
  { value: "M", label: "M - Metro" },
  { value: "M2", label: "M2 - Metro cuadrado" },
  { value: "M3", label: "M3 - Metro cúbico" },
];

export const paymentCondition = [
  { value: "Contado", label: "Contado" },
  { value: "Credito", label: "Crédito" },
  { value: "Cheque", label: "Cheque" },
];
