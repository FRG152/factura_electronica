import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  crearProducto,
  listarProductos,
  buscarProductos,
  obtenerProductoPorId,
  buscarProductoPorCodigoBarras,
  obtenerProductosBajoStock,
  actualizarProducto,
  eliminarProducto,
} from "../../api/productos";
import type {
  Producto,
  CreateProductoDto,
  UpdateProductoDto,
  BuscarProductosParams,
} from "../../interfaces/productos";

interface ProductosState {
  productos: Producto[];
  productoActual: Producto | null;
  productosBajoStock: Producto[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: ProductosState = {
  productos: [],
  productoActual: null,
  productosBajoStock: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchQuery: "",
};

// Async thunks
export const fetchProductos = createAsyncThunk(
  "productos/fetchProductos",
  async (_, { rejectWithValue }) => {
    try {
      const productos = await listarProductos();
      return productos;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar productos";
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchProductos = createAsyncThunk(
  "productos/searchProductos",
  async (params: BuscarProductosParams, { rejectWithValue }) => {
    try {
      const productos = await buscarProductos(params);
      return { productos, query: params.search || "" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al buscar productos";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProductoPorId = createAsyncThunk(
  "productos/fetchProductoPorId",
  async (id: number, { rejectWithValue }) => {
    try {
      const producto = await obtenerProductoPorId(id);
      return producto;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al obtener producto";
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchProductoPorCodigoBarras = createAsyncThunk(
  "productos/searchProductoPorCodigoBarras",
  async (codigo: string, { rejectWithValue }) => {
    try {
      const producto = await buscarProductoPorCodigoBarras(codigo);
      return producto;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Producto no encontrado";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProductosBajoStock = createAsyncThunk(
  "productos/fetchProductosBajoStock",
  async (_, { rejectWithValue }) => {
    try {
      const productos = await obtenerProductosBajoStock();
      return productos;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cargar productos con bajo stock";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProducto = createAsyncThunk(
  "productos/createProducto",
  async (producto: CreateProductoDto, { rejectWithValue }) => {
    try {
      const nuevoProducto = await crearProducto(producto);
      return nuevoProducto;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear producto";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProducto = createAsyncThunk(
  "productos/updateProducto",
  async (
    { id, producto }: { id: number; producto: UpdateProductoDto },
    { rejectWithValue }
  ) => {
    try {
      const productoActualizado = await actualizarProducto(id, producto);
      return productoActualizado;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al actualizar producto";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProducto = createAsyncThunk(
  "productos/deleteProducto",
  async (id: number, { rejectWithValue }) => {
    try {
      await eliminarProducto(id);
      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar producto";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const productosSlice = createSlice({
  name: "productos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearProductoActual: (state) => {
      state.productoActual = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch productos
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductos.fulfilled,
        (state, action: PayloadAction<Producto[]>) => {
          state.isLoading = false;
          state.productos = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProductos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search productos
    builder
      .addCase(searchProductos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        searchProductos.fulfilled,
        (
          state,
          action: PayloadAction<{ productos: Producto[]; query: string }>
        ) => {
          state.isLoading = false;
          state.productos = action.payload.productos;
          state.searchQuery = action.payload.query;
          state.error = null;
        }
      )
      .addCase(searchProductos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch producto por ID
    builder
      .addCase(fetchProductoPorId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductoPorId.fulfilled,
        (state, action: PayloadAction<Producto>) => {
          state.isLoading = false;
          state.productoActual = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProductoPorId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search producto por código de barras
    builder
      .addCase(searchProductoPorCodigoBarras.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        searchProductoPorCodigoBarras.fulfilled,
        (state, action: PayloadAction<Producto>) => {
          state.isLoading = false;
          state.productoActual = action.payload;
          state.error = null;
        }
      )
      .addCase(searchProductoPorCodigoBarras.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch productos bajo stock
    builder
      .addCase(fetchProductosBajoStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProductosBajoStock.fulfilled,
        (state, action: PayloadAction<Producto[]>) => {
          state.isLoading = false;
          state.productosBajoStock = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProductosBajoStock.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create producto
    builder
      .addCase(createProducto.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        createProducto.fulfilled,
        (state, action: PayloadAction<Producto>) => {
          state.isCreating = false;
          state.productos.unshift(action.payload);
          state.error = null;
        }
      )
      .addCase(createProducto.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update producto
    builder
      .addCase(updateProducto.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateProducto.fulfilled,
        (state, action: PayloadAction<Producto>) => {
          state.isUpdating = false;
          const index = state.productos.findIndex(
            (p) => p.id_producto === action.payload.id_producto
          );
          if (index !== -1) {
            state.productos[index] = action.payload;
          }
          if (
            state.productoActual?.id_producto === action.payload.id_producto
          ) {
            state.productoActual = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateProducto.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete producto
    builder
      .addCase(deleteProducto.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(
        deleteProducto.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isDeleting = false;
          state.productos = state.productos.filter(
            (p) => p.id_producto !== action.payload
          );
          if (state.productoActual?.id_producto === action.payload) {
            state.productoActual = null;
          }
          state.error = null;
        }
      )
      .addCase(deleteProducto.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSearchQuery, clearProductoActual } =
  productosSlice.actions;
export default productosSlice.reducer;
