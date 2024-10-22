/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'; // Assurez-vous que cette instance Axios est configurée

// Modèle de données pour StockLocal
export interface StockLocal {
 
  produit: string;
  quantite: number;
  // pointVente: string;
  // createdAt: string;
  // updatedAt: string;
}

// Adaptateur pour les opérations CRUD sur StockLocal
//@ts-ignore
const stockLocalAdapter = createEntityAdapter<StockLocal>({
    //@ts-ignore
  selectId: (stockLocal) => stockLocal._id,
});

// Thunks pour les opérations asynchrones
export const fetchAllStockLocals = createAsyncThunk('stockLocal/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/stockLocal');
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchStockLocalById = createAsyncThunk('stockLocal/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/stockLocal/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const createStockLocal = createAsyncThunk('stockLocal/create', async (newStockLocal: Partial<StockLocal>, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/stockLocal', newStockLocal);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateStockLocal = createAsyncThunk('stockLocal/update', async ({ id, updates }: { id: string, updates: Partial<StockLocal> }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/stockLocal/${id}`, updates);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteStockLocal = createAsyncThunk('stockLocal/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/stockLocal/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchStockLocalsByProduit = createAsyncThunk('stockLocal/fetchByProduit', async (produitId: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/stockLocal/filter-by-produit/${produitId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// État initial du slice
const initialState = stockLocalAdapter.getInitialState({
  loading: false,
  error: null as string | null,
});

// Slice Redux Toolkit pour StockLocal
const stockLocalSlice = createSlice({
  name: 'stockLocal',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStockLocals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStockLocals.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllStockLocals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockLocalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockLocalById.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.setOne(state, action.payload);
      })
      .addCase(fetchStockLocalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStockLocal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStockLocal.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.addOne(state, action.payload);
      })
      .addCase(createStockLocal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStockLocal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStockLocal.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
      })
      .addCase(updateStockLocal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStockLocal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStockLocal.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteStockLocal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockLocalsByProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockLocalsByProduit.fulfilled, (state, action) => {
        state.loading = false;
        stockLocalAdapter.setAll(state, action.payload);
      })
      .addCase(fetchStockLocalsByProduit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Sélecteurs pour accéder aux données de StockLocal dans le store Redux
export const {
  selectAll: selectAllStockLocals,
  selectById: selectStockLocalById,
} = stockLocalAdapter.getSelectors((state: any) => state.stockLocal);

// Exportation du reducer pour l'intégration dans le store Redux
export default stockLocalSlice.reducer;
