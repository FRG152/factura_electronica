import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "../components/ui/table";
import { Input } from "../components/Input";
import { Button } from "../components/ui/button";
import { Select } from "../components/Select";
import { useState } from "react";
import { ProductSearchModal } from "../components/Modals/ProductSearchModal";
import { CustomerSearchModal } from "../components/Modals/CustomerSearchModal";
import { ConfirmInvoiceModal } from "../components/Modals/ConfirmInvoiceModal";
import { paymentCondition, unit } from "@/constants/invoice";
import { Plus, Search, Trash2, Minus, FileText } from "lucide-react";
import type { InvoiceItem, Client, FacturaData } from "../interfaces";
import { transformToCompleteInvoiceStructure } from "../utils/invoiceTransformer";

export function GenerarFactura() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [cliente, setCliente] = useState<Client | null>(null);
  const [proximoId, setProximoId] = useState(1);
  const [condicionPago, setCondicionPago] = useState("Contado");

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const agregarItem = () => {
    const nuevoItem: InvoiceItem = {
      id: proximoId,
      codigo: "",
      descripcion: "",
      unidad: "UNI",
      cantidad: 1,
      precio: 0,
      tipoIva: "iva10",
    };
    setItems([...items, nuevoItem]);
    setProximoId(proximoId + 1);
  };

  const eliminarItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const actualizarItem = (id: number, campo: keyof InvoiceItem, valor: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  const actualizarCantidad = (id: number, cambio: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const nuevaCantidad = Math.max(0, item.cantidad + cambio);
      actualizarItem(id, "cantidad", nuevaCantidad);
    }
  };

  const handleSelectCustomer = (customer: Client) => setCliente(customer);

  const handleSelectProduct = (product: Omit<InvoiceItem, "id">) => {
    const nuevoItem: InvoiceItem = {
      ...product,
      id: proximoId,
    };
    setItems([...items, nuevoItem]);
    setProximoId(proximoId + 1);
  };

  const handleConfirmInvoice = () => {
    // Crear la estructura completa de la factura
    const completeInvoiceStructure = transformToCompleteInvoiceStructure(
      facturaData,
      {
        tipoDocumento: 1,
        establecimiento: "001",
        punto: "001",
        numero: 10,
        codigoSeguridadAleatorio: Math.floor(
          100000 + Math.random() * 900000
        ).toString(),
        descripcion: "Factura electrónica",
        observacion: "",
        fecha: new Date().toISOString(),
        tipoEmision: 1,
        tipoTransaccion: 2,
        tipoImpuesto: 1,
        moneda: "PYG",
        condicionAnticipo: 0,
        condicionTipoCambio: 0,
        descuentoGlobal: 0,
        anticipoGlobal: 0,
        cambio: "",
      }
    );

    console.log("=== ESTRUCTURA COMPLETA DE LA FACTURA ===");
    console.log(JSON.stringify(completeInvoiceStructure, null, 2));
    console.log("==========================================");

    alert("Factura emitida correctamente");
    setIsConfirmModalOpen(false);
    setCliente(null);
    setItems([]);
    setProximoId(1);
  };

  const calcularSubtotal = (tipoIva: string) => {
    return items.reduce((total, item) => {
      const subtotalItem = item.cantidad * item.precio;
      if (tipoIva === "exentas" && item.tipoIva === "exentas")
        return total + subtotalItem;
      if (tipoIva === "iva5" && item.tipoIva === "iva5")
        return total + subtotalItem;
      if (tipoIva === "iva10" && item.tipoIva === "iva10")
        return total + subtotalItem;
      return total;
    }, 0);
  };

  const subtotalExentas = calcularSubtotal("exentas");
  const subtotal5 = calcularSubtotal("iva5");
  const subtotal10 = calcularSubtotal("iva10");
  const totalVenta = subtotalExentas + subtotal5 + subtotal10;
  const totalIva = subtotal5 * 0.05 + subtotal10 * 0.1;
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);

  const emitirFactura = () => {
    if (items.length === 0) {
      alert("Debe agregar al menos un ítem");
      return;
    }
    if (!cliente) {
      alert("Debe seleccionar un cliente");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const facturaData: FacturaData = {
    cliente,
    condicionPago,
    items,
    totales: {
      cantidadTotal,
      subtotalExentas,
      subtotal5,
      subtotal10,
      totalVenta,
      totalIva,
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Generar Factura</h1>
      </div>

      <div className="bg-white border rounded-lg p-5 mb-6">
        <h2 className="text-lg font-semibold mb-2">Información del Cliente</h2>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <div className="flex items-center gap-2">
              <Input
                label=""
                placeholder="Nombre del cliente"
                value={cliente?.nombre || ""}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => setIsCustomerModalOpen(true)}
              >
                <Search size={30} />
              </Button>
            </div>
          </div>

          <Select
            label="Condición de pago"
            value={condicionPago}
            options={paymentCondition}
            className="mb-1"
            placeholder="Seleccione condición de pago"
            onValueChange={setCondicionPago}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <Button
          onClick={agregarItem}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={30} />
          Agregar Producto
        </Button>
        <Button
          variant="outline"
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
          onClick={() => setIsProductModalOpen(true)}
        >
          <Search size={30} />
          Buscar Producto
        </Button>
      </div>

      {/* Tabla de Items */}
      {items.length > 0 ? (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-2">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16">Item</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-32">Unidad</TableHead>
                <TableHead className="w-32">Cantidad</TableHead>
                <TableHead className="w-32">Precio</TableHead>
                <TableHead className="w-24">Exentas</TableHead>
                <TableHead className="w-24">IVA 5%</TableHead>
                <TableHead className="w-24">IVA 10%</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Input
                      label=""
                      value={item.codigo}
                      onChange={(value) =>
                        actualizarItem(item.id, "codigo", value)
                      }
                      placeholder="-"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      label=""
                      value={item.descripcion}
                      onChange={(value) =>
                        actualizarItem(item.id, "descripcion", value)
                      }
                      placeholder="Descripción del ítem"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      label=""
                      value={item.unidad}
                      options={unit}
                      onValueChange={(valor: string) =>
                        actualizarItem(item.id, "unidad", valor)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.id, -1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        label=""
                        value={item.cantidad.toString()}
                        onChange={(value) =>
                          actualizarItem(
                            item.id,
                            "cantidad",
                            parseFloat(value) || 0
                          )
                        }
                        type="number"
                        className="w-16 text-center"
                        min="0"
                        step="0.01"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => actualizarCantidad(item.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      label=""
                      value={item.precio.toString()}
                      onChange={(value) =>
                        actualizarItem(
                          item.id,
                          "precio",
                          parseFloat(value) || 0
                        )
                      }
                      type="number"
                      placeholder="0"
                      className="w-full"
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={`iva-${item.id}`}
                        checked={item.tipoIva === "exentas"}
                        onChange={() =>
                          actualizarItem(item.id, "tipoIva", "exentas")
                        }
                        className="mb-1"
                      />
                      <span className="text-xs text-gray-600">
                        {item.tipoIva === "exentas"
                          ? (item.cantidad * item.precio).toFixed(2)
                          : "0"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={`iva-${item.id}`}
                        checked={item.tipoIva === "iva5"}
                        onChange={() =>
                          actualizarItem(item.id, "tipoIva", "iva5")
                        }
                        className="mb-1"
                      />
                      <span className="text-xs text-gray-600">
                        {item.tipoIva === "iva5"
                          ? (item.cantidad * item.precio).toFixed(2)
                          : "0"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        name={`iva-${item.id}`}
                        checked={item.tipoIva === "iva10"}
                        onChange={() =>
                          actualizarItem(item.id, "tipoIva", "iva10")
                        }
                        className="mb-1"
                      />
                      <span className="text-xs text-gray-600">
                        {item.tipoIva === "iva10"
                          ? (item.cantidad * item.precio).toFixed(2)
                          : "0"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => eliminarItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-12 text-center mb-6">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay productos agregados
          </h3>
          <p className="text-gray-500 mb-4">
            Haga clic en "Agregar Producto" para comenzar
          </p>
          <Button
            onClick={agregarItem}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Producto
          </Button>
        </div>
      )}

      {/* Summary of the Invoice */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">
                  Cantidad Total
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Subtotal
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Total Venta
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Total IVA
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-lg">
                  {cantidadTotal.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      Exentas: {subtotalExentas.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      IVA 5%: {subtotal5.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      IVA 10%: {subtotal10.toLocaleString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="bg-green-100 font-semibold text-green-800 text-lg">
                  {totalVenta.toLocaleString()}
                </TableCell>
                <TableCell className="bg-orange-100 font-semibold text-orange-800 text-lg">
                  {Math.round(totalIva).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="px-6">
          Cancelar
        </Button>
        <Button
          onClick={emitirFactura}
          disabled={items.length === 0 || !cliente}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          <FileText size={30} />
          Emitir Factura
        </Button>
      </div>

      {/* Modals */}
      <CustomerSearchModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
      />

      <ProductSearchModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <ConfirmInvoiceModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmInvoice}
        facturaData={facturaData}
      />
    </div>
  );
}
