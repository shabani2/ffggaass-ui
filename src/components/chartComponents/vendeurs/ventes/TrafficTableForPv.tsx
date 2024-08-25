import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store'; // Assurez-vous d'importer RootState depuis votre store
import { selectPointVenteTrafficForPv } from '@/Redux/Global/situationSlice'; // Importez votre sélecteur ici
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

// Définissez le type TrafficPv si ce n'est pas déjà fait


interface Props {
  pointVenteId: unknown;
}

const TrafficTableForPv: React.FC<Props> = ({ pointVenteId }) => {
  // Utilisez le sélecteur pour obtenir les données
  const trafficData = useSelector((state: RootState) =>
    selectPointVenteTrafficForPv(state, pointVenteId)
  );

  return (
    <TableContainer component={Paper} className="h-full">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Point de Vente</TableCell>
            <TableCell>Produit</TableCell>
            <TableCell align="right">Quantité</TableCell>
            <TableCell align="right">Montant Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trafficData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.pointVente}</TableCell>
              <TableCell>{data.produit}</TableCell>
              <TableCell align="right">{data.quantite}</TableCell>
              <TableCell align="right">{data.montantTotal.toFixed(2)} $</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrafficTableForPv;
