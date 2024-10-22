/* eslint-disable @typescript-eslint/ban-ts-comment */
 import React, { useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchVentes, selectAllVentes } from '@/Redux/Admin/venteSlice';
import { Vente } from '@/Utils/dataTypes';

// Interface pour les données groupées
interface ProduitData {
    total: number;
    [produit: string]: number | { total: number };
}

interface MoisData {
    [mois: string]: ProduitData;
}

interface GroupedData {
    [pointVente: string]: MoisData;
}

const colorPalette = [
    '#2a9d8f', // Couleur pour le produit 1
    '#264653', // Couleur pour le produit 2
    '#e9c46a', // Couleur pour le produit 3
    '#f4a261', // Couleur pour le produit 4
    '#e76f51'  // Couleur pour le produit 5
];

const VenteBarChart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const ventes = useSelector((state: RootState) => selectAllVentes(state)) as Vente[];

    useEffect(() => {
        dispatch(fetchVentes());
    }, [dispatch]);

    // Obtenir tous les noms de produits pour s'assurer qu'ils sont présents dans chaque point de vente et mois
    const allProduits = Array.from(new Set(ventes.map(vente => vente.produit.nom)));

    // Regrouper les ventes par point de vente et par mois
    const groupedData: GroupedData = ventes.reduce((acc: GroupedData, vente) => {
        const mois = new Date(vente.createdAt).toLocaleString('default', { month: 'short' }); // Mois en format court
        const pointVente = vente.pointVente.nom;
        const produit = vente.produit.nom;
        const montant = vente.montant;

        if (!acc[pointVente]) {
            acc[pointVente] = {};
        }
        
        if (!acc[pointVente][mois]) {
            acc[pointVente][mois] = { total: 0 };
        }

        if (!acc[pointVente][mois][produit]) {
            acc[pointVente][mois][produit] = 0;
        }
//@ts-ignore
        acc[pointVente][mois][produit] += montant;
        acc[pointVente][mois].total += montant;

        return acc;
    }, {} as GroupedData);

    // Transformer les données en format pour le graphique
    const data = Object.entries(groupedData).flatMap(([pointVente, moisData]) =>
        Object.entries(moisData).map(([mois, produitsData]) => ({
            pointVente: `${pointVente} (${mois})`,
            ...allProduits.reduce((acc, produit) => {
                //@ts-ignore
                acc[produit] = produitsData[produit] || 0; // S'il manque, mettre 0
                return acc;
            }, {}),
            total: produitsData.total
        }))
    );

    return (
        <div className="h-full">
            <div className="flex-grow h-[90%]">
                <ResponsiveBar
                    // data={data}
                    // keys={allProduits} // Utiliser tous les produits
                    // indexBy="pointVente"
                    // margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    // padding={0.3}
                    // valueScale={{ type: 'linear' }}
                    // indexScale={{ type: 'band', round: true }}
                    // colors={{ scheme: 'nivo' }} // Vous pouvez changer ceci par d'autres schémas de couleurs professionnels
                    // borderColor={{
                    //     from: 'color',
                    //     modifiers: [['darker', 1.6]]
                    // }}
                    data={data}
                    keys={allProduits} // Utiliser tous les produits
                    indexBy="pointVente"
                    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={colorPalette} // Utiliser la palette de couleurs définie
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]]
                    }}
                    
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Point de Vente et Mois',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Montant (CDF)',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                        from: 'color',
                        modifiers: [['darker', 1.6]]
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
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                    role="application"
                    ariaLabel="Graphique des ventes"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue} dans ${e.indexValue}`}
                />
            </div>
        </div>
    );
};

export default VenteBarChart;




// import React, { useEffect } from 'react';
// import { ResponsiveBar } from '@nivo/bar';
// import { ResponsiveLine } from '@nivo/line';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/Redux/Store';
// import { fetchVentes, selectAllVentes } from '@/Redux/Admin/venteSlice';
// import { Vente } from '@/Utils/dataTypes';

// // Interface pour les données groupées
// interface ProduitData {
//     totalMontant: number;
//     totalQuantite: number;
//     [produit: string]: number | { totalMontant: number; totalQuantite: number };
// }

// interface MoisData {
//     [mois: string]: ProduitData;
// }

// interface GroupedData {
//     [pointVente: string]: MoisData;
// }

// const VenteBarLineChart: React.FC = () => {
//     const dispatch: AppDispatch = useDispatch();
//     const ventes = useSelector((state: RootState) => selectAllVentes(state)) as Vente[];

//     useEffect(() => {
//         dispatch(fetchVentes());
//     }, [dispatch]);

//     const allProduits = Array.from(new Set(ventes.map((vente) => vente.produit.nom)));

//     // Regrouper les ventes par point de vente et par mois
//     const groupedData: GroupedData = ventes.reduce((acc: GroupedData, vente) => {
//         const mois = new Date(vente.createdAt).toLocaleString('default', { month: 'short' }); // Mois en format court
//         const pointVente = vente.pointVente.nom;
//         const produit = vente.produit.nom;
//         const montant = vente.montant;
//         const quantite = vente.quantite;

//         if (!acc[pointVente]) {
//             acc[pointVente] = {};
//         }

//         if (!acc[pointVente][mois]) {
//             acc[pointVente][mois] = { totalMontant: 0, totalQuantite: 0 };
//         }

//         if (!acc[pointVente][mois][produit]) {
//             acc[pointVente][mois][produit] = { totalMontant: 0, totalQuantite: 0 };
//         }

//         //@ts-ignore
//         acc[pointVente][mois][produit].totalMontant += montant;
//         //@ts-ignore
//         acc[pointVente][mois][produit].totalQuantite += quantite;
//         acc[pointVente][mois].totalMontant += montant;
//         acc[pointVente][mois].totalQuantite += quantite;

//         return acc;
//     }, {} as GroupedData);

//     // Transformer les données en format pour le graphique
//     const dataForBar = Object.entries(groupedData).flatMap(([pointVente, moisData]) =>
//         Object.entries(moisData).map(([mois, produitsData]) => ({
//             pointVente: `${pointVente} (${mois})`,
//             ...allProduits.reduce((acc, produit) => {
//                 //@ts-ignore
//                 acc[produit] = produitsData[produit]?.totalMontant || 0; // S'il manque, mettre 0
//                 return acc;
//             }, {}),
//             total: produitsData.totalMontant
//         }))
//     );

// //     // Préparer les données pour le graphique en courbe
//     const lineData = allProduits.map((produit) => ({
//         id: produit,
//         data: Object.entries(groupedData).flatMap(([pointVente, moisData]) =>
//             Object.entries(moisData).map(([mois, produitsData]) => ({
//                 x: `${pointVente} (${mois})`,
//                 //@ts-ignore
//                 y: produitsData[produit]?.totalQuantite || 0, // Utiliser la quantité
//             }))
//         )
//     }));

//     // Définir un jeu de couleurs commun
//     const colors = { scheme: 'nivo' }; // Vous pouvez aussi définir un tableau personnalisé de couleurs ici

//     return (
//         <div className="relative h-full">
//             <div className="absolute top-0 left-0 w-full h-full">
//                 <ResponsiveBar
//                     data={dataForBar}
//                     keys={allProduits}
//                     indexBy="pointVente"
//                     margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//                     padding={0.3}
//                     valueScale={{ type: 'linear' }}
//                     indexScale={{ type: 'band', round: true }}
//                     colors={colors} // Appliquer le même jeu de couleurs
//                     borderColor={{
//                         from: 'color',
//                         modifiers: [['darker', 1.6]]
//                     }}
//                     axisTop={null}
//                     axisRight={null}
//                     axisBottom={{
//                         tickSize: 5,
//                         tickPadding: 5,
//                         tickRotation: 0,
//                         legend: 'Point de Vente et Mois',
//                         legendPosition: 'middle',
//                         legendOffset: 32
//                     }}
//                     axisLeft={{
//                         tickSize: 5,
//                         tickPadding: 5,
//                         tickRotation: 0,
//                         legend: 'Montant (CDF)',
//                         legendPosition: 'middle',
//                         legendOffset: -40
//                     }}
//                     labelSkipWidth={12}
//                     labelSkipHeight={12}
//                     labelTextColor={{
//                         from: 'color',
//                         modifiers: [['darker', 1.6]]
//                     }}
//                     legends={[
//                         {
//                             dataFrom: 'keys',
//                             anchor: 'bottom-right',
//                             direction: 'column',
//                             justify: false,
//                             translateX: 120,
//                             translateY: 0,
//                             itemsSpacing: 2,
//                             itemWidth: 100,
//                             itemHeight: 20,
//                             itemDirection: 'left-to-right',
//                             itemOpacity: 0.85,
//                             symbolSize: 20,
//                             effects: [
//                                 {
//                                     on: 'hover',
//                                     style: {
//                                         itemOpacity: 1
//                                     }
//                                 }
//                             ]
//                         }
//                     ]}
//                     role="application"
//                     ariaLabel="Graphique des ventes"
//                     barAriaLabel={(e) => `${e.id}: ${e.formattedValue} dans ${e.indexValue}`}
//                 />
//             </div>

//             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//                 <ResponsiveLine
//                     data={lineData}
//                     margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//                     xScale={{ type: 'point' }}
//                     yScale={{
//                         type: 'linear',
//                         min: 'auto',
//                         max: 'auto',
//                         stacked: false,
//                         reverse: false
//                     }}
//                     axisTop={null}
//                     axisRight={null}
//                     axisBottom={null} // Cache l'axe X pour le graphique en ligne car il est géré par le bar chart
//                     axisLeft={null} // Cache l'axe Y du graphique en courbe
//                     enablePoints={true}
//                     pointSize={10}
//                     pointColor={{ theme: 'background' }}
//                     pointBorderWidth={2}
//                     pointBorderColor={{ from: 'serieColor' }}
//                     pointLabelYOffset={-12}
//                     useMesh={true}
//                     enableSlices="x"
//                     colors={colors} // Appliquer le même jeu de couleurs
//                 />
//             </div>
//         </div>
//     );
// };

// export default VenteBarLineChart;



