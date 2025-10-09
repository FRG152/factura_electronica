import {
  createProductoSchema,
  updateProductoSchema,
  type CreateProductoFormData,
  type UpdateProductoFormData,
} from "../schemas/productos";

import {
  clearError,
  createProducto,
  updateProducto,
  fetchProductoPorId,
  clearProductoActual,
} from "../store/slices/productosSlice";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useForm } from "react-hook-form";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";

import { AlertTriangle, Save, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function ProductoForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { productoActual, isLoading, isCreating, isUpdating, error } =
    useAppSelector((state) => state.productos);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateProductoFormData | UpdateProductoFormData>({
    resolver: zodResolver(
      isEditing ? updateProductoSchema : createProductoSchema
    ),
    defaultValues: {
      nombre: "",
      descripcion: "",
      unidad_medida: "Unidad",
      iva: 19,
      precio_compra: 0,
      precio_venta1: 0,
      stock_minimo: 0,
      // controla_stock: 1,
      // venta_granel: 0,
      equivalencia_granel: 1,
    },
  });

  // const ventaGranel = watch("venta_granel");
  // const controlaStock = watch("controla_stock");

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchProductoPorId(parseInt(id)));
    }

    return () => {
      dispatch(clearProductoActual());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (productoActual && isEditing) {
      reset({
        nombre: productoActual.nombre,
        codigo_barras: productoActual.codigo_barras || "",
        descripcion: productoActual.descripcion || "",
        unidad_medida: productoActual.unidad_medida || "Unidad",
        iva: productoActual.iva,
        precio_compra: productoActual.precio_compra,
        precio_compra_promedio: productoActual.precio_compra_promedio,
        precio_venta1: productoActual.precio_venta1,
        precio_venta2: productoActual.precio_venta2,
        precio_venta3: productoActual.precio_venta3,
        precio_minimo: productoActual.precio_minimo,
        // venta_granel: productoActual.venta_granel || 0,
        precio_granel: productoActual.precio_granel,
        unidad_granel: productoActual.unidad_granel || "",
        equivalencia_granel: productoActual.equivalencia_granel || 1,
        stock_minimo: productoActual.stock_minimo || 0,
        // controla_stock: productoActual.controla_stock || 1,
        imagen1: productoActual.imagen1 || "",
        imagen2: productoActual.imagen2 || "",
      });
    }
  }, [productoActual, reset, isEditing]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (
    data: CreateProductoFormData | UpdateProductoFormData
  ) => {
    console.log("data:", data);
    try {
      if (isEditing && id) {
        await dispatch(
          updateProducto({
            id: parseInt(id),
            producto: data as UpdateProductoFormData,
          })
        ).unwrap();
      } else {
        await dispatch(createProducto(data as CreateProductoFormData)).unwrap();
      }
      navigate("/productos");
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/productos")}>
          <ArrowLeft className="h-4 w-4 " />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h1>
      </div>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  {...register("nombre")}
                  placeholder="Nombre del producto"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_barras">Código de Barras</Label>
                <Input
                  id="codigo_barras"
                  {...register("codigo_barras")}
                  placeholder="Código de barras"
                />
                {errors.codigo_barras && (
                  <p className="text-sm text-red-600">
                    {errors.codigo_barras.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                {...register("descripcion")}
                placeholder="Descripción del producto"
              />
              {errors.descripcion && (
                <p className="text-sm text-red-600">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                <Input
                  id="unidad_medida"
                  {...register("unidad_medida")}
                  placeholder="Unidad, Kilo, Litro, etc."
                />
                {errors.unidad_medida && (
                  <p className="text-sm text-red-600">
                    {errors.unidad_medida.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iva">IVA (%) *</Label>
                <Input
                  id="iva"
                  type="number"
                  min="0"
                  max="100"
                  {...register("iva", { valueAsNumber: true })}
                  placeholder="19"
                />
                {errors.iva && (
                  <p className="text-sm text-red-600">{errors.iva.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Precios */}
        <Card>
          <CardHeader>
            <CardTitle>Precios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio_compra">Precio de Compra *</Label>
                <Input
                  id="precio_compra"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("precio_compra", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precio_compra && (
                  <p className="text-sm text-red-600">
                    {errors.precio_compra.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_venta1">Precio de Venta 1 *</Label>
                <Input
                  id="precio_venta1"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("precio_venta1", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precio_venta1 && (
                  <p className="text-sm text-red-600">
                    {errors.precio_venta1.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio_venta2">Precio de Venta 2</Label>
                <Input
                  id="precio_venta2"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("precio_venta2", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precio_venta2 && (
                  <p className="text-sm text-red-600">
                    {errors.precio_venta2.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_venta3">Precio de Venta 3</Label>
                <Input
                  id="precio_venta3"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("precio_venta3", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precio_venta3 && (
                  <p className="text-sm text-red-600">
                    {errors.precio_venta3.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_minimo">Precio Mínimo</Label>
                <Input
                  id="precio_minimo"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("precio_minimo", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.precio_minimo && (
                  <p className="text-sm text-red-600">
                    {errors.precio_minimo.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venta a Granel */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Venta a Granel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="venta_granel"
                {...register("venta_granel", { valueAsNumber: true })}
                className="rounded"
              />
              <Label htmlFor="venta_granel">Se vende a granel</Label>
            </div>

            {ventaGranel === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio_granel">Precio a Granel</Label>
                  <Input
                    id="precio_granel"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("precio_granel", { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  {errors.precio_granel && (
                    <p className="text-sm text-red-600">
                      {errors.precio_granel.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidad_granel">Unidad a Granel</Label>
                  <Input
                    id="unidad_granel"
                    {...register("unidad_granel")}
                    placeholder="Gramo, Litro, etc."
                  />
                  {errors.unidad_granel && (
                    <p className="text-sm text-red-600">
                      {errors.unidad_granel.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equivalencia_granel">Equivalencia</Label>
                  <Input
                    id="equivalencia_granel"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("equivalencia_granel", {
                      valueAsNumber: true,
                    })}
                    placeholder="1000"
                  />
                  {errors.equivalencia_granel && (
                    <p className="text-sm text-red-600">
                      {errors.equivalencia_granel.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Control de Stock */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Control de Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="controla_stock"
                {...register("controla_stock", { valueAsNumber: true })}
                className="rounded"
                defaultChecked
              />
              <Label htmlFor="controla_stock">Controlar stock</Label>
            </div>

            {controlaStock === 1 && (
              <div className="space-y-2">
                <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                <Input
                  id="stock_minimo"
                  type="number"
                  min="0"
                  {...register("stock_minimo", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.stock_minimo && (
                  <p className="text-sm text-red-600">
                    {errors.stock_minimo.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Imágenes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imagen1">URL Imagen 1</Label>
                <Input
                  id="imagen1"
                  {...register("imagen1")}
                  placeholder="https://ejemplo.com/imagen1.jpg"
                />
                {errors.imagen1 && (
                  <p className="text-sm text-red-600">
                    {errors.imagen1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen2">URL Imagen 2</Label>
                <Input
                  id="imagen2"
                  {...register("imagen2")}
                  placeholder="https://ejemplo.com/imagen2.jpg"
                />
                {errors.imagen2 && (
                  <p className="text-sm text-red-600">
                    {errors.imagen2.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreating || isUpdating || isLoading}
            className="min-w-[120px]"
          >
            <Save className="h-4 w-4" />
            {isCreating || isUpdating ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
