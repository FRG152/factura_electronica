/**
 * Formulario para crear/editar empresas
 */

import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Button } from "./ui/button";
import type { Empresa, CrearEmpresaDTO } from "../interfaces/empresas";
import { Save, X } from "lucide-react";

interface EmpresaFormProps {
  empresa?: Empresa;
  onSubmit: (data: CrearEmpresaDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EmpresaForm({
  empresa,
  onSubmit,
  onCancel,
  isLoading = false,
}: EmpresaFormProps) {
  const [formData, setFormData] = useState<CrearEmpresaDTO>({
    razon_social: "",
    nombre_comercial: "",
    ruc: "",
    dv: "",
    direccion: "",
    telefono: "",
    email: "",
    website: "",
    logo_url: "",
    timbrado: "",
    vigencia_desde: "",
    vigencia_hasta: "",
    establecimiento: "001",
    punto_expedicion: "001",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (empresa) {
      setFormData({
        razon_social: empresa.razon_social,
        nombre_comercial: empresa.nombre_comercial || "",
        ruc: empresa.ruc,
        dv: empresa.dv,
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        email: empresa.email || "",
        website: empresa.website || "",
        logo_url: empresa.logo_url || "",
        timbrado: empresa.timbrado || "",
        vigencia_desde: empresa.vigencia_desde || "",
        vigencia_hasta: empresa.vigencia_hasta || "",
        establecimiento: empresa.establecimiento || "001",
        punto_expedicion: empresa.punto_expedicion || "001",
      });
    }
  }, [empresa]);

  const handleChange = (field: keyof CrearEmpresaDTO, value: string) => {
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

    if (!formData.razon_social.trim()) {
      newErrors.razon_social = "La razón social es obligatoria";
    }

    if (!formData.ruc.trim()) {
      newErrors.ruc = "El RUC es obligatorio";
    } else if (!/^\d{7,8}$/.test(formData.ruc)) {
      newErrors.ruc = "El RUC debe tener 7 u 8 dígitos";
    }

    if (!formData.dv.trim()) {
      newErrors.dv = "El dígito verificador es obligatorio";
    } else if (!/^\d{1}$/.test(formData.dv)) {
      newErrors.dv = "El DV debe ser un solo dígito";
    }

    // Validar email si está presente
    if (formData.email && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Formato de email inválido";
      }
    }

    // Validar URL si está presente
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = "Formato de URL inválido";
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
    const dataToSubmit: CrearEmpresaDTO = {
      ...formData,
      nombre_comercial: formData.nombre_comercial?.trim() || undefined,
      direccion: formData.direccion?.trim() || undefined,
      telefono: formData.telefono?.trim() || undefined,
      email: formData.email?.trim() || undefined,
      website: formData.website?.trim() || undefined,
      logo_url: formData.logo_url?.trim() || undefined,
      timbrado: formData.timbrado?.trim() || undefined,
      vigencia_desde: formData.vigencia_desde || undefined,
      vigencia_hasta: formData.vigencia_hasta || undefined,
      establecimiento: formData.establecimiento?.trim() || undefined,
      punto_expedicion: formData.punto_expedicion?.trim() || undefined,
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos Generales */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Datos Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Razón Social"
              value={formData.razon_social}
              onChange={(value) => handleChange("razon_social", value)}
              placeholder="Empresa S.A."
              error={errors.razon_social}
              required
              disabled={isLoading}
            />
          </div>

          <Input
            label="Nombre Comercial"
            value={formData.nombre_comercial || ""}
            onChange={(value) => handleChange("nombre_comercial", value)}
            placeholder="Nombre fantasía"
            disabled={isLoading}
          />

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Input
                label="RUC"
                value={formData.ruc}
                onChange={(value) => handleChange("ruc", value)}
                placeholder="80012345"
                error={errors.ruc}
                required
                disabled={isLoading}
              />
            </div>
            <Input
              label="DV"
              value={formData.dv}
              onChange={(value) => handleChange("dv", value)}
              placeholder="6"
              error={errors.dv}
              required
              disabled={isLoading}
              maxLength={1}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Dirección"
              value={formData.direccion || ""}
              onChange={(value) => handleChange("direccion", value)}
              placeholder="Av. Mariscal López 1234"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Teléfono"
            value={formData.telefono || ""}
            onChange={(value) => handleChange("telefono", value)}
            placeholder="021-123-456"
            disabled={isLoading}
          />

          <Input
            label="Email"
            value={formData.email || ""}
            onChange={(value) => handleChange("email", value)}
            type="email"
            placeholder="contacto@empresa.com"
            error={errors.email}
            disabled={isLoading}
          />

          <Input
            label="Website"
            value={formData.website || ""}
            onChange={(value) => handleChange("website", value)}
            placeholder="https://www.empresa.com"
            error={errors.website}
            disabled={isLoading}
          />

          <Input
            label="URL del Logo"
            value={formData.logo_url || ""}
            onChange={(value) => handleChange("logo_url", value)}
            placeholder="https://..."
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Datos de Facturación */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Datos de Facturación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Timbrado"
            value={formData.timbrado || ""}
            onChange={(value) => handleChange("timbrado", value)}
            placeholder="12345678"
            disabled={isLoading}
          />

          <Input
            label="Vigencia Desde"
            value={formData.vigencia_desde || ""}
            onChange={(value) => handleChange("vigencia_desde", value)}
            type="text"
            placeholder="YYYY-MM-DD"
            disabled={isLoading}
          />

          <Input
            label="Vigencia Hasta"
            value={formData.vigencia_hasta || ""}
            onChange={(value) => handleChange("vigencia_hasta", value)}
            type="text"
            placeholder="YYYY-MM-DD"
            disabled={isLoading}
          />

          <Input
            label="Establecimiento"
            value={formData.establecimiento || ""}
            onChange={(value) => handleChange("establecimiento", value)}
            placeholder="001"
            disabled={isLoading}
          />

          <Input
            label="Punto de Expedición"
            value={formData.punto_expedicion || ""}
            onChange={(value) => handleChange("punto_expedicion", value)}
            placeholder="001"
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
          {isLoading ? "Guardando..." : empresa ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
