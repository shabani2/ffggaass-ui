import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export interface PointVenteTraffic {
  point_vente: string;
  produit: string;
  quantite: number;
  prix_vente: number;
}

interface PointVenteTrafficTableProps {
  data: PointVenteTraffic[];
}

const PointVenteTrafficTable: React.FC<PointVenteTrafficTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} className="h-full">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Point de Vente</TableCell>
            <TableCell>Produit</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Prix de Vente (fc)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.point_vente}</TableCell>
              <TableCell>{row.produit}</TableCell>
              <TableCell>{row.quantite}</TableCell>
              <TableCell>{row.prix_vente.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PointVenteTrafficTable;
