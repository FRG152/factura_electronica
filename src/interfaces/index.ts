export interface InvoiceItem {
  id: number;
  codigo: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  precio: number;
  tipoIva: "exentas" | "iva5" | "iva10";
}

export interface Client {
  id: number;
  nombre: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
}

export interface FacturaData {
  cliente: Client | null;
  condicionPago: string;
  items: InvoiceItem[];
  totales: {
    cantidadTotal: number;
    subtotalExentas: number;
    subtotal5: number;
    subtotal10: number;
    totalVenta: number;
    totalIva: number;
  };
}

export interface InvoiceCliente {
  contribuyente: boolean;
  razonSocial: string;
  tipoOperacion: number;
  tipoContribuyente: number;
  direccion: string;
  numeroCasa: string;
  departamento: number;
  departamentoDescripcion: string;
  distrito: number;
  distritoDescripcion: string;
  ciudad: number;
  ciudadDescripcion: string;
  pais: string;
  paisDescripcion: string;
  telefono: string;
  celular: string;
  email: string;
  codigo: string;
  ruc: string;
  documentoTipo: number;
  documentoNumero: string;
}

export interface InvoiceUsuario {
  documentoTipo: number;
  documentoNumero: string;
  nombre: string;
  cargo: string;
}

export interface InvoiceFactura {
  presencia: number;
  fecha: string;
}

export interface InvoiceEntrega {
  tipo: number;
  monto: number;
  moneda: string;
  cambio: number;
}

export interface InvoiceCondicion {
  tipo: number;
  entregas: InvoiceEntrega[];
}

export interface InvoiceItemAPI {
  codigo: string;
  descripcion: string;
  observacion: string;
  unidadMedida: number;
  cantidad: number;
  precioUnitario: number;
  cambio: number;
  descuento: number;
  anticipo: number;
  pais: string;
  paisDescripcion: string;
  ivaTipo: number;
  ivaBase: number;
  iva: number;
}

export interface CompleteInvoiceStructure {
  tipoDocumento: number;
  establecimiento: string;
  punto: string;
  numero: number;
  codigoSeguridadAleatorio: string;
  descripcion: string;
  observacion: string;
  fecha: string;
  tipoEmision: number;
  tipoTransaccion: number;
  tipoImpuesto: number;
  moneda: string;
  condicionAnticipo: number;
  condicionTipoCambio: number;
  descuentoGlobal: number;
  anticipoGlobal: number;
  cambio: string;
  factura: InvoiceFactura;
  cliente: InvoiceCliente;
  usuario: InvoiceUsuario;
  condicion: InvoiceCondicion;
  items: InvoiceItemAPI[];
}

// Components
export interface InputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  readOnly?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export interface Lote {
  id: number;
  numeroLote: string;
  estado: string;
}

export interface DocumentoItem {
  id: number;
  numeroDocumento: string;
  estado: "PENDIENTE" | "ENVIADO" | "APROBADO" | "RECHAZADO";
  cdc: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  lote: Lote;
  xmlConQR?: string;
}

export interface ListarDocumentosParams {
  estado?: "PENDIENTE" | "ENVIADO" | "APROBADO" | "RECHAZADO";
  numeroDocumento?: string;
  cdc?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface PaginacionInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ListarDocumentosResponse {
  documentos: DocumentoItem[];
  paginacion: PaginacionInfo;
}

export interface CrearDocumentoResponse {
  success: boolean;
  message: string;
  documento?: {
    id: number;
    numeroDocumento: string;
    cdc: string;
    estado: string;
  };
}
