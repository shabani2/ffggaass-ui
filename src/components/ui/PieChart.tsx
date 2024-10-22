import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Grid, Box, Typography, CardHeader } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface fakeMtvt {
  id: number;
  operation: 'vente' | 'livraison';
  pointVenteNom: 'goodness' | 'thankfullness' | 'God Love';
  produit: 'wilki' | 'trump' | 'poutine' | 'kuku' | 'mayayi';
  quantite: number;
  montant: number;
  statut: 'unvalidate' | 'validate';
}

interface PieChartProps {
  data: fakeMtvt[];
}

const pieColors = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(255, 206, 86, 0.6)',
];

const pieBorderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
];

const icons: Record<string, JSX.Element> = {
  goodness: <StoreIcon />,
  thankfullness: <FavoriteIcon />,
  'God Love': <LocalFloristIcon />,
};

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const pointVenteNames = ['goodness', 'thankfullness', 'God Love'];
  const pointVenteData = pointVenteNames.map(
    (name) => data.filter((item) => item.pointVenteNom === name).length
  );

  const chartData = {
    labels: pointVenteNames,
    datasets: [
      {
        data: pointVenteData,
        backgroundColor: pieColors,
        borderColor: pieBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Disable the default legend to use custom labels
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: 300,}}>
      <CardHeader title="Point de vente traffic" />
      <Box sx={{ height: '100%' }}>
        <Pie data={chartData} options={options} />
      </Box>
      <Grid container justifyContent="center" spacing={2}>
        {pointVenteNames.map((name, index) => (
          <Grid item key={index}>
            <Box display="flex" alignItems="center">
              {icons[name]}
              <Typography variant="body1" style={{ marginLeft: 8 }}>
                {name} ({pointVenteData[index]})
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PieChart;
