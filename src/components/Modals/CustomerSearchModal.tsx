import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import type { Client } from "@/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchClientes, fetchClientes } from "../../store/slices/clientesSlice";
import { Badge } from "../ui/badge";

interface CustomerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: Client) => void;
}

export function CustomerSearchModal({
  isOpen,
  onClose,
  onSelectCustomer,
}: CustomerSearchModalProps) {
  const dispatch = useAppDispatch();
  const { clientes, isLoading } = useAppSelector((state) => state.clientes);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Cargar clientes activos al abrir el modal
      dispatch(fetchClientes({ eliminado: 0, limit: 50 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(
          searchClientes({
            search: searchTerm,
            eliminado: 0,
            limit: 50,
          })
        );
      } else {
        dispatch(fetchClientes({ eliminado: 0, limit: 50 }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  const handleSelectCustomer = (cliente: any) => {
    // Transformar Cliente de API a Client de interfaz
    const clienteTransformado: Client = {
      id: cliente.id,
      nombre: cliente.nombre,
      ruc: cliente.ruc || cliente.ci || "",
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      email: cliente.email,
    };
    onSelectCustomer(clienteTransformado);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, CI, RUC o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : clientes.length > 0 ? (
              <div className="space-y-2">
                {clientes.map((cliente) => (
                  <div
                    key={cliente.id}
                    className="p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectCustomer(cliente)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-lg">{cliente.nombre}</div>
                      <Badge
                        variant={
                          cliente.tipo_persona === "fisica"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {cliente.tipo_persona === "fisica"
                          ? "Persona Física"
                          : "Persona Jurídica"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {cliente.tipo_persona === "fisica" ? (
                        <>
                          {cliente.ci && (
                            <div className="text-gray-600">
                              <span className="font-medium">CI:</span>{" "}
                              {cliente.ci}
                            </div>
                          )}
                          {cliente.ruc && (
                            <div className="text-gray-600">
                              <span className="font-medium">RUC:</span>{" "}
                              {cliente.ruc}
                            </div>
                          )}
                        </>
                      ) : (
                        cliente.ruc && (
                          <div className="text-gray-600">
                            <span className="font-medium">RUC:</span>{" "}
                            {cliente.ruc}
                          </div>
                        )
                      )}
                      {cliente.telefono && (
                        <div className="text-gray-600">
                          <span className="font-medium">Tel:</span>{" "}
                          {cliente.telefono}
                        </div>
                      )}
                      {cliente.email && (
                        <div className="text-gray-600 col-span-2">
                          <span className="font-medium">Email:</span>{" "}
                          {cliente.email}
                        </div>
                      )}
                      {cliente.direccion && (
                        <div className="text-gray-500 col-span-2">
                          {cliente.direccion}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No se encontraron clientes con ese criterio"
                  : "No hay clientes registrados"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
