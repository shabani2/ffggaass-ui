/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
//import { RootState } from '../Store';
import { MvtStock } from '@/Utils/dataTypes';

const mvtStockAdapter = createEntityAdapter<MvtStock>();

// Thunks for CRUD operations
export const fetchMvtStocks = createAsyncThunk('mvtStock/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/mvtstock');
    return response.data.map((ms: { _id: unknown }) => ({
      id: ms._id,
      ...ms,
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addMvtStock = createAsyncThunk('mvtStock/add', async (newMvtStock: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/mvtstock', newMvtStock);
    const ms = response.data;
    return { id: ms._id, ...ms };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateMvtStock = createAsyncThunk('mvtStock/update', async ({ id, mvtStock }: { id: unknown, mvtStock: unknown}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/mvtstock/${id}`, mvtStock);
    const ms = response.data;
    return { id: ms._id, ...ms };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteMvtStock = createAsyncThunk('mvtStock/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/mvtstock/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

/********************* API POUR VENDEUR */

export const fetchFilteredMvtStocks = createAsyncThunk(
  'mvtStocks/fetchFiltered',
  async ({ operation, pointVenteNom }: { operation?: string; pointVenteNom?: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/mvtStock/operation/filter', {
        params: { operation, pointVenteNom },
      });
      // return response.data;
      return response.data.map((ms: { _id: unknown }) => ({
        id: ms._id,
        ...ms,
      }));
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const fetchVendeurdMvtStocks = createAsyncThunk(
  'mvtStocks/fetchFiltered',
  async ({ operation, pointVenteId }: { operation?: string; pointVenteId?: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/mvtStock/operation/filter', {
        params: { operation, pointVenteId },
      });
      // return response.data;
      return response.data.map((ms: { _id: unknown }) => ({
        id: ms._id,
        ...ms,
      }));
      //@ts-ignore
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);



//code pour import export de fichier vers excel ou csv

export const exportMvtStock = createAsyncThunk('mvtStock/export', async (format: 'csv' | 'xlsx') => {
  const response = await axiosInstance.get(`/file/mvtstock/export?format=${format}`, {
    responseType: 'blob', // Important for file downloads
  });
  return response.data;
});

//code pour l'importation
export const importMvtStock = createAsyncThunk('mvtStock/import', async (file: File,{ rejectWithValue }) => {
  try{
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/file/mvtstock/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  //return // Assuming the API returns the imported data
  return response.data.map((ms: { _id: unknown }) => ({
    id: ms._id,
    ...ms,
  }));
} catch (error) {
  //@ts-ignore
  return rejectWithValue(error.response.data);
}
});


const initialState = mvtStockAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
});

const mvtStockSlice = createSlice({
  name: 'mvtStock',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMvtStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMvtStocks.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.setAll(state, action.payload);
        state.total = action.payload.total;
      })
      .addCase(fetchMvtStocks.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(addMvtStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMvtStock.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.addOne(state, action.payload);
      })
      .addCase(addMvtStock.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(updateMvtStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMvtStock.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateMvtStock.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(deleteMvtStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMvtStock.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.removeOne(state, action.payload as EntityId);
      })
      .addCase(deleteMvtStock.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload as string;
      })
      .addCase(fetchFilteredMvtStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilteredMvtStocks.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilteredMvtStocks.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.payload;
      })
      .addCase(exportMvtStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportMvtStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportMvtStock.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.error.message;
      })
      .addCase(importMvtStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(importMvtStock.fulfilled, (state, action) => {
        state.loading = false;
        mvtStockAdapter.setAll(state, action.payload);
      })
      .addCase(importMvtStock.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.error.message;
      });
    
    },
});

export default mvtStockSlice.reducer;
export const { selectAll: selectAllMvtStocks, selectById: selectMvtStockById } = mvtStockAdapter.getSelectors((state: any) => state.mvtStock);
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectTotalMvtStocks = (state: { mvtStock: { total: any; }; }) => state.mvtStock.total;
