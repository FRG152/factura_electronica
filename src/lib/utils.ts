import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Función de utilidad para combinar clases de Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Mapea el nombre de una unidad de medida a su código estándar
 * @param unidad - Nombre de la unidad (ej: "Unidad", "Kilogramo", "KG")
 * @returns Código de unidad estándar (UNI, KG, L, M, M2, M3)
 *
 * @example
 * mapUnidadMedida("Kilogramo") // returns "KG"
 * mapUnidadMedida("KG") // returns "KG"
 * mapUnidadMedida("Unidad") // returns "UNI"
 */
export function mapUnidadMedida(unidad?: string): string {
  if (!unidad) return "UNI";

  const unidadUpper = unidad.toUpperCase();

  // Si ya es un código válido, devolverlo directamente
  if (["UNI", "KG", "L", "M", "M2", "M3"].includes(unidadUpper)) {
    return unidadUpper;
  }

  // Mapear nombres comunes a sus códigos estándar
  if (unidad.toLowerCase().includes("unidad")) return "UNI";
  if (unidad.toLowerCase().includes("kilo")) return "KG";
  if (unidad.toLowerCase().includes("litro")) return "L";
  if (unidad.toLowerCase().includes("metro")) {
    if (unidad.toLowerCase().includes("cuadrado")) return "M2";
    if (
      unidad.toLowerCase().includes("cúbico") ||
      unidad.toLowerCase().includes("cubico")
    )
      return "M3";
    return "M";
  }

  // Por defecto, retornar unidad
  return "UNI";
}

/**
 * Convierte un porcentaje de IVA a su tipo correspondiente para facturación
 * @param iva - Porcentaje de IVA (0, 5, 10, 19, etc.)
 * @returns Tipo de IVA ("exentas", "iva5", "iva10")
 *
 * @example
 * convertIvaToType(0) // returns "exentas"
 * convertIvaToType(5) // returns "iva5"
 * convertIvaToType(10) // returns "iva10"
 * convertIvaToType(19) // returns "iva10"
 */
export function convertIvaToType(iva: number): "exentas" | "iva5" | "iva10" {
  if (iva === 0) return "exentas";
  if (iva === 5) return "iva5";
  return "iva10";
}
