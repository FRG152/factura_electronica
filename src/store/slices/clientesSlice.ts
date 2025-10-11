/**
 * Redux Slice para gestión de clientes
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  Cliente,
  CrearClienteDTO,
  ActualizarClienteDTO,
  ListarClientesParams,
  PaginacionClientes,
} from "../../interfaces/clientes";
import {
  crearCliente as crearClienteAPI,
  listarClientes as listarClientesAPI,
  obtenerClientePorId as obtenerClientePorIdAPI,
  actualizarCliente as actualizarClienteAPI,
  eliminarCliente as eliminarClienteAPI,
  restaurarCliente as restaurarClienteAPI,
  listarClientesPorEmpresa as listarClientesPorEmpresaAPI,
} from "../../api/clientes";

// Estado inicial
interface ClientesState {
  clientes: Cliente[];
  clienteActual: Cliente | null;
  paginacion: PaginacionClientes | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchQuery: string;
  filtros: ListarClientesParams;
}

const initialState: ClientesState = {
  clientes: [],
  clienteActual: null,
  paginacion: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchQuery: "",
  filtros: {
    page: 1,
    limit: 10,
    eliminado: 0,
  },
};

// Thunks
export const fetchClientes = createAsyncThunk(
  "clientes/fetchClientes",
  async (params: ListarClientesParams = {}, { rejectWithValue }) => {
    try {
      const response = await listarClientesAPI(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al obtener clientes"
      );
    }
  }
);

export const fetchClientePorId = createAsyncThunk(
  "clientes/fetchClientePorId",
  async (
    { id, empresa_id }: { id: number; empresa_id?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await obtenerClientePorIdAPI(id, empresa_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al obtener cliente"
      );
    }
  }
);

export const searchClientes = createAsyncThunk(
  "clientes/searchClientes",
  async (params: ListarClientesParams, { rejectWithValue }) => {
    try {
      const response = await listarClientesAPI(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al buscar clientes"
      );
    }
  }
);

export const createCliente = createAsyncThunk(
  "clientes/createCliente",
  async (cliente: CrearClienteDTO, { rejectWithValue }) => {
    try {
      const response = await crearClienteAPI(cliente);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al crear cliente"
      );
    }
  }
);

export const updateCliente = createAsyncThunk(
  "clientes/updateCliente",
  async (
    {
      id,
      cliente,
      empresa_id,
    }: {
      id: number;
      cliente: ActualizarClienteDTO;
      empresa_id?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await actualizarClienteAPI(id, cliente, empresa_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al actualizar cliente"
      );
    }
  }
);

export const deleteCliente = createAsyncThunk(
  "clientes/deleteCliente",
  async (
    { id, empresa_id }: { id: number; empresa_id?: number },
    { rejectWithValue }
  ) => {
    try {
      await eliminarClienteAPI(id, empresa_id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al eliminar cliente"
      );
    }
  }
);

export const restoreCliente = createAsyncThunk(
  "clientes/restoreCliente",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await restaurarClienteAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al restaurar cliente"
      );
    }
  }
);

export const fetchClientesPorEmpresa = createAsyncThunk(
  "clientes/fetchClientesPorEmpresa",
  async (empresa_id: number, { rejectWithValue }) => {
    try {
      const response = await listarClientesPorEmpresaAPI(empresa_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Error al obtener clientes por empresa"
      );
    }
  }
);

// Slice
const clientesSlice = createSlice({
  name: "clientes",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFiltros: (state, action: PayloadAction<ListarClientesParams>) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    clearClienteActual: (state) => {
      state.clienteActual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch clientes
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes = action.payload.data;
        state.paginacion = action.payload.pagination;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch cliente por ID
    builder
      .addCase(fetchClientePorId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientePorId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clienteActual = action.payload;
      })
      .addCase(fetchClientePorId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search clientes
    builder
      .addCase(searchClientes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchClientes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes = action.payload.data;
        state.paginacion = action.payload.pagination;
      })
      .addCase(searchClientes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create cliente
    builder
      .addCase(createCliente.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCliente.fulfilled, (state, action) => {
        state.isCreating = false;
        state.clientes.unshift(action.payload);
      })
      .addCase(createCliente.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update cliente
    builder
      .addCase(updateCliente.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCliente.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.clientes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
        if (state.clienteActual?.id === action.payload.id) {
          state.clienteActual = action.payload;
        }
      })
      .addCase(updateCliente.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete cliente
    builder
      .addCase(deleteCliente.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.isDeleting = false;
        // Marcar como eliminado en lugar de remover
        const index = state.clientes.findIndex((c) => c.id === action.payload);
        if (index !== -1) {
          state.clientes[index].eliminado = 1;
        }
      })
      .addCase(deleteCliente.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Restore cliente
    builder
      .addCase(restoreCliente.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(restoreCliente.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.clientes.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
      })
      .addCase(restoreCliente.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Fetch clientes por empresa
    builder
      .addCase(fetchClientesPorEmpresa.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClientesPorEmpresa.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientes = action.payload;
      })
      .addCase(fetchClientesPorEmpresa.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setFiltros, clearClienteActual, clearError } =
  clientesSlice.actions;

export default clientesSlice.reducer;

