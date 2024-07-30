import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Auth/userSlice';
import pointVenteReducer from './Admin/pointVenteSlice'
import categoryReducer from './Admin/categorySlice'
import produitReducer from './Admin/productSlice'
import mvtStockReducer from './Admin/mvtStockSlice'
import seuilReducer from './Admin/seuilSlice'

export const Store = configureStore({
  reducer: {
    users: userReducer,
    pointVente : pointVenteReducer,
    categories : categoryReducer,
    produits : produitReducer,
    mvtStock:mvtStockReducer,
    seuils:seuilReducer
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
