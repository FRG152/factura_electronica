import { z } from "zod";

export const createProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  codigo_barras: z
    .string()
    .max(255, "El código de barras no puede exceder 255 caracteres")
    .optional(),
  descripcion: z.string().optional(),
  unidad_medida: z
    .string()
    .max(50, "La unidad de medida no puede exceder 50 caracteres")
    .optional(),
  iva: z
    .number()
    .min(0, "El IVA debe ser mayor o igual a 0")
    .max(100, "El IVA no puede exceder 100"),
  precio_compra: z
    .number()
    .min(0, "El precio de compra debe ser mayor o igual a 0"),
  precio_compra_promedio: z
    .number()
    .min(0, "El precio de compra promedio debe ser mayor o igual a 0")
    .optional(),
  precio_venta1: z
    .number()
    .min(0, "El precio de venta 1 debe ser mayor o igual a 0"),
  precio_venta2: z
    .number()
    .min(0, "El precio de venta 2 debe ser mayor o igual a 0")
    .optional(),
  precio_venta3: z
    .number()
    .min(0, "El precio de venta 3 debe ser mayor o igual a 0")
    .optional(),
  precio_minimo: z
    .number()
    .min(0, "El precio mínimo debe ser mayor o igual a 0")
    .optional(),
  // venta_granel: z.number().min(0).max(1).optional(),
  precio_granel: z
    .number()
    .min(0, "El precio a granel debe ser mayor o igual a 0")
    .optional(),
  unidad_granel: z
    .string()
    .max(50, "La unidad a granel no puede exceder 50 caracteres")
    .optional(),
  equivalencia_granel: z
    .number()
    .min(0, "La equivalencia a granel debe ser mayor o igual a 0")
    .optional(),
  stock_minimo: z
    .number()
    .min(0, "El stock mínimo debe ser mayor o igual a 0")
    .optional(),
  // controla_stock: z.number().min(0).max(1).optional(),
  imagen1: z
    .string()
    .max(255, "La URL de imagen 1 no puede exceder 255 caracteres")
    .optional(),
  imagen2: z
    .string()
    .max(255, "La URL de imagen 2 no puede exceder 255 caracteres")
    .optional(),
});

export const updateProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  codigo_barras: z
    .string()
    .max(255, "El código de barras no puede exceder 255 caracteres")
    .optional(),
  descripcion: z.string().optional(),
  unidad_medida: z
    .string()
    .max(50, "La unidad de medida no puede exceder 50 caracteres")
    .optional(),
  iva: z
    .number()
    .min(0, "El IVA debe ser mayor o igual a 0")
    .max(100, "El IVA no puede exceder 100"),
  precio_compra: z
    .number()
    .min(0, "El precio de compra debe ser mayor o igual a 0"),
  // precio_compra_promedio: z
  //   .number()
  //   .min(0, "El precio de compra promedio debe ser mayor o igual a 0")
  //   .optional(),
  precio_venta1: z
    .number()
    .min(0, "El precio de venta 1 debe ser mayor o igual a 0"),
  precio_venta2: z
    .number()
    .min(0, "El precio de venta 2 debe ser mayor o igual a 0")
    .optional(),
  precio_venta3: z
    .number()
    .min(0, "El precio de venta 3 debe ser mayor o igual a 0")
    .optional(),
  precio_minimo: z
    .number()
    .min(0, "El precio mínimo debe ser mayor o igual a 0")
    .optional(),
  // venta_granel: z.number().min(0).max(1).optional(),
  // precio_granel: z
  //   .number()
  //   .min(0, "El precio a granel debe ser mayor o igual a 0")
  //   .optional(),
  // unidad_granel: z
  //   .string()
  //   .max(50, "La unidad a granel no puede exceder 50 caracteres")
  //   .optional(),
  // equivalencia_granel: z
  //   .number()
  //   .min(0, "La equivalencia a granel debe ser mayor o igual a 0")
  //   .optional(),
  // stock_minimo: z
  //   .number()
  //   .min(0, "El stock mínimo debe ser mayor o igual a 0")
  //   .optional(),
  // controla_stock: z.number().min(0).max(1).optional(),
  imagen1: z
    .string()
    .max(255, "La URL de imagen 1 no puede exceder 255 caracteres")
    .optional(),
  imagen2: z
    .string()
    .max(255, "La URL de imagen 2 no puede exceder 255 caracteres")
    .optional(),
});

export type CreateProductoFormData = z.infer<typeof createProductoSchema>;
export type UpdateProductoFormData = z.infer<typeof updateProductoSchema>;
