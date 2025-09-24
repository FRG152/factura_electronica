export interface SelectOption {
  value: string;
  label: string;
}

export const tipoDocumentoOptions: SelectOption[] = [
  { value: "1", label: "1 - Factura electrónica" },
  { value: "2", label: "2 - Nota de crédito" },
  { value: "3", label: "3 - Nota de débito" },
  { value: "4", label: "4 - Nota de remisión" },
];

export const tipoTransaccionOptions: SelectOption[] = [
  { value: "1", label: "1 - Venta de bienes" },
  { value: "2", label: "2 - Prestación de servicios" },
  { value: "3", label: "3 - Mixto" },
];

export const monedaOptions: SelectOption[] = [
  { value: "PYG", label: "PYG - Guaraní" },
  { value: "USD", label: "USD - Dólar Americano" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "BRL", label: "BRL - Real Brasileño" },
];

export const condicionAnticipoOptions: SelectOption[] = [
  { value: "0", label: "Sin anticipo" },
  { value: "1", label: "Con anticipo" },
];

export const tipoEmisionOptions: SelectOption[] = [
  { value: "1", label: "1 - Normal" },
  { value: "2", label: "2 - Contingencia" },
  { value: "3", label: "3 - Sin conexión" },
];

export const tipoImpuestoOptions: SelectOption[] = [
  { value: "1", label: "1 - IVA" },
  { value: "2", label: "2 - ISC" },
  { value: "3", label: "3 - IPU" },
  { value: "0", label: "0 - Exento" },
];

export const condicionTipoCambioOptions: SelectOption[] = [
  { value: "0", label: "(No aplica)" },
  { value: "1", label: "1 - Tipo de cambio fijo" },
  { value: "2", label: "2 - Tipo de cambio variable" },
];
