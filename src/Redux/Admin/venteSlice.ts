/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { Vente } from '@/Utils/dataTypes';

// Créer un adaptateur d'entité pour les ventes
const venteAdapter = createEntityAdapter<Vente>({
  //@ts-ignore
  selectId: (instance: { _id: EntityId; }) => instance._id,
});

// Thunks pour les opérations CRUD
export const fetchVentes = createAsyncThunk('vente/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/vente');
    return response.data.map((v: { _id: unknown }) => ({
      id: v._id,
      ...v,
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addVente = createAsyncThunk('vente/add', async (newVente: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/vente', newVente);
    const v = response.data;
    return { id: v._id, ...v };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateVente = createAsyncThunk('vente/update', async ({ id, vente }: { id: unknown, vente: unknown}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/vente/${id}`, vente);
    const v = response.data;
    return { id: v._id, ...v };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteVente = createAsyncThunk('vente/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/vente/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Thunks pour la recherche
export const searchVentes = createAsyncThunk(
  'vente/search',
  async ({ produitId, pointVenteId }: { produitId?: string; pointVenteId?: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/vente/search', {
        params: { produitId, pointVenteId },
      });
      return response.data.map((v: { _id: unknown }) => ({
        id: v._id,
        ...v,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const fetchVentesByPointVente = createAsyncThunk(
  'ventes/fetchByPointVente',
  async (pointVenteQuery: unknown, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/vente/search-by-pointVente', {
        params: {
          pointVenteQuery,
        },
      });

      return response.data;
       //@ts-ignore
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Code pour l'importation et l'exportation de fichiers
export const exportVentes = createAsyncThunk('vente/export', async (format: 'csv' | 'xlsx') => {
  const response = await axiosInstance.get(`/file/vente/export?format=${format}`, {
    responseType: 'blob', // Important pour les téléchargements de fichiers
  });
  return response.data;
});

export const importVentes = createAsyncThunk('vente/import', async (file: File,{ rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/file/vente/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.map((v: { _id: unknown }) => ({
      id: v._id,
      ...v,
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const initialState = venteAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
});

const venteSlice = createSlice({
  name: 'vente',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVentes.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.setAll(state, action.payload);
        state.total = action.payload.length;
      })
      .addCase(fetchVentes.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(addVente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVente.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.addOne(state, action.payload);
      })
      .addCase(addVente.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(updateVente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVente.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateVente.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(deleteVente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVente.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.removeOne(state, action.payload as EntityId);
      })
      .addCase(deleteVente.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(searchVentes.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchVentes.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.setAll(state, action.payload);
      })
      .addCase(searchVentes.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload;
      })
      .addCase(fetchVentesByPointVente.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVentesByPointVente.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.setAll(state, action.payload);
      })
      .addCase(fetchVentesByPointVente.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.payload;
      })
      .addCase(exportVentes.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportVentes.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportVentes.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.error.message;
      })
      .addCase(importVentes.pending, (state) => {
        state.loading = true;
      })
      .addCase(importVentes.fulfilled, (state, action) => {
        state.loading = false;
        venteAdapter.setAll(state, action.payload);
      })
      .addCase(importVentes.rejected, (state, action) => {
        state.loading = false;
         //@ts-ignore
        state.error = action.error.message;
      });
  },
});

export default venteSlice.reducer;
 //@ts-ignore
export const { selectAll: selectAllVentes, selectById: selectVenteById } = venteAdapter.getSelectors((state: any) => state.vente);
export const selectTotalVentes = (state: { vente: { total: number; }; }) => state.vente.total;
