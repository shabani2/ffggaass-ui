import { PointVenteContribution } from '@/Utils/dataTypes';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';



interface DonutChartProps {
  data: PointVenteContribution[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EF6', '#F65B5B'];

  // Calculer la somme totale des montants
  const totalMontant = data.reduce((acc, item) => acc + item.montantTotal, 0);

  // Ajouter le pourcentage de chaque point de vente
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: ((item.montantTotal / totalMontant) * 100).toFixed(2),
  }));

  return (
    <div className="h-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Contribution des Points de Vente à la Dernière Date</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="70%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="montantTotal"
            nameKey="pointVente"
            label={({ percentage }) => `${percentage}%`}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} €`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {/* <footer className="mt-4 text-sm text-gray-500">
        Ce graphique montre la contribution relative de chaque point de vente à la dernière date de la collection, exprimée en pourcentage du montant total.
      </footer> */}
    </div>
  );
};

export default DonutChart;
