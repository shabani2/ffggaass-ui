import { selectSituationsByPointVente, selectLatestDate } from '@/Redux/Global/situationSlice';
import { RootState } from '@/Redux/Store';
import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Fonction pour obtenir le mois et l'année en cours
const getCurrentMonthYear = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // Les mois sont indexés de 0 à 11, donc on ajoute 1
  const year = now.getFullYear();
  return { month, year };
};

// Fonction pour obtenir la couleur en fonction des valeurs
const getBarColor = (value: number) => {
  if (value > 100) return '#FF6347'; // Couleur pour valeurs élevées
  if (value > 50) return '#FFD700'; // Couleur pour valeurs moyennes
  return '#32CD32'; // Couleur pour valeurs faibles
};

interface Props {
  pointVenteId: string; // Changez `unknown` en `string` si `pointVenteId` est un identifiant de type string
}

const ProductPerformanceChart: React.FC<Props> = ({ pointVenteId }) => {
  // Récupérer les situations pour le point de vente spécifié
  const situations = useSelector((state: RootState) => selectSituationsByPointVente(state, pointVenteId));
  
  // Récupérer la dernière date de situation
  const latestDate = useSelector(selectLatestDate);

  // Obtenir le mois et l'année en cours
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  
  // Filtrer les situations pour la dernière date et le mois en cours
  const situationsByLatestDate = situations.filter(situation => {
    const situationDate = new Date(situation.date);
    const situationMonth = situationDate.getMonth() + 1;
    const situationYear = situationDate.getFullYear();
    return situationMonth === currentMonth && situationYear === currentYear;
  });

  // Préparer les données pour l'histogramme
  const quantitiesByProduct = situationsByLatestDate.reduce((acc, situation) => {
    const productName = situation.produit.nom;

    if (!acc[productName]) {
      acc[productName] = { livraison: 0, vente: 0 };
    }

    if (situation.operation === 'livraison') {
      acc[productName].livraison += situation.montantTotal;
    } else if (situation.operation === 'vente') {
      acc[productName].vente += situation.montantTotal;
    }

    return acc;
  }, {} as Record<string, { livraison: number; vente: number }>);

  // Convertir les données pour Recharts
  const chartData = Object.entries(quantitiesByProduct).map(([productName, quantities]) => ({
    produit: productName,
    livraison: quantities.livraison,
    vente: quantities.vente,
  }));

  return (
    <div className='w-full h-full'>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Analyse des Performances par Produit pour le Point de Vente {pointVenteId} pour le mois de {currentMonth}/{currentYear}
      </h2>
      <div className='w-[80%] h-[80%]'>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          width={900}
          height={400}
        >
          <XAxis dataKey="produit" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="livraison"
            fill={({ value }) => getBarColor(value)}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="vente"
            fill={({ value }) => getBarColor(value)}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Source : Données internes de l'entreprise</p>
      </div>
    </div>
  );
};

export default ProductPerformanceChart;
