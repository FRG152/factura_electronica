import type { LoginFormData, LoginResponse } from "../schemas/auth/login";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const login = async (
  credentials: LoginFormData
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("auth_token");

    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error en logout:", error);
    // No lanzamos error en logout para no bloquear al usuario
  }
};

export const refreshToken = async (): Promise<LoginResponse> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token de refresco inválido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al refrescar token:", error);
    throw error;
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("auth_token");

    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error al validar token:", error);
    return false;
  }
};
