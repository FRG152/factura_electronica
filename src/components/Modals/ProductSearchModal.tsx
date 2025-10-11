import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Search, X, Plus } from "lucide-react";

import type { InvoiceItem } from "../../interfaces";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { mapUnidadMedida, convertIvaToType } from "@/lib/utils";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { fetchProductos } from "@/store/slices/productosSlice";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Omit<InvoiceItem, "id">) => void;
}

export function ProductSearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: ProductSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { productos } = useAppSelector((state) => state.productos);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  const filteredProducts = productos.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.nombre?.toLowerCase().includes(searchLower) ||
      product.descripcion?.toLowerCase().includes(searchLower) ||
      product.codigo_barras?.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectProduct = (product: (typeof productos)[0]) => {
    const productData = {
      codigo: product.codigo_barras || "",
      descripcion: product.nombre || "",
      unidad: mapUnidadMedida(product.unidad_medida),
      cantidad: 1,
      precio: product.precio_venta1,
      tipoIva: convertIvaToType(product.iva),
    };

    onSelectProduct(productData);
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
                {filteredProducts.map((product) => (
                  <div
                    key={product.id_producto}
                    className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">
                          {product.nombre}
                        </div>
                        {product.descripcion && (
                          <div className="text-sm text-gray-600 mt-1">
                            {product.descripcion}
                          </div>
                        )}
                        <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-3">
                          {product.codigo_barras && (
                            <span className="font-medium">
                              📦 {product.codigo_barras}
                            </span>
                          )}
                          <span>📏 {product.unidad_medida || "Unidad"}</span>
                          <span className="font-semibold text-green-600">
                            💰 ${product.precio_venta1.toLocaleString("es-CO")}
                          </span>
                          <span className="font-medium text-orange-600">
                            IVA {product.iva}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center">
                        <div className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                          <Plus className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No se encontraron productos que coincidan con tu búsqueda"
                  : "No hay productos disponibles"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
