/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createSlice, createAsyncThunk, createEntityAdapter, EntityId, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'; // Assurez-vous que le chemin est correct
import { General } from '@/Utils/dataTypes'; // Assurez-vous que le chemin est correct

// Interface pour un élément "Generale"
export interface Generale {
    id: string;
    denominationsociale: string;
    numerorccm: string;
    dateimmatriculation: string;
    datedebutexploitation: string;
    origine: string;
    formejuridique: string;
    capitalesociale: number;
    duree: number;
    sigle: string;
    adressedusiege: string;
    secteuractiviteohada: string;
    activiteprincipaleohada: string;
    logoentreprise: string;
}

// Création de l'entityAdapter
//@ts-ignore
const generaleAdapter = createEntityAdapter<General>();

// Initial state de l'adapter
const initialState = generaleAdapter.getInitialState({
  status: 'idle',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
});

// Thunks pour les opérations CRUD

// Récupérer la liste des "Generale"
export const fetchGenerale = createAsyncThunk('generale/fetchGenerale', async () => {
  const response = await axiosInstance.get('/generale');
  return response.data.map((generale: { _id: unknown }) => ({
    id: generale._id,
    ...generale,
  }));
});

// Créer un nouvel élément "Generale"
export const addGenerale = createAsyncThunk('generale/addGenerale', async (newGenerale: FormData) => {
  const response = await axiosInstance.post('/generale', newGenerale, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
});

  

// Mettre à jour un élément "Generale"
export const updateGenerale = createAsyncThunk('generale/updateGenerale', async ({ id, updatedGenerale }: { id: string; updatedGenerale: Generale }) => {
  const response = await axiosInstance.put(`/generale/${id}`, updatedGenerale);
  return response.data;
});

// Supprimer un élément "Generale"
export const deleteGenerale = createAsyncThunk('generale/deleteGenerale', async (id: string) => {
  await axiosInstance.delete(`/generale/${id}`);
  return id;
});

// Slice
const generaleSlice = createSlice({
  name: 'generale',
  initialState,
  reducers: {
    addGenerale: generaleAdapter.addOne,
    updateGenerale: (state, action: PayloadAction<{ id: EntityId; changes: Partial<Generale> }>) => {
      generaleAdapter.updateOne(state, action.payload);
    },
    removeGenerale: generaleAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenerale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenerale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        generaleAdapter.setAll(state, action.payload);
      })
      .addCase(fetchGenerale.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addGenerale.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addGenerale.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        generaleAdapter.addOne(state, action.payload);
      })
      .addCase(addGenerale.rejected, (state, action) => {
        state.addStatus = 'failed';
        //@ts-ignore
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(updateGenerale.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateGenerale.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        generaleAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateGenerale.rejected, (state, action) => {
        state.updateStatus = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deleteGenerale.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteGenerale.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        generaleAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteGenerale.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Exporter les actions
export const { addGenerale: addGeneraleAction, updateGenerale: updateGeneraleAction, removeGenerale: removeGeneraleAction } = generaleSlice.actions;

// Exporter les sélecteurs
export const {
  selectAll: selectAllGenerales,
  selectById: selectGeneraleById,
  selectIds: selectGeneraleIds,
  //@ts-ignore
} = generaleAdapter.getSelectors((state: any) => state.generale);

// Exporter le reducer
export default generaleSlice.reducer;
