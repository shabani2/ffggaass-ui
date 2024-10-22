import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface fakeMtvt {
  id: number;
  operation: 'vente' | 'livraison';
  pointVenteNom: 'goodness' | 'thankfullness' | 'God Love';
  produit: 'wilki' | 'trump' | 'poutine' | 'kuku' | 'mayayi';
  quantite: number;
  montant: number;
  statut: 'unvalidate' | 'validate';
}

interface BarChartProps {
  data: fakeMtvt[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const produits = ['wilki', 'trump', 'poutine', 'kuku', 'mayayi'];
  const pointVenteNames = ['goodness', 'thankfullness', 'God Love'];

  const ventesParProduit = produits.map(
    (produit) => data.filter((item) => item.produit === produit && item.operation === 'vente').length
  );
  const livraisonsParProduit = produits.map(
    (produit) => data.filter((item) => item.produit === produit && item.operation === 'livraison').length
  );

  const ventesParPointVente = pointVenteNames.map(
    (pointVente) => data.filter((item) => item.pointVenteNom === pointVente && item.operation === 'vente').length
  );
  const livraisonsParPointVente = pointVenteNames.map(
    (pointVente) => data.filter((item) => item.pointVenteNom === pointVente && item.operation === 'livraison').length
  );

  const produitChartData = {
    labels: produits,
    datasets: [
      {
        label: 'Ventes',
        data: ventesParProduit,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Livraisons',
        data: livraisonsParProduit,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
//@ts-ignore
  const pointVenteChartData = {
    labels: pointVenteNames,
    datasets: [
      {
        label: 'Ventes',
        data: ventesParPointVente,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Livraisons',
        data: livraisonsParPointVente,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Comparaison des opérations',
      },
    },
  };

  return (
    <Box sx={{  }}>
    {/* <h2>Comparaison des opérations par produit</h2> */}
    <Box sx={{ height: '350px', width: '100%' }}>
      <Bar data={produitChartData} options={options} />
    </Box>
    {/* <h2>Comparaison des opérations par point de vente</h2>
    <Box sx={{ height: '350px', width: '100%' }}>
      <Bar data={pointVenteChartData} options={options} />
    </Box> */}
  </Box>
  );
};

export default BarChart;
