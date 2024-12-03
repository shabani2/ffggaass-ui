



/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axiosInstance from '@/Utils/axiosInstance'; // Assurez-vous que cette instance Axios est configurée
import { PointVente1 } from '@/Utils/dataTypes';
import { Produit1 } from './productSlice';
import { RootState } from '../Store';

// Modèle de données pour StockVariation
export interface StockVariation {
  pointVente: PointVente1,
  produit: Produit1,
  quantiteVendu: number,
  quantiteLivre: number,
  solde: number
}

// interface StockVariationState {
//   items: StockVariation[];
//   loading: boolean;
//   error: string | null;
// }

// Adaptateur pour les opérations CRUD sur StockVariation
//@ts-ignore
const stockVariationAdapter = createEntityAdapter<StockVariation>({
//@ts-ignore
  selectId: (stockVariation) => stockVariation._id,
});

// Thunks pour les opérations asynchrones
export const fetchAllStockVariations = createAsyncThunk('stockVariation/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/stockVariations');
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchStockVariationsByPointVente = createAsyncThunk('stockVariations/fetchByPointVente', async (pointVenteId: unknown, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/stockVariations/${pointVenteId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchStockVariationByPointVenteAndProduit = createAsyncThunk('stockVariations/fetchByPointVenteAndProduit', async ({ pointVenteId, produitId }: { pointVenteId: string, produitId: string }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/stockVariations/pointVente/${pointVenteId}/${produitId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});




// État initial du slice
const initialState = stockVariationAdapter.getInitialState({
  items: [],
  loading: false,
  error: null as string | null,
});

// Slice Redux Toolkit pour StockVariation
const stockVariationSlice = createSlice({
  name: 'stockVariation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStockVariations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStockVariations.fulfilled, (state, action) => {
        state.loading = false;
        stockVariationAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllStockVariations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockVariationsByPointVente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockVariationsByPointVente.fulfilled, (state, action) => {
        state.loading = false;
        stockVariationAdapter.setAll(state, action.payload);
      })
      .addCase(fetchStockVariationsByPointVente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStockVariationByPointVenteAndProduit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockVariationByPointVenteAndProduit.fulfilled, (state, action) => {
        state.loading = false;
        stockVariationAdapter.setAll(state, [action.payload]); // On attend un seul objet, donc on l'entoure de crochets
      })
      .addCase(fetchStockVariationByPointVenteAndProduit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Sélecteurs pour accéder aux données de StockVariation dans le store Redux
export const {
  selectAll: selectAllStockVariations,
  selectById: selectStockVariationById,
} = stockVariationAdapter.getSelectors((state: RootState) => state.stockVariation);


export const selectStockVariationWithMontants = createSelector(
  [selectAllStockVariations],
  (stockVariations) => {
    return stockVariations.map((item) => {
      // Vérification si le produit est valide
      const produit = item.produit || {};
      const prix = produit.prix || 0; // Par défaut, 0 si `prix` est manquant
      const prixVente = produit.prixVente || 0; // Par défaut, 0 si `prixVente` est manquant
      
      return {
        ...item,
        montantLivre: item.quantiteVendu * prix,
        montantVendu: item.quantiteVendu * prixVente,
      };
    });
  }
);


export const selectMontantsTotal = createSelector(
  [selectStockVariationWithMontants],
  
  (stockVariationsWithMontants) => {
    const totalMontantLivre = stockVariationsWithMontants.reduce((total, item) => total + item.montantLivre, 0);
    const totalMontantVendu = stockVariationsWithMontants.reduce((total, item) => total + item.montantVendu, 0);
    const difference = totalMontantVendu - totalMontantLivre;
    // console.log(stockVariationsWithMontants);
    // console.log(stockVariationsWithMontants.map(item => item.montantLivre));
    // console.log(stockVariationsWithMontants.map(item => item.montantVendu));
    

    return {
      totalMontantLivre,
      totalMontantVendu,
      difference
    };
  }
);


// Sélecteur pour obtenir les montants par PointVente
export const selectMontantsTotalForPointVente = (pointVenteId: unknown) =>
  createSelector(
    [selectStockVariationWithMontants],
    (stockVariationsWithMontants) => {
      // Filtrer les variations correspondant à un point de vente spécifique
      const variationsForPointVente = stockVariationsWithMontants.filter(
        (item) => item.pointVente._id === pointVenteId
      );

      // Calcul des montants pour ce point de vente
      const totalMontantLivre = variationsForPointVente.reduce((total, item) => total + item.montantLivre, 0);
      const totalMontantVendu = variationsForPointVente.reduce((total, item) => total + item.montantVendu, 0);
      const difference = totalMontantVendu - totalMontantLivre;

      return {
        totalMontantLivre,
        totalMontantVendu,
        difference,
      };
    }
  );


// Exportation du reducer pour l'intégration dans le store Redux
export default stockVariationSlice.reducer;
