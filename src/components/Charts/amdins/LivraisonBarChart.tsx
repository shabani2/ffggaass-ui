/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchLivraisons, selectAllLivraisons } from '@/Redux/Admin/livraisonSlice';
import { Livraison } from '@/Utils/dataTypes';

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

// const LivraisonBarChart: React.FC = () => {
//     const dispatch: AppDispatch = useDispatch();
//     const livraisons = useSelector((state: RootState) => selectAllLivraisons(state)) as Livraison[];

//     useEffect(() => {
//         dispatch(fetchLivraisons());
//     }, [dispatch]);

//     const groupedData: GroupedData = livraisons.reduce((acc: GroupedData, livraison) => {
//         const mois = new Date(livraison.createdAt).toLocaleString('default', { month: 'short' });
//         const pointVente = livraison.pointVente.nom;
//         const produit = livraison.produit.nom;
//         const quantite = livraison.quantite;

//         if (!acc[pointVente]) {
//             acc[pointVente] = {};
//         }
        
//         if (!acc[pointVente][mois]) {
//             acc[pointVente][mois] = { total: 0 };
//         }

//         if (!acc[pointVente][mois][produit]) {
//             acc[pointVente][mois][produit] = 0;
//         }

//         acc[pointVente][mois][produit] += quantite;
//         acc[pointVente][mois].total += quantite;

//         return acc;
//     }, {} as GroupedData);

//     const data = Object.entries(groupedData).flatMap(([pointVente, moisData]) => 
//         Object.entries(moisData).map(([mois, produitsData]) => ({
//             pointVente: `${pointVente} (${mois})`,
//             ...Object.fromEntries(
//                 Object.entries(produitsData).filter(([key]) => key !== 'total')
//             ),
//             total: produitsData.total
//         }))
//     );

//     return (
//         <div className="h-full">
//             <h2 className="mb-4 text-xl font-bold text-center text-gray-800">
//                 Répartition des Quantités des Produits par Point de Vente et par Mois
//             </h2>
//             <div className='h-[90%]'>
//             <ResponsiveBar
//     data={data}
//     keys={Object.keys(data[0] || {}).filter(key => key !== 'pointVente' && key !== 'total')} // Exclure 'total'
//     indexBy="pointVente"
//     margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
//     padding={0.3}
//     valueScale={{ type: 'linear' }}
//     indexScale={{ type: 'band', round: true }}
//     colors={['#2a9d8f', '#264653', '#e9c46a', '#f4a261', '#e76f51']} // Palette de couleurs professionnelles
//     defs={[
//         {
//             id: 'dots',
//             type: 'patternDots',
//             background: 'inherit',
//             color: '#264653',
//             size: 4,
//             padding: 1,
//             stagger: true
//         },
//         {
//             id: 'lines',
//             type: 'patternLines',
//             background: 'inherit',
//             color: '#2a9d8f',
//             rotation: -45,
//             lineWidth: 6,
//             spacing: 10
//         }
//     ]}
//     fill={[
//         {
//             match: {
//                 id: 'total'
//             },
//             id: 'dots'
//         },
//         {
//             match: {
//                 id: 'quantite'
//             },
//             id: 'lines'
//         }
//     ]}
//     borderColor={{
//         from: 'color',
//         modifiers: [['darker', 1.6]]
//     }}
//     axisTop={null}
//     axisRight={null}
//     axisBottom={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: 'Point de Vente et Mois',
//         legendPosition: 'middle',
//         legendOffset: 32
//     }}
//     axisLeft={{
//         tickSize: 5,
//         tickPadding: 5,
//         tickRotation: 0,
//         legend: 'Quantité',
//         legendPosition: 'middle',
//         legendOffset: -40
//     }}
//     labelSkipWidth={12}
//     labelSkipHeight={12}
//     labelTextColor={{
//         from: 'color',
//         modifiers: [['darker', 1.6]]
//     }}
//     legends={[
//         {
//             dataFrom: 'keys',
//             anchor: 'bottom-right',
//             direction: 'column',
//             justify: false,
//             translateX: 120,
//             translateY: 0,
//             itemsSpacing: 2,
//             itemWidth: 100,
//             itemHeight: 20,
//             itemDirection: 'left-to-right',
//             itemOpacity: 0.85,
//             symbolSize: 20,
//             effects: [
//                 {
//                     on: 'hover',
//                     style: {
//                         itemOpacity: 1
//                     }
//                 }
//             ]
//         }
//     ]}
//     role="application"
//     ariaLabel="Graphique à barres pour la répartition des produits"
//     barAriaLabel={e => `${e.id}: ${e.formattedValue} dans ${e.indexValue}`}
// />

//             </div>
//         </div>
//     );
// };

const colorPalette = [
    '#2a9d8f', // Couleur pour le produit 1
    '#264653', // Couleur pour le produit 2
    '#e9c46a', // Couleur pour le produit 3
    '#f4a261', // Couleur pour le produit 4
    '#e76f51'  // Couleur pour le produit 5
];

const LivraisonBarChart: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const livraisons = useSelector((state: RootState) => selectAllLivraisons(state)) as Livraison[];

    useEffect(() => {
        dispatch(fetchLivraisons());
    }, [dispatch]);

    // Obtenir tous les noms de produits pour s'assurer qu'ils sont présents dans chaque point de vente et mois
    const allProduits = Array.from(new Set(livraisons.map(livraison => livraison.produit.nom)));

    // Regrouper les livraisons par point de vente et par mois
    const groupedData: GroupedData = livraisons.reduce((acc: GroupedData, livraison) => {
        const mois = new Date(livraison.createdAt).toLocaleString('default', { month: 'short' });
        const pointVente = livraison.pointVente.nom;
        const produit = livraison.produit.nom;
        const quantite = livraison.quantite;

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
        acc[pointVente][mois][produit] += quantite;
        acc[pointVente][mois].total += quantite;

        return acc;
    }, {} as GroupedData);

    // Assurer que tous les produits apparaissent avec une quantité de 0 s'ils ne sont pas présents
    const completeData = Object.entries(groupedData).flatMap(([pointVente, moisData]) => 
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
            <h2 className="mb-4 text-xl font-bold text-center text-blue-600">
                Répartition des Quantités des Produits par Point de Vente et par Mois
            </h2>
            <div className='h-[90%]'>
                <ResponsiveBar
                    // data={completeData}
                    // keys={allProduits} // Utiliser tous les produits
                    // indexBy="pointVente"
                    // margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                    // padding={0.3}
                    // valueScale={{ type: 'linear' }}
                    // indexScale={{ type: 'band', round: true }}
                    // colors={['#2a9d8f', '#264653', '#e9c46a', '#f4a261', '#e76f51']}
                    // borderColor={{
                    //     from: 'color',
                    //     modifiers: [['darker', 1.6]]
                    // }}
                    data={completeData}
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
                        legend: 'Quantité',
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
                    ariaLabel="Graphique à barres pour la répartition des produits"
                    barAriaLabel={e => `${e.id}: ${e.formattedValue} dans ${e.indexValue}`}
                />
            </div>
        </div>
    );
};


export default LivraisonBarChart;
