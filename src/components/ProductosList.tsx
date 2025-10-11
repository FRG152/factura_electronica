import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProductos,
  searchProductos,
  deleteProducto,
  clearError,
  setSearchQuery,
} from "../store/slices/productosSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function ProductosList() {
  const dispatch = useAppDispatch();
  const { productos, isLoading, isDeleting, error, searchQuery } =
    useAppSelector((state) => state.productos);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      dispatch(searchProductos({ search: searchInput.trim() }));
    } else {
      dispatch(fetchProductos());
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      dispatch(fetchProductos());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteClick = (id: number) => {
    setProductoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productoToDelete) {
      dispatch(deleteProducto(productoToDelete));
      setDeleteDialogOpen(false);
      setProductoToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  const getStockStatus = (stockMinimo?: number, controlaStock?: number) => {
    if (!controlaStock || stockMinimo === undefined) {
      return { label: "Sin control", variant: "secondary" as const };
    }
    return { label: `Mín: ${stockMinimo}`, variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>
        <Link to="/productos/crear">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, descripción o código de barras..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Resultados para: "{searchQuery}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos ({productos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No se encontraron productos"
                : "No hay productos registrados"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio de Venta</TableHead>
                  <TableHead>IVA</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Código de Barras</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => {
                  const stockStatus = getStockStatus(
                    producto.stock_minimo,
                    producto.controla_stock
                  );
                  return (
                    <TableRow key={producto.id_producto}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{producto.nombre}</div>
                          {producto.descripcion && (
                            <div className="text-sm text-muted-foreground">
                              {producto.descripcion}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatPrice(producto.precio_venta1)}
                        </div>
                        {producto.precio_venta2 && (
                          <div className="text-sm text-muted-foreground">
                            Alt: {formatPrice(producto.precio_venta2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{producto.iva}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {producto.codigo_barras ? (
                          <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {producto.codigo_barras}
                          </code>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link
                            to={`/productos/editar/${producto.id_producto}`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteClick(producto.id_producto!)
                            }
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este producto? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
