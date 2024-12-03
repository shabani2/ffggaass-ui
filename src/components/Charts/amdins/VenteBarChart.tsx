/* eslint-disable @typescript-eslint/ban-ts-comment */
 import React, { useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchVentes, selectAllVentes } from '@/Redux/Admin/venteSlice';
import { Vente } from '@/Utils/dataTypes';

// Interface pour les données groupées
interface ProduitData {
    //@ts-ignore
    total: unknown;
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
    const allProduits = Array.from(
        new Set(
            ventes
                .filter(vente => vente.produit && typeof vente.produit.nom === 'string' && typeof vente.produit.prix === 'number') // Vérifie nom et prix
                .map(vente => ({
                    nom: vente.produit.nom,
                    prix: vente.produit.prix
                }))
        )
    );
    

    // Regrouper les ventes par point de vente et par mois
    const groupedData: GroupedData = ventes.reduce((acc: GroupedData, vente) => {
        // Vérifications générales pour les propriétés nécessaires
        if (!vente) {
            console.warn("Vente invalide détectée :", vente);
            return acc; // Ignore l'entrée si elle est invalide
        }
    
        const mois = vente.createdAt 
            ? new Date(vente.createdAt).toLocaleString('default', { month: 'short' })
            : "Inconnu"; // Par défaut à "Inconnu" si `createdAt` est manquant ou invalide
    
        const pointVenteNom = vente.pointVente?.nom || "Inconnu"; // Par défaut à "Inconnu" si `pointVente` ou `nom` est manquant
        const produitNom = vente.produit?.nom || "Produit Inconnu"; // Par défaut à "Produit Inconnu" si `produit` ou `nom` est manquant
        const montant = vente.montant || 0; // Par défaut à 0 si `montant` est manquant ou invalide
    
        // Initialisation des niveaux de l'objet si nécessaire
        if (!acc[pointVenteNom]) {
            acc[pointVenteNom] = {};
        }
    
        if (!acc[pointVenteNom][mois]) {
            acc[pointVenteNom][mois] = { total: 0 };
        }
    
        if (!acc[pointVenteNom][mois][produitNom]) {
            acc[pointVenteNom][mois][produitNom] = 0;
        }
    
        // Mise à jour des valeurs calculées
        //@ts-ignore
        acc[pointVenteNom][mois][produitNom] += montant;
        //@ts-ignore
        acc[pointVenteNom][mois].total += montant;
    
        return acc;
    }, {} as GroupedData);
    

    // Transformer les données en format pour le graphique
    // const data = Object.entries(groupedData).flatMap(([pointVente, moisData]) =>
    //     Object.entries(moisData).map(([mois, produitsData]) => ({
    //         pointVente: `${pointVente} (${mois})`,
    //         ...allProduits.reduce((acc, produit) => {
    //             //@ts-ignore
    //             acc[produit] = produitsData[produit] || 0; // S'il manque, mettre 0
    //             return acc;
    //         }, {}),
    //         total: produitsData.total
    //     }))
    // );

    let counter = 0;

const data = Object.entries(groupedData).flatMap(([pointVente, moisData]) =>
    Object.entries(moisData).map(([mois, produitsData]) => ({
        pointVente: `${pointVente} (${mois}) [${counter++}]`,
        ...allProduits.reduce((acc, produit) => {
            //@ts-ignore
            acc[produit.nom] = produitsData[produit.nom] || 0;
            return acc;
        }, {}),
        total: produitsData.total
    }))
);

const uniqueProduits = Array.from(new Set(allProduits.map(produit => produit.nom)));

    return (
        <div className="h-full">
            <div className="flex-grow h-[90%] bg-[#808b96]">
            <ResponsiveBar
    //@ts-ignore
    data={data}
    //@ts-ignore
    keys={uniqueProduits} // Utiliser tous les produits
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
        legend: 'Quantités',
        legendPosition: 'middle',
        legendOffset: 32,
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
         //@ts-ignore
        tickTextColor: 'white',  // Couleur blanche pour le texte de l'axe Y
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor="white"  // Couleur blanche pour le texte des labels des barres
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
            ],
            itemTextColor: 'white', // Couleur blanche pour le texte de la légende
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



