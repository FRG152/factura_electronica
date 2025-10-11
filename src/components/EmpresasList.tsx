/**
 * Lista de empresas con tabla y acciones
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
import type { Empresa } from "../interfaces/empresas";
import { Edit, Trash2, Building2, Power, PowerOff } from "lucide-react";

interface EmpresasListProps {
  empresas: Empresa[];
  onEdit: (empresa: Empresa) => void;
  onDelete: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  isDeleting?: boolean;
}

export function EmpresasList({
  empresas,
  onEdit,
  onDelete,
  onToggleStatus,
  isDeleting = false,
}: EmpresasListProps) {
  const [actioningId, setActioningId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }
    setActioningId(id);
    await onDelete(id);
    setActioningId(null);
  };

  const handleToggleStatus = async (id: number) => {
    if (onToggleStatus) {
      setActioningId(id);
      await onToggleStatus(id);
      setActioningId(null);
    }
  };

  if (empresas.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay empresas registradas
        </h3>
        <p className="text-gray-500">
          Haz clic en "Nueva Empresa" para comenzar
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
            <TableHead>Razón Social</TableHead>
            <TableHead>RUC</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Timbrado</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa, index) => (
            <TableRow key={empresa.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{empresa.razon_social}</div>
                  {empresa.nombre_comercial && (
                    <div className="text-sm text-gray-500">
                      {empresa.nombre_comercial}
                    </div>
                  )}
                  {empresa.direccion && (
                    <div className="text-xs text-gray-400">
                      {empresa.direccion}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono text-sm">
                  {empresa.ruc}-{empresa.dv}
                </div>
              </TableCell>
              <TableCell>
                {empresa.telefono && (
                  <div className="text-sm">{empresa.telefono}</div>
                )}
                {empresa.email && (
                  <div className="text-sm text-gray-500">{empresa.email}</div>
                )}
                {empresa.website && (
                  <div className="text-xs text-blue-600">
                    <a
                      href={empresa.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {empresa.website}
                    </a>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {empresa.timbrado ? (
                  <div>
                    <div className="text-sm font-mono">{empresa.timbrado}</div>
                    {empresa.vigencia_hasta && (
                      <div className="text-xs text-gray-500">
                        Hasta: {empresa.vigencia_hasta}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {empresa.activo === 1 ? (
                  <Badge variant="outline" className="text-green-600">
                    <Power className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <PowerOff className="h-3 w-3 mr-1" />
                    Inactivo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(empresa)}
                    disabled={isDeleting || actioningId === empresa.id}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {onToggleStatus && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(empresa.id)}
                      disabled={isDeleting || actioningId === empresa.id}
                      className={
                        empresa.activo === 1
                          ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                      }
                    >
                      {empresa.activo === 1 ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(empresa.id)}
                    disabled={isDeleting || actioningId === empresa.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
