import { z } from "zod";

export const configuracionFacturaSchema = z.object({
  tipoDocumento: z.string().min(1, "Tipo de documento es requerido"),
  tipoTransaccion: z.string().min(1, "Tipo de transacción es requerido"),
  moneda: z.string().min(1, "Moneda es requerida"),
  condicionAnticipo: z.string().min(1, "Condición de anticipo es requerida"),
  tipoEmision: z.string().min(1, "Tipo de emisión es requerido"),
  tipoImpuesto: z.string().min(1, "Tipo de impuesto es requerido"),
  condicionTipoCambio: z
    .string()
    .min(1, "Condición de tipo de cambio es requerida"),
});

export type ConfiguracionFacturaFormData = z.infer<
  typeof configuracionFacturaSchema
>;
