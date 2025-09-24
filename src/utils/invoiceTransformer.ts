import type {
  CompleteInvoiceStructure,
  FacturaData,
  InvoiceCliente,
  InvoiceUsuario,
  InvoiceFactura,
  InvoiceCondicion,
  InvoiceItemAPI,
} from "../interfaces";

/**
 * Transforms the current form data structure to the complete API structure
 */
export function transformToCompleteInvoiceStructure(
  facturaData: FacturaData,
  additionalData: {
    tipoDocumento?: number;
    establecimiento?: string;
    punto?: string;
    numero?: number;
    codigoSeguridadAleatorio?: string;
    descripcion?: string;
    observacion?: string;
    fecha?: string;
    tipoEmision?: number;
    tipoTransaccion?: number;
    tipoImpuesto?: number;
    moneda?: string;
    condicionAnticipo?: number;
    condicionTipoCambio?: number;
    descuentoGlobal?: number;
    anticipoGlobal?: number;
    cambio?: string;
    usuario?: InvoiceUsuario;
  }
): CompleteInvoiceStructure {
  const now = new Date().toISOString();

  return {
    tipoDocumento: additionalData.tipoDocumento || 1,
    establecimiento: additionalData.establecimiento || "001",
    punto: additionalData.punto || "001",
    numero: additionalData.numero || 10,
    codigoSeguridadAleatorio:
      additionalData.codigoSeguridadAleatorio || generateRandomCode(),
    descripcion: additionalData.descripcion || "Factura electrónica",
    observacion: additionalData.observacion || "",
    fecha: additionalData.fecha || now,
    tipoEmision: additionalData.tipoEmision || 1,
    tipoTransaccion: additionalData.tipoTransaccion || 2,
    tipoImpuesto: additionalData.tipoImpuesto || 1,
    moneda: additionalData.moneda || "PYG",
    condicionAnticipo: additionalData.condicionAnticipo || 0,
    condicionTipoCambio: additionalData.condicionTipoCambio || 0,
    descuentoGlobal: additionalData.descuentoGlobal || 0,
    anticipoGlobal: additionalData.anticipoGlobal || 0,
    cambio: additionalData.cambio || "",
    factura: {
      presencia: 1,
      fecha: additionalData.fecha || now,
    },
    cliente: transformCliente(facturaData.cliente),
    usuario: additionalData.usuario || getDefaultUsuario(),
    condicion: transformCondicion(
      facturaData.condicionPago,
      facturaData.totales.totalVenta
    ),
    items: transformItems(facturaData.items),
  };
}

/**
 * Transforms the current Client interface to InvoiceCliente
 */
function transformCliente(cliente: any): InvoiceCliente {
  if (!cliente) {
    throw new Error("Cliente es requerido");
  }

  return {
    contribuyente: true,
    razonSocial: cliente.nombre || "",
    tipoOperacion: 1,
    tipoContribuyente: 2,
    direccion: cliente.direccion || "",
    numeroCasa: "0",
    departamento: 11,
    departamentoDescripcion: "ALTO PARANA",
    distrito: 173,
    distritoDescripcion: "CIUDAD DEL ESTE",
    ciudad: 4278,
    ciudadDescripcion: "CIUDAD DEL ESTE",
    pais: "PRY",
    paisDescripcion: "Paraguay",
    telefono: cliente.telefono || "",
    celular: cliente.telefono || "",
    email: cliente.email || "",
    codigo: "026",
    ruc: cliente.ruc || "",
    documentoTipo: 1,
    documentoNumero: cliente.ruc?.replace(/[^0-9]/g, "") || "",
  };
}

/**
 * Transforms the current InvoiceItem interface to InvoiceItemAPI
 */
function transformItems(items: any[]): InvoiceItemAPI[] {
  return items.map((item) => ({
    codigo: item.codigo || "",
    descripcion: item.descripcion || "",
    observacion: "",
    unidadMedida: getUnidadMedidaCode(item.unidad),
    cantidad: item.cantidad || 0,
    precioUnitario: item.precio || 0,
    cambio: 0,
    descuento: 0,
    anticipo: 0,
    pais: "PRY",
    paisDescripcion: "Paraguay",
    ivaTipo: getIvaTipoCode(item.tipoIva),
    ivaBase: 100,
    iva: getIvaPercentage(item.tipoIva),
  }));
}

/**
 * Transforms payment condition to InvoiceCondicion
 */
function transformCondicion(
  condicionPago: string,
  totalVenta: number
): InvoiceCondicion {
  return {
    tipo: 1,
    entregas: [
      {
        tipo: 1,
        monto: totalVenta,
        moneda: "PYG",
        cambio: 0,
      },
    ],
  };
}

/**
 * Gets the default usuario data
 */
function getDefaultUsuario(): InvoiceUsuario {
  return {
    documentoTipo: 1,
    documentoNumero: "157264",
    nombre: "Juan Pérez",
    cargo: "Vendedor",
  };
}

/**
 * Generates a random 6-digit code
 */
function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Maps unidad string to numeric code
 */
function getUnidadMedidaCode(unidad: string): number {
  const unidadMap: { [key: string]: number } = {
    UNI: 77,
    KG: 78,
    L: 79,
    M: 80,
    M2: 81,
    M3: 82,
  };
  return unidadMap[unidad] || 77;
}

/**
 * Maps IVA type string to numeric code
 */
function getIvaTipoCode(tipoIva: string): number {
  const ivaMap: { [key: string]: number } = {
    exentas: 0,
    iva5: 1,
    iva10: 2,
  };
  return ivaMap[tipoIva] || 2;
}

/**
 * Gets IVA percentage based on type
 */
function getIvaPercentage(tipoIva: string): number {
  const ivaMap: { [key: string]: number } = {
    exentas: 0,
    iva5: 5,
    iva10: 10,
  };
  return ivaMap[tipoIva] || 10;
}
