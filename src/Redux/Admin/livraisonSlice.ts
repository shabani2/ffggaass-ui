/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { Livraison } from '@/Utils/dataTypes'; // Assurez-vous que l'interface Livraison est définie correctement




const livraisonAdapter = createEntityAdapter<Livraison>(
  {
    //@ts-ignore
    selectId: (instance: { _id: EntityId; }) => instance._id,
  }
);

// Thunks for CRUD operations
export const fetchLivraisons = createAsyncThunk('livraison/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/livraison');
    return response.data.map((l: { _id: unknown }) => ({
      id: l._id,
      ...l,
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addLivraison = createAsyncThunk('livraison/add', async (newLivraison: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/livraison', newLivraison);
    const l = response.data;
    return { id: l._id, ...l };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateLivraison = createAsyncThunk('livraison/update', async ({ id, livraison }: { id: unknown, livraison: unknown}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/livraison/${id}`, livraison);
    const l = response.data;
    return { id: l._id, ...l };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteLivraison = createAsyncThunk('livraison/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/livraison/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Additional Thunks for Filtered Fetches
export const fetchFilteredLivraisons = createAsyncThunk(
  'livraison/fetchFiltered',
  async ({ produitId, pointVenteId, startDate, endDate }: { produitId?: string; pointVenteId?: string; startDate?: string; endDate?: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/livraison/filter', {
        params: { produitId, pointVenteId, startDate, endDate },
      });
      return response.data.map((l: { _id: unknown }) => ({
        id: l._id,
        ...l,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Search Operations
export const searchLivraisonsByProduit = createAsyncThunk(
  'livraison/searchByProduit',
  async (produitId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/livraison/search/produit', {
        params: { produitId },
      });
      return response.data.map((l: { _id: unknown }) => ({
        id: l._id,
        ...l,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchLivraisonsByPointVente = createAsyncThunk(
  'livraison/searchByPointVente',
  async (pointVenteQuery: unknown, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/livraison/search-by-pointVente', {
        params: { pointVenteQuery },
      });
      return response.data.map((l: { _id: unknown }) => ({
        id: l._id,
        ...l,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Exportation des données
export const exportLivraison = createAsyncThunk('livraison/export', async (format: 'csv' | 'xlsx') => {
  const response = await axiosInstance.get(`/file/livraison/export?format=${format}`, {
    responseType: 'blob', // Important pour les téléchargements de fichiers
  });
  return response.data;
});

// Importation des données
export const importLivraison = createAsyncThunk('livraison/import', async (file: File, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/file/livraison/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.map((l: { _id: unknown }) => ({
      id: l._id,
      ...l,
    }));
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = livraisonAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
});

const livraisonSlice = createSlice({
  name: 'livraison',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLivraisons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLivraisons.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.setAll(state, action.payload);
        state.total = action.payload.length; // Assuming payload is an array
      })
      .addCase(fetchLivraisons.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(addLivraison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLivraison.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.addOne(state, action.payload);
      })
      .addCase(addLivraison.rejected, (state, action) => {
          //@ts-ignore
        state.loading = false;
          //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(updateLivraison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLivraison.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateLivraison.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(deleteLivraison.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLivraison.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.removeOne(state, action.payload as EntityId);
      })
      .addCase(deleteLivraison.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(fetchFilteredLivraisons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredLivraisons.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilteredLivraisons.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.payload;
      })
      .addCase(searchLivraisonsByProduit.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchLivraisonsByProduit.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.setAll(state, action.payload);
      })
      .addCase(searchLivraisonsByProduit.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.payload;
      })
      .addCase(searchLivraisonsByPointVente.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchLivraisonsByPointVente.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.setAll(state, action.payload);
      })
      .addCase(searchLivraisonsByPointVente.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.payload;
      })
      .addCase(exportLivraison.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportLivraison.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportLivraison.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.error.message;
      })
      .addCase(importLivraison.pending, (state) => {
        state.loading = true;
      })
      .addCase(importLivraison.fulfilled, (state, action) => {
        state.loading = false;
        livraisonAdapter.setAll(state, action.payload);
      })
      .addCase(importLivraison.rejected, (state, action) => {
        state.loading = false;
          //@ts-ignore
        state.error = action.error.message;
      });
  },
});
//@ts-ignore
export default livraisonSlice.reducer;
//@ts-ignore
export const { selectAll: selectAllLivraisons, selectById: selectLivraisonById } = livraisonAdapter.getSelectors((state: any) => state.livraison);
export const selectTotalLivraisons = (state: { livraison: { total: any; }; }) => state.livraison.total;
