import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocalShipping, Inventory, Person } from '@mui/icons-material';
import {Link } from 'react-router-dom';
import { vendeurRoute } from '@/Routes/AppRoute';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store';
import { HomeIcon, StoreIcon } from 'lucide-react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';


const icons: { [key: string]: React.ReactElement } = {
  'Dashboard': <HomeIcon />,
  'Livraisons': <LocalShipping />,
  'Fiche de ventes': <StoreIcon />,
  'Caisse': <PointOfSaleIcon />,
  'Stock': <Inventory />,
  'Profil': <Person />,
};

const VendeurOnglet = () => {
  const auth = useSelector((state: RootState) => state.users);
  auth.token && console.log(auth.user?.nom)
  return (
    <List>
    {vendeurRoute.map((route) => (
      <ListItem button key={route.path} component={Link} to={route.path}>
        <ListItemIcon sx={{ color: 'white', fontSize: '1.5em' }}>{icons[route.title]}</ListItemIcon>
        <ListItemText sx={{ color: 'white', fontSize: '1.5em' }} primary={route.title} />
      </ListItem>
    ))}
  </List>
  )
}

export default VendeurOnglet
