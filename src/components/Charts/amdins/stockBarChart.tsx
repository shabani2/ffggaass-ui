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

const colorPalette = ['#2a9d8f', '#264653', '#e9c46a']; // Exemple de palette de couleurs

const StockBarChart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const stockVariations : StockVariation[]= useSelector((state: RootState) => selectAllStockVariations(state)) as StockVariation[];

    useEffect(() => {
        dispatch(fetchAllStockVariations());
    }, [dispatch]);

    // Transformer les données en format compatible avec Nivo
    const groupedData: BarChartData[] = stockVariations.map((variation) => ({
        produit: variation.produit.nom,
        quantiteLivre: variation.quantiteLivre,
        quantiteVendu: variation.quantiteVendu,
        solde: variation.solde,
    }));

    return (
        <div>
        { 
            stockVariations.length <= 0 ? (
              <p>Pas de données disponibles</p>
            ) : (
              <div className="h-full">
                <div className="flex-grow h-[90%]">
                  <ResponsiveBar
                    data={groupedData}
                    keys={['quantiteLivre', 'quantiteVendu', 'solde']}
                    indexBy="produit"
                    layout="horizontal"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={colorPalette} // Utiliser la palette de couleurs définie
                    borderColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Quantités',
                      legendPosition: 'middle',
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Produits',
                      legendPosition: 'middle',
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: 'color',
                      modifiers: [['darker', 1.6]],
                    }}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                    role="application"
                    ariaLabel="Nivo bar chart demo"
                    barAriaLabel={(e) => `${e.id}: ${e.formattedValue} dans ${e.indexValue}`}
                  />
                </div>
              </div>
            )
          }
       </div>   

        
    );
};

export default StockBarChart;
