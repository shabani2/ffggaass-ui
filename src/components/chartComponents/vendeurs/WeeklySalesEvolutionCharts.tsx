import React from 'react';
import { useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { RootState } from '@/Redux/Store'; // Chemin vers ton store
import { selectWeeklySalesEvolution } from '@/Redux/Global/situationSlice'; // Chemin vers ton slice

// Typage des données de la ligne du graphique
interface WeeklySalesData {
  weekStart: Date;
  montantTotal: number;
}

const WeeklySalesEvolutionChart: React.FC = () => {
  const weeklySalesData: WeeklySalesData[] = useSelector((state: RootState) =>
    selectWeeklySalesEvolution(state)
  );

  return (
    <div className="h-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Évolution hebdomadaire des montants générés par les ventes au cours des trois derniers mois
      </h2>
      <ResponsiveContainer width="100%" height={'80%'}>
        <LineChart data={weeklySalesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="weekStart"
            tickFormatter={(date: Date) =>
              new Date(date).toLocaleDateString('fr-FR', {
                month: 'short',
                day: 'numeric',
              })
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="montantTotal" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
      <footer className="mt-4 mb-3 text-gray-600">
       <p className='mb-5'>ventes hebdomadaires par produit</p> 
      </footer>
    </div>
  );
};

export default WeeklySalesEvolutionChart;
