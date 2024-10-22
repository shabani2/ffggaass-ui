import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Category, LocalShipping, Store, Settings, Person, Inventory, People  } from '@mui/icons-material';
import {Link } from 'react-router-dom';
import routes from '@/Routes/AppRoute';
import {ReceiptIcon, ShoppingCart } from 'lucide-react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';






  const icons: { [key: string]: React.ReactElement } = {
    'Acceuil': <Home />,
    'Produit': <Category />,
    'Fiche de Livraisons': <LocalShipping />,
    'Bon d\'entre': <ReceiptIcon />,
    'Bon de livraison': <Store />,
    'Stock': <Inventory />,
    'Configuration': <Settings />,
    'Profile': <Person />,
    'Clients' : <People/>,
    'Commandes': <ShoppingCart/>,
    'Rapport de ventes' : <PointOfSaleIcon />,
    
  };
const AdminOnglet = () => {
  return (
    <>
         <List>
          {routes.map((route) => (
            <ListItem button key={route.path} component={Link} to={route.path}>
              <ListItemIcon sx={{color:'white',fontSize:'1.5em'}}>{icons[route.title]}</ListItemIcon>
              <ListItemText  sx={{color:'white',fontSize:'1.5em'}} primary={route.title} />
            </ListItem>
          ))}
        </List>
    </>
  )
}

export default AdminOnglet
