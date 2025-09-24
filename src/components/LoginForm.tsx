import { useState } from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useForm } from "react-hook-form";

import { useAuth } from "../contexts/AuthContext";

import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, FileText } from "lucide-react";

import { loginSchema, type LoginFormData } from "../schemas/auth/login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="container_login">
      <div className="content_login">
        <div className="text-center">
          <div className="logo">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1>Facturación Electrónica</h1>
          <h2>Inicia sesión en tu cuenta</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="correo@email.com"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="error">
              <p className="error_text">{error}</p>
            </div>
          )}

          <div>
            <Button type="submit" className="btn_submit">
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
