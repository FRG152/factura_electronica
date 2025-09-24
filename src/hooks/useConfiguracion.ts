import { useState } from "react";
import type { ConfiguracionFacturaFormData } from "../schemas/configuracion";

export const useConfiguracion = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const enviarConfiguracion = async (
    data: ConfiguracionFacturaFormData,
    tipoDocumento: string
  ) => {
    setIsLoading(true);
    setError(null);
    console.log(data);
    // try {
    //   const response = await fetch(`/api/configuracion/${tipoDocumento}`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Error al guardar la configuración");
    //   }

    //   const result = await response.json();
    //   console.log("Configuración guardada:", result);

    //   alert("Configuración guardada exitosamente");

    //   return result;
    // } catch (err) {
    //   const errorMessage =
    //     err instanceof Error ? err.message : "Error desconocido";
    //   setError(errorMessage);
    //   console.error("Error:", errorMessage);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return {
    enviarConfiguracion,
    isLoading,
    error,
  };
};
