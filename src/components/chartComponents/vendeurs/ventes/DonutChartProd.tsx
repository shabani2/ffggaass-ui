import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProductContribution {
  produit: string;
  quantite: number;
  montantTotal: number;
}

interface ProductContributionDonutProps {
  data: ProductContribution[];
}

const DonatChartProd: React.FC<ProductContributionDonutProps> = ({ data }) => {
  // Configuration des couleurs
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FF6384B3', '#36A2EBB3', '#FFCE56B3', '#4BC0C0B3', '#9966FFB3', '#FF9F40B3'
  ];

  // Extraction des labels et des valeurs
  const labels = data.map(item => item.produit);
  const values = data.map(item => item.montantTotal);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Contribution par Produit',
        data: values,
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const value = tooltipItem.raw;
            return ` ${value} €`;
          }
        }
      }
    },
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-center">Analyse des Ventes par Produit</h2>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-center text-gray-500">
        <p>
          Ce graphique montre la contribution de chaque produit aux ventes totales.
          Les données sont basées sur les ventes les plus récentes.
        </p>
      </div>
    </div>
  );
};

export default DonatChartProd;
