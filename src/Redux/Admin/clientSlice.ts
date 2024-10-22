/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { Client } from '@/Utils/dataTypes'; // Importez votre interface Client

// Adapter pour gérer l'état des clients
const clientAdapter = createEntityAdapter<Client>({
  //@ts-ignore
  selectId: (instance: { _id: EntityId; }) => instance._id,
});

// État initial du slice
const initialState = clientAdapter.getInitialState({
  status: 'idle',
  error: null,
});

// Thunks pour gérer les opérations asynchrones

// Ajouter un nouveau client
export const addClient = createAsyncThunk(
  'clients/addClient',
  async (newClient: Omit<Client, 'id'>) => {
    const response = await axiosInstance.post('/clients', newClient);
    return response.data;
  }
);

// Obtenir tous les clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await axiosInstance.get('/clients');
    return response.data;
  }
);

// Rechercher des clients par nom, postnom ou prenom
export const searchClients = createAsyncThunk(
  'clients/searchClients',
  async (query: string) => {
    const response = await axiosInstance.get(`/clients/search`, { params: { query } });
    return response.data;
  }
);

// Obtenir un client par ID
export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id: string) => {
    const response = await axiosInstance.get(`/clients/${id}`);
    return response.data;
  }
);

// Mettre à jour un client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, updatedClient }: { id: string; updatedClient: Partial<Client> }) => {
    const response = await axiosInstance.put(`/clients/${id}`, updatedClient);
    return response.data;
  }
);

// Supprimer un client
export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: string) => {
    await axiosInstance.delete(`/clients/${id}`);
    return id;
  }
);

// Création du slice
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.setAll(state, action.payload);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to fetch clients';
      })

      // Add a new client
      .addCase(addClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.addOne(state, action.payload);
      })
      .addCase(addClient.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to add client';
      })

      // Search clients
      .addCase(searchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.setAll(state, action.payload);
      })
      .addCase(searchClients.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to search clients';
      })

      // Fetch client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to fetch client';
      })

      // Update client
      .addCase(updateClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to update client';
      })

      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.status = 'succeeded';
        clientAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Failed to delete client';
      });
  },
});

// Exporter les sélecteurs générés par l'adaptateur
export const {
  selectAll: selectAllClients,
  selectById: selectClientById,
} = clientAdapter.getSelectors((state: any) => state.clients);

export default clientSlice.reducer;
