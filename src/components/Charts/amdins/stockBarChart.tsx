import React, { useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchAllStockVariations, selectAllStockVariations } from '@/Redux/Admin/stockVariationSlice';
import { StockVariation } from '@/Redux/Admin/stockVariationSlice';

// Structure correcte pour les données du graphique
interface BarChartData {
    produit: string;
    [key: string]: number | string; // clé dynamique pour 'quantiteLivre', 'quantiteVendu', et 'solde'
}

//const colorPalette = ['#2a9d8f', '#264653', '#e9c46a']; // Exemple de palette de couleurs

const StockBarChart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const stockVariations : StockVariation[]= useSelector((state: RootState) => selectAllStockVariations(state)) as StockVariation[];

    useEffect(() => {
        dispatch(fetchAllStockVariations());
    }, [dispatch]);
  
    // Transformer les données en format compatible avec Nivo
    const groupedData: BarChartData[] = stockVariations.map((variation) => ({
      produit: variation.produit?.nom || "Produit Inconnu", // Si `variation.produit` ou `nom` est manquant, utilise une valeur par défaut
      quantiteLivre: variation.quantiteLivre || 0,         // Défaut à 0 si non défini
      quantiteVendu: variation.quantiteVendu || 0,         // Défaut à 0 si non défini
      solde: variation.solde || 0,                         // Défaut à 0 si non défini
  }));
 // console.log('stockvariation=> ',groupedData);
 console.log('Index Values:', groupedData.map(data => data.produit));


    return (
        <div>
        { 
            stockVariations.length <= 0 ? (
              <p>Pas de données disponibles</p>
            ) : (
              
                <div style={{width:"100%",height:"430px", backgroundColor: '#808b96'}}>                
                  {/* <div style={{ height: '500px', width: '800px', backgroundColor: '#f0f0f0' }}> */}
                  <ResponsiveBar
  data={groupedData}
  keys={['quantiteLivre', 'quantiteVendu', 'solde']}
  indexBy="produit"
  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
  padding={0.3}
  colors={['#2a9d8f', '#264653', '#e9c46a']}
  axisBottom={{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Quantités',
    legendPosition: 'middle',
    legendOffset: 32,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    tickTextColor: 'white',  // Couleur blanche pour le texte de l'axe X
  }}
  axisLeft={{
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    legend: 'Produits',
    legendPosition: 'middle',
    legendOffset: -40,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    tickTextColor: 'white',  // Couleur blanche pour le texte de l'axe Y
  }}
  labelTextColor="white"  // Couleur blanche pour les labels des barres
/>

{/* </div> */}
                </div>
              
            )
          }
       </div>   

        
    );
};

export default StockBarChart;
