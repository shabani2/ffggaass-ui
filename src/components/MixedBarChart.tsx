import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, CardHeader } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

export interface fakeMtvt {
  id: number;
  operation: 'vente' | 'livraison';
  pointVenteNom: 'goodness' | 'thankfullness' | 'God Love';
  produit: 'wilki' | 'trump' | 'poutine' | 'kuku' | 'mayayi';
  quantite: number;
  montant: number;
  statut: 'unvalidate' | 'validate';
}

interface MixedBarChartProps {
  data: fakeMtvt[];
}

const MixedBarChart: React.FC<MixedBarChartProps> = ({ data }) => {
  const chartRef = useRef<any>(null);

  // Assurez-vous que `data` est un tableau
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array');
    return null;
  }

  const pointVenteNames = ['goodness', 'thankfullness', 'God Love'];
  const montantTotaux = pointVenteNames.map(
    (name) =>
      data
        .filter((item) => item.pointVenteNom === name && item.operation === 'vente')
        .reduce((sum, item) => sum + item.montant, 0)
  );

  const chartData = {
    labels: pointVenteNames,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Montant total des ventes',
        data: montantTotaux,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Montant total des ventes (Ligne)',
        data: montantTotaux,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Montant total des ventes par point de vente',
      },
    },
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <CardHeader title="Montant total des ventes" />
      <Box sx={{ height: '100%' }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default MixedBarChart;
