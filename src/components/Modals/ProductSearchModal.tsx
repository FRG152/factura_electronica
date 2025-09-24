import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import type { ItemFactura } from "../../interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Omit<ItemFactura, "id">) => void;
}

export function ProductSearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState([
    {
      codigo: "PROD001",
      descripcion: "Producto de Ejemplo 1",
      unidad: "UNI",
      precio: 10000,
      tipoIva: "iva10" as const,
    },
    {
      codigo: "PROD002",
      descripcion: "Producto de Ejemplo 2",
      unidad: "KG",
      precio: 5000,
      tipoIva: "iva5" as const,
    },
    {
      codigo: "SERV001",
      descripcion: "Servicio de Consultoría",
      unidad: "UNI",
      precio: 50000,
      tipoIva: "exentas" as const,
    },
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product: (typeof products)[0]) => {
    onSelectProduct({
      codigo: product.codigo,
      descripcion: product.descripcion,
      unidad: product.unidad,
      cantidad: 1,
      precio: product.precio,
      tipoIva: product.tipoIva,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Producto o Servicio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por código o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="space-y-2">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{product.descripcion}</div>
                        <div className="text-sm text-gray-600">
                          Código: {product.codigo} | Unidad: {product.unidad}
                        </div>
                        <div className="text-sm text-gray-500">
                          Precio: {product.precio.toLocaleString()} | IVA:{" "}
                          {product.tipoIva}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron productos
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
