import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Store, Settings, Person  } from '@mui/icons-material';
import {Link } from 'react-router-dom';
import  { configRoute } from '@/Routes/AppRoute';
import BlockIcon from '@mui/icons-material/Block';
import CategoryIcon from '@mui/icons-material/Category';


const icons: { [key: string]: React.ReactElement } = {
    'General': <Settings />,
    'Point de Vente': <Store />,
    'Category': <CategoryIcon/>,
    'Seuil': <BlockIcon />,
    'Vendeurs': <Person />,
    'Admin': <Person />
  };
  

const ConfigOnglet = () => {
  return (
    <>
    <List>
     {configRoute.map((route) => (
       <ListItem button key={route.path} component={Link} to={route.path}>
         <ListItemIcon sx={{color:'white',fontSize:'1.5em'}}>{icons[route.title]}</ListItemIcon>
         <ListItemText  sx={{color:'white',fontSize:'1.5em'}} primary={route.title} />
       </ListItem>
     ))}
   </List>
   </>
  )
}

export default ConfigOnglet
