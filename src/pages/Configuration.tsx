import {
  configuracionFacturaSchema,
  type ConfiguracionFacturaFormData,
} from "../schemas/configuracion";
import {
  monedaOptions,
  tipoEmisionOptions,
  tipoImpuestoOptions,
  tipoDocumentoOptions,
  tipoTransaccionOptions,
  condicionAnticipoOptions,
  condicionTipoCambioOptions,
} from "../constants/configuracion";
import { Select } from "../components/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfiguracion } from "../hooks/useConfiguracion";

export function Configuracion() {
  const { enviarConfiguracion, error } = useConfiguracion();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ConfiguracionFacturaFormData>({
    resolver: zodResolver(configuracionFacturaSchema),
    defaultValues: {
      tipoDocumento: "1",
      tipoTransaccion: "2",
      moneda: "PYG",
      condicionAnticipo: "0",
      tipoEmision: "1",
      tipoImpuesto: "1",
      condicionTipoCambio: "0",
    },
  });

  const onSubmit = async (data: ConfiguracionFacturaFormData) => {
    await enviarConfiguracion(data, "factura");
  };

  const onCancel = () => {
    reset();
  };

  return (
    <div className="container_configuration">
      <h1>Configuración de Documentos Electrónicos</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="container_form">
        <h2>Factura Electrónica</h2>

        {error && <div className="error">{error}</div>}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Columna Izquierda */}
          <div className="w-full space-y-4">
            <Select
              className="w-full"
              label="Tipo de Documento"
              options={tipoDocumentoOptions}
              value={watch("tipoDocumento")}
              onValueChange={(value) => setValue("tipoDocumento", value)}
              error={errors.tipoDocumento?.message}
              required
            />

            <Select
              label="Tipo de Transacción"
              options={tipoTransaccionOptions}
              value={watch("tipoTransaccion")}
              onValueChange={(value) => setValue("tipoTransaccion", value)}
              error={errors.tipoTransaccion?.message}
              required
            />

            <Select
              label="Moneda"
              options={monedaOptions}
              value={watch("moneda")}
              onValueChange={(value) => setValue("moneda", value)}
              error={errors.moneda?.message}
              required
            />

            <Select
              label="Condición de Anticipo"
              options={condicionAnticipoOptions}
              value={watch("condicionAnticipo")}
              onValueChange={(value) => setValue("condicionAnticipo", value)}
              error={errors.condicionAnticipo?.message}
              required
            />
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <Select
              label="Tipo de Emisión"
              options={tipoEmisionOptions}
              value={watch("tipoEmision")}
              onValueChange={(value) => setValue("tipoEmision", value)}
              error={errors.tipoEmision?.message}
              required
            />

            <Select
              label="Tipo de Impuesto"
              options={tipoImpuestoOptions}
              value={watch("tipoImpuesto")}
              onValueChange={(value) => setValue("tipoImpuesto", value)}
              error={errors.tipoImpuesto?.message}
              required
            />

            <Select
              label="Condición de Tipo de Cambio"
              options={condicionTipoCambioOptions}
              value={watch("condicionTipoCambio")}
              onValueChange={(value) => setValue("condicionTipoCambio", value)}
              error={errors.condicionTipoCambio?.message}
              required
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn_cancel">
            Cancelar
          </button>
          <button type="submit" className="btn_submit">
            {/* {isLoading ? "Guardando..." : "Guardar Configuración"} */}
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
