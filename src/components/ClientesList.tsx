/**
 * Lista de clientes con tabla y acciones
 */

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Cliente } from "../interfaces/clientes";
import { Edit, Trash2, RotateCcw, User } from "lucide-react";

interface ClientesListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
  onRestore?: (id: number) => void;
  isDeleting?: boolean;
  showEliminados?: boolean;
}

export function ClientesList({
  clientes,
  onEdit,
  onDelete,
  onRestore,
  isDeleting = false,
  showEliminados = false,
}: ClientesListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  const handleRestore = async (id: number) => {
    if (onRestore) {
      setDeletingId(id);
      await onRestore(id);
      setDeletingId(null);
    }
  };

  if (clientes.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay clientes registrados
        </h3>
        <p className="text-gray-500">
          {showEliminados
            ? "No hay clientes eliminados"
            : "Haz clic en 'Nuevo Cliente' para comenzar"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-16">#</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>CI/RUC</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente, index) => (
            <TableRow key={cliente.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="font-medium">{cliente.nombre}</div>
                {cliente.direccion && (
                  <div className="text-sm text-gray-500">
                    {cliente.direccion}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    cliente.tipo_persona === "fisica" ? "default" : "secondary"
                  }
                >
                  {cliente.tipo_persona === "fisica"
                    ? "Persona Física"
                    : "Persona Jurídica"}
                </Badge>
              </TableCell>
              <TableCell>
                {cliente.tipo_persona === "fisica" ? (
                  <div>
                    <div className="text-sm">CI: {cliente.ci || "N/A"}</div>
                    {cliente.tiene_ruc === 1 && cliente.ruc && (
                      <div className="text-xs text-gray-500">
                        RUC: {cliente.ruc}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm">RUC: {cliente.ruc || "N/A"}</div>
                )}
              </TableCell>
              <TableCell>
                {cliente.telefono ? (
                  <div className="text-sm">
                    <div>{cliente.telefono}</div>
                    {cliente.telefono_whatsapp && (
                      <div className="text-xs text-green-600">WhatsApp</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {cliente.email ? (
                  <div className="text-sm">{cliente.email}</div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {cliente.eliminado === 1 ? (
                  <Badge variant="destructive">Eliminado</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600">
                    Activo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {cliente.eliminado === 0 ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(cliente)}
                        disabled={isDeleting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cliente.id)}
                        disabled={isDeleting || deletingId === cliente.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    onRestore && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(cliente.id)}
                        disabled={isDeleting || deletingId === cliente.id}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restaurar
                      </Button>
                    )
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
