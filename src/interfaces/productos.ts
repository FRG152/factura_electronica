export interface Producto {
  id_producto?: number;
  nombre: string;
  descripcion?: string;
  precio_compra: number;
  precio_compra_promedio?: number;
  precio_venta1: number;
  precio_venta2?: number;
  precio_venta3?: number;
  precio_minimo?: number;
  iva: number;
  unidad_medida?: string;
  venta_granel?: number;
  precio_granel?: number;
  codigo_barras?: string;
  unidad_granel?: string;
  equivalencia_granel?: number;
  stock_minimo?: number;
  controla_stock?: number;
  imagen1?: string;
  imagen2?: string;
  created_at?: string;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion?: string;
  precio_compra: number;
  precio_compra_promedio?: number;
  precio_venta1: number;
  precio_venta2?: number;
  precio_venta3?: number;
  precio_minimo?: number;
  iva: number;
  unidad_medida?: string;
  // venta_granel?: number;
  precio_granel?: number;
  codigo_barras?: string;
  unidad_granel?: string;
  equivalencia_granel?: number;
  stock_minimo?: number;
  // controla_stock?: number;
  imagen1?: string;
  imagen2?: string;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {}

export interface ProductosResponse {
  productos: Producto[];
  total: number;
  page?: number;
  limit?: number;
}

export interface BuscarProductosParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductosBajoStockResponse {
  productos: Producto[];
  total: number;
}
