import { createSlice, createEntityAdapter, PayloadAction, EntityId, createSelector, EntityState } from '@reduxjs/toolkit';
import { RootState } from '../Store';
import { Perfomance, PointVenteContribution, PointVenteTraffic, ProductContribution, ProductPerformance, Situation, SituationLivraison, SituationVente, TrafficPv } from '@/Utils/dataTypes';
import { startOfWeek, subWeeks } from 'date-fns';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

// Adapter pour la situation
const situationAdapter = createEntityAdapter<Situation>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  selectId: (situation: { id: EntityId; }) => situation.id,
});

// Slice de situation
const situationSlice = createSlice({
  name: 'situations',
  initialState: situationAdapter.getInitialState(),
  reducers: {
    addSituationsLivraison: (state, action: PayloadAction<SituationLivraison[]>) => {
      const situationsWithOperation: Situation[] = action.payload.map(situation => ({
        id: situation._id,
        date: situation.date,
        pointVente: situation.pointVente,
        produit: situation.produit,
        quantiteTotale: situation.quantiteTotale,
        montantTotal: situation.montantTotal,
        operation: 'livraison',
      }));
      situationAdapter.addMany(state, situationsWithOperation);
    },
    addSituationsVente: (state, action: PayloadAction<SituationVente[]>) => {
      const situationsWithOperation: Situation[] = action.payload.map(situation => ({
        id: situation._id,
        date: situation.date,
        pointVente: situation.pointVente,
        produit: situation.produit,
        quantiteTotale: situation.quantiteTotale,
        montantTotal: situation.montantTotal,
        operation: 'vente',
      }));
      situationAdapter.addMany(state, situationsWithOperation);
    },
  },
});

// Export des actions
export const { addSituationsLivraison, addSituationsVente } = situationSlice.actions;

// Sélecteurs de base
export const {
  selectAll: selectAllSituations,
  selectById: selectSituationById,
  selectEntities: selectSituationEntities,
  selectIds: selectSituationIds,
  selectTotal: selectSituationTotal,
} = situationAdapter.getSelectors((state: RootState) => state.situations);

// Sélecteur pour trouver la dernière date
export const selectLatestDate = createSelector(
  selectAllSituations,
  situations => {
    const dates = situations.map(situation => situation.date);
    return dates.length > 0 ? dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] : null;
  }
);

// Sélecteur pour filtrer les situations par la dernière date
export const selectSituationsByLatestDate = createSelector(
  [selectAllSituations, selectLatestDate],
  (situations, latestDate) => situations.filter(situation => situation.date === latestDate)
);

// Sélecteur pour calculer le total des ventes et livraisons à la dernière date
export const selectTotalVentesAndLivraisonsByLatestDate = createSelector(
  selectSituationsByLatestDate,
  situations => {
    const totalVentes = situations
      .filter(situation => situation.operation === 'vente')
      .reduce((total, situation) => total + situation.montantTotal, 0);

    const totalLivraisons = situations
      .filter(situation => situation.operation === 'livraison')
      .reduce((total, situation) => total + situation.montantTotal, 0);

    return {
      totalVentes,
      totalLivraisons,
      difference: totalVentes - totalLivraisons,
    };
  }
);

export const selectTotalVentesAndLivraisonsByCurrentMonth = createSelector(
  selectSituationsByLatestDate,
  situations => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    console.log('Current Month Interval:', startOfCurrentMonth, endOfCurrentMonth);

    const situationsCurrentMonth = situations.filter(situation => {
      const situationDate = new Date(situation.date);
      return isWithinInterval(situationDate, {
        start: startOfCurrentMonth,
        end: endOfCurrentMonth
      });
    });

    console.log('Situations for Current Month:', situationsCurrentMonth);

    const totalVentes = situationsCurrentMonth
      .filter(situation => situation.operation.toLowerCase() === 'vente')
      .reduce((total, situation) => total + situation.montantTotal, 0);

    const totalLivraisons = situationsCurrentMonth
      .filter(situation => situation.operation.toLowerCase() === 'livraison')
      .reduce((total, situation) => total + situation.montantTotal, 0);

    console.log('Total Ventes:', totalVentes);
    console.log('Total Livraisons:', totalLivraisons);

    return {
      totalVentes,
      totalLivraisons,
      difference: totalVentes - totalLivraisons,
    };
  }
);


export const selectQuantitiesByProduct = createSelector(
  selectAllSituations,
  (situations) => {
    const quantitiesByProduct = situations.reduce((acc, situation) => {
      const productName = situation.produit.nom;

      if (!acc[productName]) {
        acc[productName] = {
          quantiteLivree: 0,
          quantiteVendue: 0,
          difference: 0,
        };
      }

      if (situation.operation === 'livraison') {
        acc[productName].quantiteLivree += situation.quantiteTotale;
      } else if (situation.operation === 'vente') {
        acc[productName].quantiteVendue += situation.quantiteTotale;
      }

      acc[productName].difference = acc[productName].quantiteVendue - acc[productName].quantiteLivree;

      return acc;
    }, {} as Record<string, { quantiteLivree: number; quantiteVendue: number; difference: number }>);

    return quantitiesByProduct;
  }
);

export const selectPerfomanceByPointVente = createSelector(
  selectAllSituations,
  (situations) => {
    const performanceByPointVente = situations.reduce((acc, situation) => {
      // Ne considérer que les situations dont l'opération est 'vente'
      if (situation.operation === 'vente') {
        const pointVenteName = situation.pointVente.nom; // ou situation.pointVente._id si tu veux utiliser l'identifiant

        if (!acc[pointVenteName]) {
          acc[pointVenteName] = {
            pointVente: pointVenteName,
            montantTotal: 0,
            quantiteTotale: 0,
          };
        }

        acc[pointVenteName].montantTotal += situation.montantTotal;
        acc[pointVenteName].quantiteTotale += situation.quantiteTotale;
      }

      return acc;
    }, {} as Record<string, Perfomance>);

    return Object.values(performanceByPointVente);
  }
);

export const selectPointVenteTraffic = createSelector(
  [selectAllSituations, selectLatestDate],
  (situations, latestDate) => {
    // Filtrer les situations à la dernière date et dont l'opération est vente
    const filteredSituations = situations.filter(
      situation => situation.date === latestDate && situation.operation === 'vente'
    );

    // Réduire les situations pour obtenir la collection PointVenteTraffic
    const pointVenteTraffic = filteredSituations.reduce((acc, situation) => {
      const key = `${situation.pointVente.nom}-${situation.produit.nom}`;

      if (!acc[key]) {
        acc[key] = {
          point_vente: situation.pointVente.nom,
          produit: situation.produit.nom,
          quantite: 0,
          prix_vente: 0,
        };
      }

      acc[key].quantite += situation.quantiteTotale;
      acc[key].prix_vente += situation.montantTotal;

      return acc;
    }, {} as Record<string, PointVenteTraffic>);

    // Retourner les valeurs comme un tableau
    return Object.values(pointVenteTraffic);
  }
);


export const selectProductPerformance = createSelector(
  selectAllSituations,
  (situations): ProductPerformance[] => {
    // Créer un objet pour stocker les performances par produit
    const performanceByProduct: Record<string, { quantiteTotale: number; prixVente: number }> = {};

    situations.forEach(situation => {
      const productName = situation.produit.nom;

      if (!performanceByProduct[productName]) {
        performanceByProduct[productName] = {
          quantiteTotale: 0,
          prixVente: 0,
        };
      }

      // Accumuler la quantité totale et le prix de vente total
      if (situation.operation === 'vente') {
        performanceByProduct[productName].quantiteTotale += situation.quantiteTotale;
        performanceByProduct[productName].prixVente += situation.montantTotal;
      }
    });

    // Convertir l'objet en tableau de ProductPerformance
    return Object.entries(performanceByProduct).map(([produit, { quantiteTotale, prixVente }]) => ({
      produit,
      quantiteTotale,
      prixVente,
    }));
  }
);


// Sélecteur pour obtenir toutes les situations
//export const selectAllSituations = (state: RootState) => state.situations;

// Sélecteur pour extraire la contribution des points de vente
export const selectPointVenteContribution = createSelector(
  selectAllSituations,
  (situations): PointVenteContribution[] => {
    // Créer un objet pour stocker les contributions par point de vente
    const contributionByPointVente: Record<string, number> = {};

    situations.forEach(situation => {
      const pointVenteName = situation.pointVente.nom;

      if (!contributionByPointVente[pointVenteName]) {
        contributionByPointVente[pointVenteName] = 0;
      }

      // Accumuler le montant total pour chaque point de vente
      if (situation.operation === 'vente') {
        contributionByPointVente[pointVenteName] += situation.montantTotal;
      }
    });

    // Convertir l'objet en tableau de PointVenteContribution
    return Object.entries(contributionByPointVente).map(([pointVente, montantTotal]) => ({
      pointVente,
      montantTotal,
    }));
  }
);


// Typage des données regroupées par semaine
interface WeeklySalesData {
  weekStart: Date;
  montantTotal: number;
}

// Sélecteur pour calculer l'évolution hebdomadaire des montants totaux générés
export const selectWeeklySalesEvolution = createSelector(
  (state: RootState) => state.situations, // Assure-toi que le slice des situations est bien typé dans RootState
  (situations: EntityState<Situation,any>) => {
    const threeMonthsAgo = subWeeks(new Date(), 12); // 12 semaines pour 3 mois
    const filteredSituations = Object.values(situations.entities).filter(
      (situation) =>
        situation?.operation === 'vente' &&
        new Date(situation.date) >= threeMonthsAgo
    );

    const weeklyEvolution = filteredSituations.reduce((acc, situation) => {
      if (!situation) return acc; // Vérifie que la situation n'est pas undefined
      const weekStart = startOfWeek(new Date(situation.date));
      const weekKey = weekStart.toISOString();

      if (!acc[weekKey]) {
        acc[weekKey] = {
          weekStart,
          montantTotal: 0,
        };
      }

      acc[weekKey].montantTotal += situation.montantTotal;

      return acc;
    }, {} as Record<string, WeeklySalesData>);

    return Object.values(weeklyEvolution).sort(
      (a, b) => a.weekStart.getTime() - b.weekStart.getTime()
    );
  }
);


export const selectPointVenteTrafficForPv = createSelector(
  [selectSituationsByLatestDate, (state: RootState, pointVenteId: unknown) => pointVenteId],
  (situations, pointVenteId): TrafficPv[] => {
    // Filtrer les situations pour le point de vente spécifique
    const filteredSituations = situations.filter(
      situation => situation.pointVente?._id === pointVenteId
    );

    // Trouver la dernière date parmi les situations filtrées
    const latestDate = Math.max(...filteredSituations.map(situation => new Date(situation.date).getTime()));

    // Filtrer les situations pour ne garder que celles à la dernière date
    const latestSituations = filteredSituations.filter(
      situation => new Date(situation.date).getTime() === latestDate
    );

    // Grouper les situations par produit dans le point de vente
    const trafficByProduct = latestSituations.reduce((acc, situation) => {
      const productName = situation.produit.nom; // ou situation.produit._id si vous préférez utiliser l'identifiant du produit

      // Initialiser les totaux pour le produit si ce n'est pas déjà fait
      if (!acc[productName]) {
        acc[productName] = {
          pointVente: situation.pointVente.nom, // Ajout de la propriété pointVente
          produit: productName, // ou situation.produit._id si vous utilisez l'identifiant
          quantite: 0,
          montantTotal: 0,
        };
      }

      // Ajouter les quantités et montants totaux pour chaque produit
      acc[productName].quantite += situation.quantiteTotale;
      acc[productName].montantTotal += situation.montantTotal;

      return acc;
    }, {} as Record<string, TrafficPv>);

    // Retourner les valeurs comme un tableau regroupé par produit
    return Object.values(trafficByProduct);
  }
);

export const selectProductContributionForPv = createSelector(
  [
    (state: RootState) => state.situations, // Sélectionne toutes les situations
    (state: RootState, pointVenteId: unknown) => pointVenteId // Sélectionne l'ID du point de vente
  ],
  (situationsState, pointVenteId): ProductContribution[] => {
    const situations = Object.values(situationsState.entities) as Situation[]; // Convertit les entités en tableau

    // Filtrer les situations pour le point de vente spécifique
    const filteredSituations = situations.filter(
      situation => situation.pointVente?._id === pointVenteId
    );

    // Trouver la dernière date parmi les situations filtrées
    const latestDate = Math.max(...filteredSituations.map(situation => new Date(situation.date).getTime()));

    // Filtrer les situations pour ne garder que celles à la dernière date
    const latestSituations = filteredSituations.filter(
      situation => new Date(situation.date).getTime() === latestDate
    );

    // Grouper les situations par produit à la dernière date
    const contributionByProduct = latestSituations.reduce((acc, situation) => {
      const productName = situation.produit.nom; // ou situation.produit._id si vous préférez utiliser l'identifiant du produit

      // Initialiser les totaux pour le produit si ce n'est pas déjà fait
      if (!acc[productName]) {
        acc[productName] = {
          produit: productName, // ou situation.produit._id si vous utilisez l'identifiant
          quantite: 0,
          montantTotal: 0,
        };
      }

      // Ajouter les quantités et montants totaux pour chaque produit
      if (situation.operation === 'vente') {
        acc[productName].quantite += situation.quantiteTotale;
        acc[productName].montantTotal += situation.montantTotal;
      }

      return acc;
    }, {} as Record<string, ProductContribution>);

    // Retourner les contributions sous forme de tableau
    return Object.values(contributionByProduct);
  }
);

export const selectSituationsByPointVente = createSelector(
  [selectAllSituations, (state: RootState, pointVenteId: unknown) => pointVenteId],
  (situations, pointVenteId) => {
    return situations.filter(situation => situation.pointVente._id === pointVenteId);
  }
);


// Export du reducer
export default situationSlice.reducer;
