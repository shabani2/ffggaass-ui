import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Auth/userSlice';
import pointVenteReducer from './Admin/pointVenteSlice'
import categoryReducer from './Admin/categorySlice'
import produitReducer from './Admin/productSlice'
import mvtStockReducer from './Admin/mvtStockSlice'
import seuilReducer from './Admin/seuilSlice'
import livraisonReducer from './Admin/livraisonSlice';
import venteReducer from './Admin/venteSlice';
import commandeReducer from './Admin/commandeSlice';
import clientReducer from './Admin/clientSlice';
import bonEntreReducer from './Admin/bonEntreSlice';
import stockVariationReducer from './Admin/stockVariationSlice';
import stockLocalReducer from './Admin/stockLocalSlice';



export const Store = configureStore({
  reducer: {
    users: userReducer,
    pointVente : pointVenteReducer,
    categories : categoryReducer,
    produits : produitReducer,
    mvtStock:mvtStockReducer,
    seuils:seuilReducer,
    livraison:livraisonReducer,
    vente: venteReducer,
    commande: commandeReducer,
    clients : clientReducer,
    bonEntre:bonEntreReducer,
    stockVariation : stockVariationReducer,
    stockLocal:stockLocalReducer
   
  
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
