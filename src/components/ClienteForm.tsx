/**
 * Formulario para crear/editar clientes
 */

import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Button } from "./ui/button";
import type {
  Cliente,
  CrearClienteDTO,
  TipoPersona,
} from "../interfaces/clientes";
import { Save, X } from "lucide-react";

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: CrearClienteDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const tipoPersonaOptions = [
  { value: "fisica", label: "Persona Física" },
  { value: "juridica", label: "Persona Jurídica" },
];

export function ClienteForm({
  cliente,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClienteFormProps) {
  const [formData, setFormData] = useState<CrearClienteDTO>({
    nombre: "",
    tipo_persona: "fisica",
    ci: "",
    fecha_nacimiento: "",
    tiene_ruc: 0,
    ruc: "",
    telefono: "",
    pais_telefono: "PY",
    direccion: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        tipo_persona: cliente.tipo_persona,
        ci: cliente.ci || "",
        fecha_nacimiento: cliente.fecha_nacimiento || "",
        tiene_ruc: cliente.tiene_ruc,
        ruc: cliente.ruc || "",
        telefono: cliente.telefono || "",
        pais_telefono: cliente.pais_telefono || "PY",
        direccion: cliente.direccion || "",
        email: cliente.email || "",
      });
    }
  }, [cliente]);

  const handleChange = (field: keyof CrearClienteDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (formData.tipo_persona === "fisica") {
      if (!formData.ci?.trim()) {
        newErrors.ci = "La cédula es obligatoria para personas físicas";
      } else if (!/^\d{1,8}$/.test(formData.ci)) {
        newErrors.ci = "La cédula debe contener solo números (máx. 8 dígitos)";
      }

      if (formData.tiene_ruc === 1 && !formData.ruc?.trim()) {
        newErrors.ruc = "El RUC es obligatorio si 'tiene RUC' está marcado";
      }
    } else {
      // Persona jurídica
      if (!formData.ruc?.trim()) {
        newErrors.ruc = "El RUC es obligatorio para personas jurídicas";
      }
    }

    // Validar RUC si está presente
    if (formData.ruc && formData.ruc.trim()) {
      if (!/^\d{7,8}-\d{1}$/.test(formData.ruc)) {
        newErrors.ruc = "Formato de RUC inválido (ejemplo: 80012345-6)";
      }
    }

    // Validar email si está presente
    if (formData.email && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Formato de email inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Limpiar campos vacíos opcionales
    const dataToSubmit: CrearClienteDTO = {
      ...formData,
      ci: formData.ci?.trim() || undefined,
      ruc: formData.ruc?.trim() || undefined,
      telefono: formData.telefono?.trim() || undefined,
      direccion: formData.direccion?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      fecha_nacimiento: formData.fecha_nacimiento || undefined,
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Persona */}
        <Select
          label="Tipo de Persona"
          value={formData.tipo_persona}
          options={tipoPersonaOptions}
          onValueChange={(value) =>
            handleChange("tipo_persona", value as TipoPersona)
          }
          required
          disabled={isLoading}
        />

        {/* Nombre */}
        <Input
          label="Nombre / Razón Social"
          value={formData.nombre}
          onChange={(value) => handleChange("nombre", value)}
          placeholder="Ingrese el nombre completo"
          error={errors.nombre}
          required
          disabled={isLoading}
        />

        {/* Cédula (solo para persona física) */}
        {formData.tipo_persona === "fisica" && (
          <>
            <Input
              label="Cédula"
              value={formData.ci || ""}
              onChange={(value) => handleChange("ci", value)}
              placeholder="12345678"
              error={errors.ci}
              required
              disabled={isLoading}
            />

            <Input
              label="Fecha de Nacimiento"
              value={formData.fecha_nacimiento || ""}
              onChange={(value) => handleChange("fecha_nacimiento", value)}
              type="text"
              placeholder="YYYY-MM-DD"
              disabled={isLoading}
            />

            {/* Checkbox Tiene RUC */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="tiene_ruc"
                checked={formData.tiene_ruc === 1}
                onChange={(e) =>
                  handleChange("tiene_ruc", e.target.checked ? 1 : 0)
                }
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="tiene_ruc" className="text-sm font-medium">
                Tiene RUC
              </label>
            </div>
          </>
        )}

        {/* RUC */}
        {(formData.tipo_persona === "juridica" || formData.tiene_ruc === 1) && (
          <Input
            label="RUC"
            value={formData.ruc || ""}
            onChange={(value) => handleChange("ruc", value)}
            placeholder="80012345-6"
            error={errors.ruc}
            required={formData.tipo_persona === "juridica"}
            disabled={isLoading}
          />
        )}

        {/* Teléfono */}
        <Input
          label="Teléfono"
          value={formData.telefono || ""}
          onChange={(value) => handleChange("telefono", value)}
          placeholder="0981123456"
          disabled={isLoading}
        />

        {/* Email */}
        <Input
          label="Email"
          value={formData.email || ""}
          onChange={(value) => handleChange("email", value)}
          type="email"
          placeholder="ejemplo@email.com"
          error={errors.email}
          disabled={isLoading}
        />

        {/* Dirección */}
        <div className="md:col-span-2">
          <Input
            label="Dirección"
            value={formData.direccion || ""}
            onChange={(value) => handleChange("direccion", value)}
            placeholder="Avda. España 123"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Guardando..." : cliente ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
