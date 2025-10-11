/**
 * Servicios de API para gestión de empresas
 * Sistema multi-empresa
 */

import type {
  Empresa,
  CrearEmpresaDTO,
  ActualizarEmpresaDTO,
  ListarEmpresasParams,
  ListarEmpresasResponse,
  EmpresaResponse,
  DeleteEmpresaResponse,
} from "../interfaces/empresas";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Crear una nueva empresa
 * POST /api/empresas
 */
export const crearEmpresa = async (
  empresa: CrearEmpresaDTO
): Promise<EmpresaResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/empresas`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear empresa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear empresa:", error);
    throw error;
  }
};

/**
 * Listar empresas con paginación y filtros
 * GET /api/empresas
 */
export const listarEmpresas = async (
  params: ListarEmpresasParams = {}
): Promise<ListarEmpresasResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.activo !== undefined)
      queryParams.append("activo", params.activo.toString());

    const url = `${API_BASE_URL}/empresas?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al listar empresas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al listar empresas:", error);
    throw error;
  }
};

/**
 * Obtener empresa por ID
 * GET /api/empresas/:id
 */
export const obtenerEmpresaPorId = async (
  id: number
): Promise<EmpresaResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener empresa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    throw error;
  }
};

/**
 * Actualizar empresa
 * PATCH /api/empresas/:id
 */
export const actualizarEmpresa = async (
  id: number,
  empresa: ActualizarEmpresaDTO
): Promise<EmpresaResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar empresa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    throw error;
  }
};

/**
 * Eliminar empresa (soft delete)
 * DELETE /api/empresas/:id
 */
export const eliminarEmpresa = async (
  id: number
): Promise<DeleteEmpresaResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/empresas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar empresa");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al eliminar empresa:", error);
    throw error;
  }
};

/**
 * Activar/Desactivar empresa
 * PATCH /api/empresas/:id/toggle-status
 */
export const toggleEmpresaStatus = async (
  id: number
): Promise<EmpresaResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/empresas/${id}/toggle-status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al cambiar estado de empresa"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al cambiar estado de empresa:", error);
    throw error;
  }
};
