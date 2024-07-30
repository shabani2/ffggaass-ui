//mport { updatePointVente } from '@/Redux/Admin/pointVenteSlice';
import { createSlice, createAsyncThunk, createEntityAdapter, EntityId, PayloadAction} from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'
import { PointVente } from '@/Utils/dataTypes'; // Assurez-vous que le chemin est correct

export interface pvapi {
    _id:string;
    nom: string;
    emplacement: string;
}

const pointVenteAdapter = createEntityAdapter<PointVente>();

const initialState = pointVenteAdapter.getInitialState({
  status: 'idle',
  initPS : '',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
});

// Thunks
export const fetchPointVentes = createAsyncThunk('pointVente/fetchPointVentes', async () => {
  const response = await axiosInstance.get('/pointvente');
  return response.data.map((pv: { _id: unknown; }) => ({
    id: pv._id,
    ...pv
  }));
});

export const addPointVente = createAsyncThunk('pointVente/addPointVente', async (newPointVente: unknown) => {
  const response = await axiosInstance.post('/pointvente', newPointVente);
  return response.data.map((pv: { _id: unknown; }) => ({
    id: pv._id,
    ...pv
  }));
});

export const updatePointVente = createAsyncThunk('pointVente/updatePointVente', async ({ id, updatedPointVente }: { id: unknown; updatedPointVente: pvapi })=> {
 // const { id, ...fields } = updatedPointVente;
  const response = await axiosInstance.put(`/pointvente/${id}`, updatedPointVente);
  return response.data.map((pv: { _id: unknown; }) => ({
    id: pv._id,
    ...pv
  }));
});

export const deletePointVente = createAsyncThunk('pointVente/deletePointVente', async (id: string) => {
  await axiosInstance.delete(`/pointvente/${id}`);
  return id;
});

// Slice
const pointVenteSlice = createSlice({
  name: 'pointVente',
  initialState,
  reducers: {
    addPointVente: pointVenteAdapter.addOne,
    updatePointVente: (state, action: PayloadAction<{ id: EntityId; changes: Partial<PointVente> }>) => {
      pointVenteAdapter.updateOne(state, action.payload);
    },
    removePointVente: pointVenteAdapter.removeOne,
    setInitPS: (state, action: PayloadAction<unknown>) => {
      state.initPS = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPointVentes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPointVentes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        pointVenteAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPointVentes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addPointVente.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addPointVente.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        pointVenteAdapter.addOne(state, action.payload);
      })
      .addCase(addPointVente.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(updatePointVente.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updatePointVente.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        pointVenteAdapter.upsertOne(state, action.payload);
      })
      .addCase(updatePointVente.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deletePointVente.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deletePointVente.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        pointVenteAdapter.removeOne(state, action.payload);
      })
      .addCase(deletePointVente.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default pointVenteSlice.reducer;

// Exporter les actions
export const { setInitPS } = pointVenteSlice.actions;

export const {
  selectAll: selectAllPointVentes,
  selectById: selectPointVenteById,
  selectIds: selectPointVenteIds,
} = pointVenteAdapter.getSelectors((state: any) => state.pointVente);
