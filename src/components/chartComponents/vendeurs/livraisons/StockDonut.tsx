/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts';

// Les données que vous avez fournies
// const data = [
//   {
//     _id: "66c55f558fc376531ca561fe",
//     date: "2024-08-01T00:00:00.000Z",
//     pointVente: { _id: "669c379b9d4bbc80ab71e2ec", nom: "Power Book", emplacement: "kinshasa" },
//     produit: { _id: "669af6d8f3b3b93e14d001b1", nom: "wilki", prixVente: 9500 },
//     quantiteTotale: 4047,
//     montantTotal: 32376000,
//   },
//   {
//     _id: "66c55f558fc376531ca5620c",
//     date: "2024-08-05T00:00:00.000Z",
//     pointVente: { _id: "669c379b9d4bbc80ab71e2ec", nom: "Power Book", emplacement: "kinshasa" },
//     produit: { _id: "669adee5f3b3b93e14cffe4b", nom: "poutine", prixVente: 6000 },
//     quantiteTotale: 4562,
//     montantTotal: 20529000,
//   },
//   {
//     _id: "66c55f558fc376531ca5620f",
//     date: "2024-08-01T00:00:00.000Z",
//     pointVente: { _id: "669c379b9d4bbc80ab71e2ec", nom: "Power Book", emplacement: "kinshasa" },
//     produit: { _id: "669af478f3b3b93e14d00150", nom: "trump", prixVente: 9000 },
//     quantiteTotale: 3574,
//     montantTotal: 25018000,
//   },
// ];

// Couleurs pour chaque section du donut
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DonutChart = ({data}:{data:any[]}) => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="montantTotal"
        nameKey="produit.nom"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={5}
        label
      >
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        <Label
          value={`${data.reduce((acc: any, curr: { montantTotal: any; }) => acc + curr.montantTotal, 0).toLocaleString()} total`}
          position="center"
          className="text-2xl"
        />
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default DonutChart;
