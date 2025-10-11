/**
 * Redux Slice para gestión de empresas
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  Empresa,
  CrearEmpresaDTO,
  ActualizarEmpresaDTO,
  ListarEmpresasParams,
  PaginacionEmpresas,
} from "../../interfaces/empresas";
import {
  crearEmpresa as crearEmpresaAPI,
  listarEmpresas as listarEmpresasAPI,
  obtenerEmpresaPorId as obtenerEmpresaPorIdAPI,
  actualizarEmpresa as actualizarEmpresaAPI,
  eliminarEmpresa as eliminarEmpresaAPI,
  toggleEmpresaStatus as toggleEmpresaStatusAPI,
} from "../../api/empresas";

// Estado inicial
interface EmpresasState {
  empresas: Empresa[];
  empresaActual: Empresa | null;
  empresaSeleccionada: Empresa | null; // Para usar en el sistema
  paginacion: PaginacionEmpresas | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  searchQuery: string;
  filtros: ListarEmpresasParams;
}

const initialState: EmpresasState = {
  empresas: [],
  empresaActual: null,
  empresaSeleccionada: null,
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
    activo: 1,
  },
};

// Thunks
export const fetchEmpresas = createAsyncThunk(
  "empresas/fetchEmpresas",
  async (params: ListarEmpresasParams = {}, { rejectWithValue }) => {
    try {
      const response = await listarEmpresasAPI(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al obtener empresas"
      );
    }
  }
);

export const fetchEmpresaPorId = createAsyncThunk(
  "empresas/fetchEmpresaPorId",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await obtenerEmpresaPorIdAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al obtener empresa"
      );
    }
  }
);

export const searchEmpresas = createAsyncThunk(
  "empresas/searchEmpresas",
  async (params: ListarEmpresasParams, { rejectWithValue }) => {
    try {
      const response = await listarEmpresasAPI(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al buscar empresas"
      );
    }
  }
);

export const createEmpresa = createAsyncThunk(
  "empresas/createEmpresa",
  async (empresa: CrearEmpresaDTO, { rejectWithValue }) => {
    try {
      const response = await crearEmpresaAPI(empresa);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al crear empresa"
      );
    }
  }
);

export const updateEmpresa = createAsyncThunk(
  "empresas/updateEmpresa",
  async (
    { id, empresa }: { id: number; empresa: ActualizarEmpresaDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await actualizarEmpresaAPI(id, empresa);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al actualizar empresa"
      );
    }
  }
);

export const deleteEmpresa = createAsyncThunk(
  "empresas/deleteEmpresa",
  async (id: number, { rejectWithValue }) => {
    try {
      await eliminarEmpresaAPI(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Error al eliminar empresa"
      );
    }
  }
);

export const toggleEmpresaStatus = createAsyncThunk(
  "empresas/toggleStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await toggleEmpresaStatusAPI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Error al cambiar estado de empresa"
      );
    }
  }
);

// Slice
const empresasSlice = createSlice({
  name: "empresas",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFiltros: (state, action: PayloadAction<ListarEmpresasParams>) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    setEmpresaSeleccionada: (state, action: PayloadAction<Empresa | null>) => {
      state.empresaSeleccionada = action.payload;
      if (action.payload) {
        localStorage.setItem("empresa_id", action.payload.id.toString());
      } else {
        localStorage.removeItem("empresa_id");
      }
    },
    clearEmpresaActual: (state) => {
      state.empresaActual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch empresas
    builder
      .addCase(fetchEmpresas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmpresas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.empresas = action.payload.data;
        state.paginacion = action.payload.pagination;
      })
      .addCase(fetchEmpresas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch empresa por ID
    builder
      .addCase(fetchEmpresaPorId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaPorId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.empresaActual = action.payload;
      })
      .addCase(fetchEmpresaPorId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search empresas
    builder
      .addCase(searchEmpresas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchEmpresas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.empresas = action.payload.data;
        state.paginacion = action.payload.pagination;
      })
      .addCase(searchEmpresas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create empresa
    builder
      .addCase(createEmpresa.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createEmpresa.fulfilled, (state, action) => {
        state.isCreating = false;
        state.empresas.unshift(action.payload);
      })
      .addCase(createEmpresa.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update empresa
    builder
      .addCase(updateEmpresa.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEmpresa.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.empresas.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.empresas[index] = action.payload;
        }
        if (state.empresaActual?.id === action.payload.id) {
          state.empresaActual = action.payload;
        }
        if (state.empresaSeleccionada?.id === action.payload.id) {
          state.empresaSeleccionada = action.payload;
        }
      })
      .addCase(updateEmpresa.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete empresa
    builder
      .addCase(deleteEmpresa.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteEmpresa.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.empresas = state.empresas.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEmpresa.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Toggle status
    builder
      .addCase(toggleEmpresaStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(toggleEmpresaStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.empresas.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.empresas[index] = action.payload;
        }
      })
      .addCase(toggleEmpresaStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setFiltros,
  setEmpresaSeleccionada,
  clearEmpresaActual,
  clearError,
} = empresasSlice.actions;

export default empresasSlice.reducer;
