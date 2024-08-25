import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';

interface Perfomance {
  pointVente: string;
  montantTotal: number;
  quantiteTotale: number;
}

interface StackedBarChartProps {
  data: Perfomance[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  return (
    <div className="h-full">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Performance des Points de Vente</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pointVente" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="montantTotal" stackId="a" name="Montant Total (€)" fill="#1f77b4">
            <LabelList dataKey="montantTotal" position="top" className="text-xs" />
          </Bar>
          <Bar dataKey="quantiteTotale" stackId="a" name="Quantité Totale" fill="#ff7f0e">
            <LabelList dataKey="quantiteTotale" position="top" className="text-xs" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <footer className="mt-4 text-sm text-gray-500">
        Ce graphique montre la contribution relative des points de vente aux montants totaux générés et aux quantités totales de produits vendus ou livrés.
      </footer>
    </div>
  );
};

export default StackedBarChart;
