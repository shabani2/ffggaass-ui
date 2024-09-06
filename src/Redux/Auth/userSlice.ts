import { createSlice, createAsyncThunk, createEntityAdapter, EntityId } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance';
import { RootState } from '../Store';
import { AxiosError } from 'axios';
import { PointVente1 } from '@/Utils/dataTypes';
import { jwtDecode } from 'jwt-decode';
//import Cookies from 'js-cookie';

export interface User {
  _id:EntityId
  id: string;
  nom: string;
  postnom: string;
  prenom: string;
  numero: string;
  password: string;
  role: 'Vendeur' | 'Admin' | 'SuperAdmin';
  pointVente?: PointVente1;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  addStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
}

export interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const userAdapter = createEntityAdapter<User>();

const initialState = userAdapter.getInitialState<AuthState>({
  token: null,
  user: null,
  status: 'idle',
  error: null,
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
});

export const registerUser = createAsyncThunk('users/register', async (userData: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const loginUser = createAsyncThunk('users/login', async (credentials: { numero: string; password: string }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials,{ withCredentials: true });   

    const { token } = response.data;

    // Stocker le token dans localStorage
    if (token) {
        localStorage.setItem('jwt', token);
    }
    console.log('Login successful', response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateUser = createAsyncThunk('users/update', async ({id,user}:{id:string,user: unknown},{ rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/user/${id}`, user);
    return response.data.map((pv: { _id: unknown; }) => ({
      id: pv._id,
      ...pv
    }));
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (userId: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/user/${userId}`);
    return userId;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const logoutUser = createAsyncThunk('users/logout', async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem('jwt');
    return null;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const loadUserFromToken = createAsyncThunk('users/loadUserFromToken', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const decodedToken = jwtDecode<DecodedToken>(token);
    const response = await axiosInstance.get(`/user/${decodedToken.userId}`);
    return { user: response.data, token };
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const findUserById = createAsyncThunk('users/findById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.response?.data || err.message);
  }
});

const userSlice = createSlice({
  name: 'users',
 // status : '',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Register User
    builder.addCase(registerUser.pending, (state) => {
      state.addStatus = 'loading';
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.addStatus = 'succeeded';
      userAdapter.addOne(state, action.payload);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.addStatus = 'failed';
      state.error = action.payload as string;
    });

    // Login User
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Fetch Users
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      userAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.updateStatus = 'loading';
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      userAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateStatus = 'failed';
      state.error = action.payload as string;
    });

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      userAdapter.removeOne(state, action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Logout User
    builder.addCase(logoutUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = 'succeeded';
      state.token = null;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
    builder.addCase(findUserById.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(findUserById.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload;
    });
    builder.addCase(findUserById.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
    builder.addCase(loadUserFromToken.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(loadUserFromToken.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loadUserFromToken.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;
export const { selectAll: selectAllUsers } = userAdapter.getSelectors((state: RootState) => state.users);
export const selectCurrentUser = (state: RootState) => state.users.user;
