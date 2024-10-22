/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { Commande } from '@/Utils/dataTypes';

// Créer un adaptateur d'entité pour les commandes
const commandeAdapter = createEntityAdapter<Commande>();

// Thunks pour les opérations CRUD
export const fetchCommandes = createAsyncThunk('commande/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/commande');
    return response.data.map((c: { _id: unknown }) => ({
      id: c._id,
      ...c,
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addCommande = createAsyncThunk('commande/add', async (newCommande: Omit<Commande, 'id'>, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/commande', newCommande);
    const c = response.data;
    return { id: c._id, ...c };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateCommande = createAsyncThunk('commande/update', async ({ id, commande }: { id: string; commande: Partial<Omit<Commande, 'id'>> }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/commande/${id}`, commande);
    const c = response.data;
    return { id: c._id, ...c };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteCommande = createAsyncThunk('commande/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/commande/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Thunks pour la recherche
export const searchCommandesByProduit = createAsyncThunk(
  'commande/searchByProduit',
  async (produitQuery: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/commande/search-by-produit', {
        params: { produitQuery },
      });
      return response.data.map((c: { _id: unknown }) => ({
        id: c._id,
        ...c,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchCommandesByClient = createAsyncThunk(
  'commande/searchByClient',
  async (clientQuery: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/commande/search-by-client', {
        params: { clientQuery },
      });
      return response.data.map((c: { _id: unknown }) => ({
        id: c._id,
        ...c,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = commandeAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
});

const commandeSlice = createSlice({
  name: 'commande',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommandes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommandes.fulfilled, (state, action) => {
        state.loading = false;
        commandeAdapter.setAll(state, action.payload);
        state.total = action.payload.length;
      })
      .addCase(fetchCommandes.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(addCommande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommande.fulfilled, (state, action) => {
        state.loading = false;
        commandeAdapter.addOne(state, action.payload);
      })
      .addCase(addCommande.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(updateCommande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommande.fulfilled, (state, action) => {
        state.loading = false;
        commandeAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCommande.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(deleteCommande.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommande.fulfilled, (state, action) => {
        state.loading = false;
        //@ts-ignore
        commandeAdapter.removeOne(state, action.payload as EntityId);
      })
      .addCase(deleteCommande.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(searchCommandesByProduit.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCommandesByProduit.fulfilled, (state, action) => {
        state.loading = false;
        commandeAdapter.setAll(state, action.payload);
      })
      .addCase(searchCommandesByProduit.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload;
      })
      .addCase(searchCommandesByClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchCommandesByClient.fulfilled, (state, action) => {
        state.loading = false;
        commandeAdapter.setAll(state, action.payload);
      })
      .addCase(searchCommandesByClient.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload;
      });
  },
});

export default commandeSlice.reducer;
export const { selectAll: selectAllCommandes, selectById: selectCommandeById } = commandeAdapter.getSelectors((state: any) => state.commande);
export const selectTotalCommandes = (state: { commande: { total: number; }; }) => state.commande.total;
