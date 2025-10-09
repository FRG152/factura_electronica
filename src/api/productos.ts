import type {
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
  BuscarProductosParams,
} from "../interfaces/productos";

const API_BASE_URL = "/api";

export const crearProducto = async (
  producto: CreateProductoDto
): Promise<Producto> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const listarProductos = async (): Promise<Producto[]> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al listar productos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al listar productos:", error);
    throw error;
  }
};

export const buscarProductos = async (
  params: BuscarProductosParams = {}
): Promise<Producto[]> => {
  try {
    const token = localStorage.getItem("auth_token");

    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const url = `${API_BASE_URL}/productos?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al buscar productos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al buscar productos:", error);
    throw error;
  }
};

export const obtenerProductoPorId = async (id: number): Promise<Producto> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};

export const buscarProductoPorCodigoBarras = async (
  codigo: string
): Promise<Producto> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(
      `${API_BASE_URL}/productos/codigo-barras/${codigo}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Producto no encontrado");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al buscar producto por código de barras:", error);
    throw error;
  }
};

export const obtenerProductosBajoStock = async (): Promise<Producto[]> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos/bajo-stock`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al obtener productos con bajo stock"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener productos con bajo stock:", error);
    throw error;
  }
};

export const actualizarProducto = async (
  id: number,
  producto: UpdateProductoDto
): Promise<Producto> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar producto");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const eliminarProducto = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar producto");
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};
