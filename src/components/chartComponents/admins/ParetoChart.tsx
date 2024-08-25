import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LabelList,
} from 'recharts';

interface ProductPerformance {
  produit: string;
  quantiteTotale: number;
  prixVente: number;
}

interface ParetoChartProps {
  data: ProductPerformance[];
}

const ParetoChart: React.FC<ParetoChartProps> = ({ data }) => {
  // Calculer le rapport prix/quantité pour chaque produit
  const processedData = data.map(item => ({
    produit: item.produit,
    ratio: item.prixVente / item.quantiteTotale,
  }));

  // Trier les données par ratio décroissant
  const sortedData = [...processedData].sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="h-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Analyse des Produits les Plus Rentables</h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={sortedData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="produit" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ratio" stroke="#8884d8" />
          <BarChart data={sortedData}>
            <Bar dataKey="ratio" fill="#82ca9d">
              <LabelList dataKey="ratio" position="top" className="text-xs" />
            </Bar>
          </BarChart>
        </LineChart>
      </ResponsiveContainer>
      <footer className="mt-4 text-sm text-gray-500">
        Ce graphique de Pareto montre les produits avec le meilleur rapport prix de vente/quantité totale vendue, mettant en évidence les produits les plus rentables.
      </footer>
    </div>
  );
};

export default ParetoChart;
