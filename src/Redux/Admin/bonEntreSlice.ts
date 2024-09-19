/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { BonEntre } from '@/Utils/dataTypes'; // Assurez-vous que le chemin est correct

export interface BonEntreAPI {
  _id: string;
  produit: string;
  quantite: number;
  date: Date;
}
//@ts-ignore
const bonEntreAdapter = createEntityAdapter<BonEntre>({    
        //@ts-ignore
        selectId: (instance: { _id: EntityId; }) => instance._id,      
});

const initialState = bonEntreAdapter.getInitialState({
  status: 'idle',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
});

// Thunks
export const fetchBonsEntres = createAsyncThunk('bonEntre/fetchBonsEntres', async () => {
  const response = await axiosInstance.get('/bonentre');
  return response.data.map((be: { _id: unknown }) => ({
    id: be._id,
    ...be
  }));
});

export const addBonEntre = createAsyncThunk('bonEntre/addBonEntre', async (newBonEntre: unknown) => {
  const response = await axiosInstance.post('/bonentre', newBonEntre);
  return {
    id: response.data._id,
    ...response.data
  };
});

export const updateBonEntre = createAsyncThunk('bonEntre/updateBonEntre', async ({ id, updatedBonEntre }: { id: unknown; updatedBonEntre: BonEntreAPI }) => {
  const response = await axiosInstance.put(`/bonentre/${id}`, updatedBonEntre);
  return {
    id: response.data._id,
    ...response.data
  };
});

export const deleteBonEntre = createAsyncThunk('bonEntre/deleteBonEntre', async (id: string) => {
  await axiosInstance.delete(`/bonentre/${id}`);
  return id;
});

// Slice
const bonEntreSlice = createSlice({
  name: 'bonEntre',
  initialState,
  reducers: {
    // addBonEntre: bonEntreAdapter.addOne,
    // updateBonEntre: (state, action: PayloadAction<{ id: EntityId; changes: Partial<BonEntre> }>) => {
    //   bonEntreAdapter.updateOne(state, action.payload);
    // },
    // removeBonEntre: bonEntreAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBonsEntres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBonsEntres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        bonEntreAdapter.setAll(state, action.payload);
      })
      .addCase(fetchBonsEntres.rejected, (state, action) => {
        state.status = 'failed';
        //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addBonEntre.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addBonEntre.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        bonEntreAdapter.addOne(state, action.payload);
      })
      .addCase(addBonEntre.rejected, (state, action) => {
        state.addStatus = 'failed';
         //@ts-ignore
        state.error = action.payload as string || 'Something went wrong';
      })
      .addCase(updateBonEntre.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateBonEntre.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        bonEntreAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateBonEntre.rejected, (state, action) => {
        state.updateStatus = 'failed';
         //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(deleteBonEntre.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteBonEntre.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        bonEntreAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteBonEntre.rejected, (state, action) => {
        state.deleteStatus = 'failed';
         //@ts-ignore
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default bonEntreSlice.reducer;

// Exporter les actions
//export const { addBonEntre, updateBonEntre, removeBonEntre } = bonEntreSlice.actions;

export const {
  selectAll: selectAllBonsEntres,
  selectById: selectBonEntreById,
  selectIds: selectBonEntreIds,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = bonEntreAdapter.getSelectors((state: any) => state.bonEntre);
