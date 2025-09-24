import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Search, X } from "lucide-react";
import type { Client } from "@/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [customers] = useState<Client[]>([
    {
      id: 1,
      nombre: "Cliente Ejemplo 1",
      ruc: "12345678-9",
      direccion: "Av. Principal 123",
      telefono: "0981-123-456",
      email: "cliente1@email.com",
    },
    {
      id: 2,
      nombre: "Cliente Ejemplo 2",
      ruc: "87654321-0",
      direccion: "Calle Secundaria 456",
      telefono: "0981-654-321",
      email: "cliente2@email.com",
    },
  ]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.ruc.includes(searchTerm)
  );

  const handleSelectCustomer = (customer: Client) => {
    onSelectCustomer(customer);
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
              placeholder="Buscar por nombre o RUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredCustomers.length > 0 ? (
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="font-medium">{customer.nombre}</div>
                    <div className="text-sm text-gray-600">
                      RUC: {customer.ruc}
                    </div>
                    {customer.direccion && (
                      <div className="text-sm text-gray-500">
                        {customer.direccion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron clientes
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
