/**
 * Interfaces para el módulo de Empresas
 * Sistema multi-empresa
 */

export interface Empresa {
  id: number;
  razon_social: string;
  nombre_comercial?: string;
  ruc: string;
  dv: string; // Dígito verificador
  direccion?: string;
  telefono?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  activo: number; // 0 o 1
  created_at: string;
  updated_at: string;
  // Datos de facturación
  timbrado?: string;
  vigencia_desde?: string;
  vigencia_hasta?: string;
  establecimiento?: string;
  punto_expedicion?: string;
}

export interface CrearEmpresaDTO {
  razon_social: string;
  nombre_comercial?: string;
  ruc: string;
  dv: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  // Datos de facturación
  timbrado?: string;
  vigencia_desde?: string;
  vigencia_hasta?: string;
  establecimiento?: string;
  punto_expedicion?: string;
}

export interface ActualizarEmpresaDTO {
  razon_social?: string;
  nombre_comercial?: string;
  ruc?: string;
  dv?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  activo?: number;
  // Datos de facturación
  timbrado?: string;
  vigencia_desde?: string;
  vigencia_hasta?: string;
  establecimiento?: string;
  punto_expedicion?: string;
}

export interface ListarEmpresasParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: number; // 0 o 1
}

export interface PaginacionEmpresas {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListarEmpresasResponse {
  success: boolean;
  data: Empresa[];
  pagination: PaginacionEmpresas;
}

export interface EmpresaResponse {
  success: boolean;
  message: string;
  data: Empresa;
}

export interface DeleteEmpresaResponse {
  success: boolean;
  message: string;
}
