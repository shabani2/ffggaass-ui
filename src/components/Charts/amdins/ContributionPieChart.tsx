/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';
import { selectStockVariationWithMontants } from '@/Redux/Admin/stockVariationSlice'




const colorPalette = [
    '#2a9d8f', // Couleur pour le produit 1
    '#264653', // Couleur pour le produit 2
    '#e9c46a', // Couleur pour le produit 3
    '#f4a261', // Couleur pour le produit 4
    '#e76f51'  // Couleur pour le produit 5
];


const ContributionPieChart = () => {
    const stockVariationsWithMontants = useSelector(selectStockVariationWithMontants);

    // Calcul de la contribution de chaque point de vente au totalMontantVendu
    
    const data = stockVariationsWithMontants.reduce((acc: any[], item) => {
        const existingPointVente = acc.find(d => d.id === item.pointVente.nom);
        const montantVendu = item.montantVendu;
        
        if (existingPointVente) {
            existingPointVente.value += montantVendu;
        } else {
            acc.push({ id: item.pointVente.nom, label: item.pointVente.nom, value: montantVendu });
        }
        
        return acc;
    }, []);

    return (
        <div className="flex flex-col justify-between h-full">
            <div>
                <h2 className="mb-4 text-xl font-bold text-center text-blue-600">Contribution de chaque Points de Vente</h2>
            </div>
            <div className="flex-grow h-[80%]">
                <ResponsivePie
                    data={data}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={colorPalette} // Utiliser la palette de couleurs définie
                    borderWidth={1}
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: 'color',
                        modifiers: [['darker', 2]],
                    }}
                />
            </div>
            <div className="text-sm text-center text-gray-600">
                La répartition des ventes totales par points de vente. 
            </div>
        </div>
    );
};

export default ContributionPieChart;
