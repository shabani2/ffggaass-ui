import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { RootState } from '../Store';
import { AxiosError } from 'axios';
import { Seuil1 } from '@/Utils/dataTypes';



export interface SeuilState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const seuilAdapter = createEntityAdapter<Seuil1>();

const initialState = seuilAdapter.getInitialState<SeuilState>({
  status: 'idle',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
});

export const fetchSeuils = createAsyncThunk('seuils/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/seuil');
    return response.data.map((pv: { _id: unknown; }) => ({
        id: pv._id,
        ...pv
      }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addSeuil = createAsyncThunk('seuils/add', async (seuilData: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/seuil', seuilData);
    return response.data.map((pv: { _id: unknown; }) => ({
        id: pv._id,
        ...pv
      }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateSeuil = createAsyncThunk('seuils/update', async ({ id, updates }: { id: string; updates: unknown }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/seuil/${id}`, updates);
   return response.data.map((pv: { _id: unknown; }) => ({
    id: pv._id,
    ...pv
  }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteSeuil = createAsyncThunk('seuils/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/seuil/${id}`);
    return id;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

const seuilSlice = createSlice({
  name: 'seuils',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Seuils
    builder.addCase(fetchSeuils.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchSeuils.fulfilled, (state, action) => {
      state.status = 'succeeded';
      seuilAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchSeuils.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Add Seuil
    builder.addCase(addSeuil.pending, (state) => {
      state.addStatus = 'loading';
    });
    builder.addCase(addSeuil.fulfilled, (state, action) => {
      state.addStatus = 'succeeded';
      seuilAdapter.addOne(state, action.payload);
    });
    builder.addCase(addSeuil.rejected, (state, action) => {
      state.addStatus = 'failed';
      state.error = action.payload as string;
    });

    // Update Seuil
    builder.addCase(updateSeuil.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updateSeuil.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      seuilAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(updateSeuil.rejected, (state, action) => {
      state.updateStatus = 'failed';
      state.error = action.payload as string;
    });

    // Delete Seuil
    builder.addCase(deleteSeuil.pending, (state) => {
      state.deleteStatus = 'loading';
    });
    builder.addCase(deleteSeuil.fulfilled, (state, action) => {
      state.deleteStatus = 'succeeded';
      seuilAdapter.removeOne(state, action.payload);
    });
    builder.addCase(deleteSeuil.rejected, (state, action) => {
      state.deleteStatus = 'failed';
      state.error = action.payload as string;
    });
  },
});

export default seuilSlice.reducer;
export const { selectAll: selectAllSeuils } = seuilAdapter.getSelectors((state: RootState) => state.seuils);
