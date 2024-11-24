/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
//import { RootState } from '../Store';


export interface Category {
    id : EntityId
    _id: string;
    nom: string;
  }
  
  export interface Produit1 {
    id: EntityId;
    _id: string;
    nom: string;
    prix: number;
    prixVente:number
    category: Category;
    createdAt: string;
    updatedAt: string;
  }

export interface ProduitsState {
  loading: boolean;
  error: string | null;
}

const produitAdapter = createEntityAdapter<Produit1>();

const initialState = produitAdapter.getInitialState<ProduitsState>({
  loading: false,
  error: null,
});

// Thunks for CRUD operations
export const fetchProduits = createAsyncThunk('produits/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/produit');
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addProduit = createAsyncThunk('produits/add', async (newProduit: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/produit', newProduit);
    const addedProduit = response.data;
    return {
      id: addedProduit._id,
      ...addedProduit
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateProduit = createAsyncThunk('produits/update', async ({ id, produit }: { id: unknown, produit: unknown }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/produit/${id}`, produit);
    const updatedProduit = response.data;
    return {
      id: updatedProduit._id,
      ...updatedProduit
    };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteProduit = createAsyncThunk('produits/delete', async (produitId: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/produit/${produitId}`);
    return produitId;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});


//code pour import export de fichier vers excel ou csv

export const exportProduit = createAsyncThunk('produit/export', async (format: 'csv' | 'xlsx') => {
  const response = await axiosInstance.get(`/produit/export?format=${format}`, {
    responseType: 'blob', // Important for file downloads
  });
  return response.data;
});

//code pour l'importation
export const importProduit = createAsyncThunk('produit/import', async (file: File,{ rejectWithValue }) => {
  try{
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post('/produit/import', formData, {
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

const produitSlice = createSlice({
  name: 'produits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduits.fulfilled, (state, action: PayloadAction<Produit1[]>) => {
        state.loading = false;
        produitAdapter.setAll(state, action.payload);
      })
      //@ts-ignore
      .addCase(fetchProduits.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduit.fulfilled, (state, action: PayloadAction<Produit1>) => {
        state.loading = false;
        produitAdapter.addOne(state, action.payload);
      })
      //@ts-ignore
      .addCase(addProduit.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduit.fulfilled, (state, action: PayloadAction<Produit1>) => {
        state.loading = false;
        produitAdapter.upsertOne(state, action.payload);
      })
      //@ts-ignore
      .addCase(updateProduit.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduit.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        produitAdapter.removeOne(state, action.payload);
      })
      //@ts-ignore
      .addCase(deleteProduit.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(exportProduit.pending, (state) => {
        state.loading = true;
      })
      .addCase(exportProduit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportProduit.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.error.message;
      })
      .addCase(importProduit.pending, (state) => {
        state.loading = true;
      })
      .addCase(importProduit.fulfilled, (state, action) => {
        state.loading = false;
        produitAdapter.setAll(state, action.payload);
      })
      .addCase(importProduit.rejected, (state, action) => {
        state.loading = false;
        //@ts-ignore
        state.error = action.error.message;
      });
  },
});

export default produitSlice.reducer;
export const { selectAll: selectAllProduits } = produitAdapter.getSelectors((state: any) => state.produits);
