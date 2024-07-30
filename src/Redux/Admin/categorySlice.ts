
import axiosInstance from '@/Utils/axiosInstance';
import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction, EntityId } from '@reduxjs/toolkit';


export interface Category1 {
  id: EntityId;
  _id:string
  nom: string;
  unite: string;
  piecenombre: number;
}

export interface CategoriesState {
  loading: boolean;
  error: string | null;
}

const categoryAdapter = createEntityAdapter<Category1>();

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/category');
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const addCategory = createAsyncThunk('categories/add', async (newCategory: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/category', newCategory);
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({id,category} :{id:unknown,category:unknown},{ rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`category/${id}`, category);
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (categoryId: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/category/${categoryId}`);
    return categoryId;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const initialState = categoryAdapter.getInitialState<CategoriesState>({
  loading: false,
  error: null,
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category1[]>) => {
        state.loading = false;
        categoryAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category1>) => {
        state.loading = false;
        categoryAdapter.addOne(state, action.payload);
      })
      .addCase(addCategory.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category1>) => {
        state.loading = false;
        categoryAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCategory.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        categoryAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
export const { selectAll: selectAllCategories } = categoryAdapter.getSelectors((state: any) => state.categories);
