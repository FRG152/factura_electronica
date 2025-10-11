/**
 * Interfaces para el módulo de Clientes
 * Basado en la API de clientes del sistema de facturación
 */

export type TipoPersona = "fisica" | "juridica";

export interface Cliente {
  id: number;
  nombre: string;
  tipo_persona: TipoPersona;
  ci?: string;
  fecha_nacimiento?: string;
  tiene_ruc: number; // 0 o 1
  ruc?: string;
  telefono?: string;
  pais_telefono: string; // Default: "PY"
  telefono_normalizado?: string;
  telefono_whatsapp?: string;
  direccion?: string;
  email?: string;
  eliminado: number; // 0 o 1
  created_at: string;
  id_departamento?: number;
  id_distrito?: number;
  id_ciudad?: number;
  id_barrio?: number;
  empresa_id?: number;
}

export interface CrearClienteDTO {
  nombre: string;
  tipo_persona: TipoPersona;
  ci?: string;
  fecha_nacimiento?: string;
  tiene_ruc?: number;
  ruc?: string;
  telefono?: string;
  pais_telefono?: string;
  direccion?: string;
  email?: string;
  id_departamento?: number;
  id_distrito?: number;
  id_ciudad?: number;
  id_barrio?: number;
  empresa_id?: number;
}

export interface ActualizarClienteDTO {
  nombre?: string;
  tipo_persona?: TipoPersona;
  ci?: string;
  fecha_nacimiento?: string;
  tiene_ruc?: number;
  ruc?: string;
  telefono?: string;
  pais_telefono?: string;
  direccion?: string;
  email?: string;
  id_departamento?: number;
  id_distrito?: number;
  id_ciudad?: number;
  id_barrio?: number;
}

export interface ListarClientesParams {
  page?: number;
  limit?: number;
  search?: string;
  empresa_id?: number;
  tipo_persona?: TipoPersona;
  eliminado?: number; // 0 o 1
}

export interface PaginacionClientes {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListarClientesResponse {
  success: boolean;
  data: Cliente[];
  pagination: PaginacionClientes;
}

export interface ClienteResponse {
  success: boolean;
  message: string;
  data: Cliente;
}

export interface ClienteEmpresaResponse {
  success: boolean;
  data: Cliente[];
  total: number;
}

export interface DeleteClienteResponse {
  success: boolean;
  message: string;
}
