import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { login, logout, validateToken } from "../api";
import type { User, LoginFormData, LoginResponse } from "../schemas/auth/login";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const isValid = await validateToken();
          if (isValid) {
            // Si el token es válido, obtener los datos del usuario
            const userData = localStorage.getItem("user_data");
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } else {
            // Si el token no es válido, limpiar el localStorage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response: LoginResponse = await login(credentials);

      if (response.success && response.data) {
        // Guardar token y datos del usuario
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Error al iniciar sesión");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar estado local independientemente del resultado del API
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setError(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout: logoutUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
