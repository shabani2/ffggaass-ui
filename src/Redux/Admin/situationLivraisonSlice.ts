/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'; // Remplacez le chemin par celui où est situé votre axiosInstance
import {SituationLivraison } from '@/Utils/dataTypes'; // Ajustez le chemin en fonction de l'emplacement de vos types

// Entity adapter pour normaliser et gérer les collections
const situationLivraisonAdapter = createEntityAdapter<SituationLivraison>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  selectId: (situation: { _id: EntityId; }) => situation._id, // Assurez-vous que _id est la clé primaire
});

// État initial
export interface SituationLivraisonState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState = situationLivraisonAdapter.getInitialState<SituationLivraisonState>({
  status: 'idle',
  error: null,
});

// Thunks pour les opérations asynchrones

// Thunk pour l'agrégation et l'enregistrement des situations de livraison
export const aggregateAndSaveSituationLivraison = createAsyncThunk(
  'situationLivraison/aggregateAndSave',
  async ({ pointVente, produit, dateStart, dateEnd }: { pointVente: string; produit: string; dateStart: string; dateEnd: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/rvsLivraisonRoute/aggregate-and-save', {
        pointVente,
        produit,
        dateStart,
        dateEnd,
      });
      return response.data as SituationLivraison[];
    } catch (err) {
        //@ts-ignore
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour récupérer les situations de livraison
export const fetchSituationsLivraison = createAsyncThunk(
  'situationLivraison/fetchSituations',
  async (params: { date?: string; produit?: string; pointVente?: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stockLivraison/get-situations', { params });
      return response.data as SituationLivraison[];
    } catch (err) {
         //@ts-ignore
      return rejectWithValue(err.response.data);
    }
  }
);

// Thunk pour filtrer les situations de livraison par point de vente
export const filterSituationsByPointVente = createAsyncThunk(
  'situationLivraison/filterByPointVente',
  async (pointVenteId: unknown, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('stockLivraison/filter-by-pointVente', { params: { pointVenteId } });
      console.log('data returned=>',response.data)
      return response.data as SituationLivraison[];
      
    } catch (err) {
         //@ts-ignore
      return rejectWithValue(err.response.data);
    }
  }
);

export const filterSituationsNotByPointVente = createAsyncThunk(
  'situationLivraison/filterNotByPointVente',
  async (pointVenteId: unknown, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stockLivraison/filter-not-by-pointVente', {
        params: { pointVenteId }
      });
      console.log('data returned=>', response.data);
      console.log(response.data)
      return response.data as SituationLivraison[];
    } catch (err) {
      // @ts-ignore
      return rejectWithValue(err.response?.data || 'An error occurred');
    }
  }
);

// Thunk pour filtrer les situations de livraison par produit
export const filterSituationsByProduit = createAsyncThunk(
  'situationLivraison/filterByProduit',
  async (produit: unknown, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/rvsLivraisonRoute/filter-by-produit', { params: { produit } });
      return response.data as SituationLivraison[];
    } catch (err) {
         //@ts-ignore
      return rejectWithValue(err.response.data);
    }
  }
);

const livraisonSlice = createSlice({
  name: 'situationLivraison',
  initialState,
  reducers: {
    // Vous pouvez ajouter ici des reducers synchrones si nécessaire
  },
  extraReducers: (builder) => {
    builder
      // Cas pour l'agrégation et l'enregistrement
      .addCase(aggregateAndSaveSituationLivraison.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(aggregateAndSaveSituationLivraison.fulfilled, (state, action: PayloadAction<SituationLivraison[]>) => {
        state.status = 'succeeded';
        situationLivraisonAdapter.upsertMany(state, action.payload); // Mise à jour des situations de livraison
      })
      .addCase(aggregateAndSaveSituationLivraison.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Cas pour récupérer les situations de livraison
      .addCase(fetchSituationsLivraison.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSituationsLivraison.fulfilled, (state, action: PayloadAction<SituationLivraison[]>) => {
        state.status = 'succeeded';
        situationLivraisonAdapter.setAll(state, action.payload); // Remplir l'état avec les situations récupérées
      })
      .addCase(fetchSituationsLivraison.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Cas pour filtrer par point de vente
      .addCase(filterSituationsByPointVente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsByPointVente.fulfilled, (state, action: PayloadAction<SituationLivraison[]>) => {
        state.status = 'succeeded';
        situationLivraisonAdapter.setAll(state, action.payload); // Remplir l'état avec les situations filtrées
      })
      .addCase(filterSituationsByPointVente.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Cas pour filtrer par produit
      .addCase(filterSituationsByProduit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsByProduit.fulfilled, (state, action: PayloadAction<SituationLivraison[]>) => {
        state.status = 'succeeded';
        situationLivraisonAdapter.setAll(state, action.payload); // Remplir l'état avec les situations filtrées
      })
      .addCase(filterSituationsByProduit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(filterSituationsNotByPointVente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsNotByPointVente.fulfilled, (state, action: PayloadAction<SituationLivraison[]>) => {
        state.status = 'succeeded';
        situationLivraisonAdapter.setAll(state, action.payload); // Remplir l'état avec les situations filtrées
      })
      .addCase(filterSituationsNotByPointVente.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Sélecteurs pour accéder aux données
export const {
  selectAll: selectAllSituationsLivraison,
  selectById: selectSituationLivraisonById,
  selectIds: selectSituationLivraisonIds,
} = situationLivraisonAdapter.getSelectors((state: { situationLivraison: typeof initialState }) => state.situationLivraison);

export default livraisonSlice.reducer;
