import { Button } from "../ui/button";
import type { FacturaData } from "../../interfaces";
import { FileText, CheckCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ConfirmInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  facturaData: FacturaData;
  isSubmitting?: boolean;
}

export function ConfirmInvoiceModal({
  isOpen,
  onClose,
  onConfirm,
  facturaData,
  isSubmitting = false,
}: ConfirmInvoiceModalProps) {
  const { cliente, condicionPago, items, totales } = facturaData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Confirmar Emisión de Factura
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p className="text-sm text-gray-600">
              {cliente?.nombre} - RUC: {cliente?.ruc}
            </p>
            <p className="text-sm text-gray-500">
              Condición de pago: {condicionPago}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Productos ({items.length})</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {index + 1}. {item.descripcion}
                  </span>
                  <span>
                    {item.cantidad} x {item.precio.toLocaleString()} ={" "}
                    {(item.cantidad * item.precio).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Totales</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between">
                  <span>Exentas:</span>
                  <span>{totales.subtotalExentas.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA 5%:</span>
                  <span>{totales.subtotal5.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA 10%:</span>
                  <span>{totales.subtotal10.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-semibold">
                  <span>Total Venta:</span>
                  <span className="text-green-600">
                    {totales.totalVenta.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total IVA:</span>
                  <span className="text-orange-600">
                    {Math.round(totales.totalIva).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Emitiendo...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar y Emitir
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
