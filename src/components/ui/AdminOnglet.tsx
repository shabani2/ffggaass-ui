import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Category, LocalShipping, Store, Settings, Person, Inventory, People  } from '@mui/icons-material';
import {Link,useLocation, } from 'react-router-dom';
import routes from '@/Routes/AppRoute';
import {ReceiptIcon, ShoppingCart } from 'lucide-react';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';







  const icons: { [key: string]: React.ReactElement } = {
    'Acceuil': <Home />,
    'Produit': <Category />,
    'Journal de Livraisons': <LocalShipping />,
    'Journal Des Intrants': <ReceiptIcon />,
    'Livraison': <Store />,
    'Solde en Stock': <Inventory />,
    'Configuration': <Settings />,
    'Profile': <Person />,
    'Clients' : <People/>,
    'Commandes': <ShoppingCart/>,
    'Rapport de ventes' : <PointOfSaleIcon />,
    
  };
const AdminOnglet = () => {
  const location = useLocation();  // Utilisation du hook useLocation
  const activePath = location.pathname;
  return (
    <List
    sx={{
      margin : '0 15px',
      
    }}
    >
    {routes.map((route) => (
      <ListItem 
        button 
        key={route.path} 
        component={Link} 
        to={route.path}
        sx={{
          backgroundColor: activePath === route.path ? 'gray' : 'transparent', // Arrière-plan gris pour l'onglet actif
          '&:hover': {
            backgroundColor: 'gray', // Arrière-plan gris au survol
          },
          paddingLeft: '10px',  // Padding à gauche
          paddingRight: '10px', // Padding à droite
          paddingTop: '2px',    // Padding en haut
          paddingBottom: '2px', // Padding en bas
          borderRadius : '10px',
          marginBottom : '2px'
        }}
      >
        <ListItemIcon sx={{color:'white',fontSize:'1.5em'}}>
          {icons[route.title]}
        </ListItemIcon>
        <ListItemText sx={{color:'white',fontSize:'1.5em'}} primary={route.title} />
      </ListItem>
    ))}
  </List>
  );
  
}

export default AdminOnglet
