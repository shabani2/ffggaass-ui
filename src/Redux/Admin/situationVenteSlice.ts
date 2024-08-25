/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'; // Remplacez le chemin par celui où est situé votre axiosInstance
import { AggregateAndSaveParams, FetchSituationsParams, SituationVente, SituationVenteState } from '@/Utils/dataTypes';

// Entity adapter pour normaliser et gérer les collections
const situationVenteAdapter = createEntityAdapter<SituationVente>({
  //@ts-ignore
  selectId: (situation: { _id: EntityId; }) => situation._id,
});

const initialState= situationVenteAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const aggregateAndSaveSituationVente = createAsyncThunk<
  SituationVente[],
  AggregateAndSaveParams,
  { rejectValue: string }
>(
  'situationVente/aggregateAndSave',
  async ({ pointVente, produit, dateStart, dateEnd }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/rvsVenteRoute/aggregate-and-save', {
        pointVente,
        produit,
        dateStart,
        dateEnd,
      });
      return response.data;
    } catch (err) {
      //@ts-ignore
      return rejectWithValue(err.response?.data || 'Erreur inconnue');
    }
  }
);

export const fetchSituations_Vente = createAsyncThunk<
  SituationVente[],
  FetchSituationsParams,
  { rejectValue: string }
>(
  'situationVente/fetchSituations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('stockVente/get-situations', { params });
      return response.data;
    } catch (err) {
        //@ts-ignore
      return rejectWithValue(err.response?.data || 'Erreur inconnue');
    }
  }
);

export const filterSituationsBy_PointVente = createAsyncThunk<
  SituationVente[],
  unknown,
  { rejectValue: unknown }
>(
  'situationVente/filterByPointVente',
  async (pointVenteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stockVente/filter-by-pointVente', {
        params: { pointVenteId },
      });
      return response.data;
    } catch (err) {
        //@ts-ignore
      return rejectWithValue(err.response?.data || 'Erreur inconnue');
    }
  }
);

export const filterSituationsNotBy_PointVente = createAsyncThunk(
  'situationLivraison/filterNotByPointVente',
  async (pointVenteId: unknown, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/stockVente/filter-not-by-pointVente', {
        params: { pointVenteId }
      });
      console.log('data returned=>', response.data);
      return response.data as SituationVente[];
    } catch (err) {
      // @ts-ignore
      return rejectWithValue(err.response?.data || 'An error occurred');
    }
  }
);

export const filterSituationsByProduit = createAsyncThunk<
  SituationVente[],
  string,
  { rejectValue: string }
>(
  'situationVente/filterByProduit',
  async (produit, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('stockVente/filter-by-produit', {
        params: { produit },
      });
      return response.data;
    } catch (err) {
        //@ts-ignore
      return rejectWithValue(err.response?.data || 'Erreur inconnue');
    }
  }
);




const situationVenteSlice = createSlice({
  name: 'situationVente',
  initialState,
  reducers: {
    // Vous pouvez ajouter ici des reducers synchrones si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(aggregateAndSaveSituationVente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(aggregateAndSaveSituationVente.fulfilled, (state, action) => {
        state.status = 'succeeded';
        situationVenteAdapter.upsertMany(state, action.payload);
      })
      .addCase(aggregateAndSaveSituationVente.rejected, (state, action) => {
        state.status = 'failed';
          //@ts-ignore
        state.error = action.payload as string;
      })

      .addCase(fetchSituations_Vente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSituations_Vente.fulfilled, (state, action) => {
        state.status = 'succeeded';
        situationVenteAdapter.setAll(state, action.payload);
      })
      .addCase(fetchSituations_Vente.rejected, (state, action) => {
        state.status = 'failed';
          //@ts-ignore
        state.error = action.payload as string;
      })

      .addCase(filterSituationsBy_PointVente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsBy_PointVente.fulfilled, (state, action) => {
        state.status = 'succeeded';
        situationVenteAdapter.setAll(state, action.payload);
      })
      .addCase(filterSituationsBy_PointVente.rejected, (state, action) => {
        state.status = 'failed';
          //@ts-ignore
        state.error = action.payload as string;
      })

      .addCase(filterSituationsByProduit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsByProduit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        situationVenteAdapter.setAll(state, action.payload);
      })
      .addCase(filterSituationsByProduit.rejected, (state, action) => {
        state.status = 'failed';
          //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(filterSituationsNotBy_PointVente.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterSituationsNotBy_PointVente.fulfilled, (state, action) => {
        state.status = 'succeeded';
        situationVenteAdapter.setAll(state, action.payload);
      })
      .addCase(filterSituationsNotBy_PointVente.rejected, (state, action) => {
        state.status = 'failed';
          //@ts-ignore
        state.error = action.payload as string;
      });
  },
});

export const {
  selectAll: selectAllSituationsVente,
  selectById: selectSituationVenteById,
  selectIds: selectSituationVenteIds,
} = situationVenteAdapter.getSelectors((state: { situationVente: SituationVenteState }) => state.situationVente);

export default situationVenteSlice.reducer;

