import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Category, LocalShipping, ShoppingCart, Store, Settings, Person, Inventory } from '@mui/icons-material';
import {Link } from 'react-router-dom';
import routes from '@/Routes/AppRoute';




  const icons: { [key: string]: React.ReactElement } = {
    'Acceuil': <Home />,
    'Produit': <Category />,
    'Livraisons': <LocalShipping />,
    'Ventes': <ShoppingCart />,
    'Caisse': <Store />,
    'Stock': <Inventory />,
    'Configuration': <Settings />,
    'Profile': <Person />
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
