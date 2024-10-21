/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Box, CssBaseline, Divider, Avatar, useTheme, useMediaQuery, Button, Menu, MenuItem } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Menu as MenuIcon } from '@mui/icons-material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
// import { makeStyles} from '@mui/styles'
import logo from '@/images/ai-generated-8201392_1280.png'
import avatar1 from '@/images/man-156584_1280.png'
import './../global.css'
import AdminOnglet from '@/components/ui/AdminOnglet';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { findUserById, logoutUser} from '@/Redux/Auth/userSlice';
import VendeurOnglet from '@/components/ui/VendeurOnglet';
import { jwtDecode } from 'jwt-decode';
import { setInitPS } from '@/Redux/Admin/pointVenteSlice';
//import { LogoutIcon } from '@lucid/icons';
import LogoutIcon from '@mui/icons-material/Logout'
//import { makeStyles } from '@material-ui/core/styles';
import { FaBell } from 'react-icons/fa';
import { Badge,Tooltip } from '@mui/material';

const drawerWidth = 350;



const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // width: '100%',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  
}));



const MainLayout: React.FC = () => {

/********************les deux variables suivantes sont de state qui concerne l'utilisateurs connecte */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//@ts-ignore
const { user, status, error } = useSelector((state: RootState) => state.users);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
//@ts-ignore
const [userId, setUserId] = useState<string>('');
//@ts-ignore
const dispatch = useDispatch<AppDispatch>();
//@ts-ignore
//const user1 = useSelector(selectCurrentUser)

  
  // const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = jwtDecode<{ userId: string }>(token);
      setUserId(decodedToken.userId);
      dispatch(findUserById(decodedToken.userId));
      console.log('user connected=>',user)
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(()=>{
    if(user){
      dispatch(setInitPS(user?.pointVente?._id))
    }
  },[dispatch,user])


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  

  // Fonction pour ouvrir le menu
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout= ()=>{
    dispatch(logoutUser())
  }


  
  // Exemple de données pour le dropdown

  return (
    <Box sx={{ display: 'flex' , minWidth: '100vw'}}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={!isMobile && open} sx={{background:'#374151'}} >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
         <Typography variant="h6" noWrap component="div">
            {user?.role === 'Vendeur' ? user?.pointVente?.nom : 'Depot Central'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-center' }}>
          <Typography variant="body2" style={{ lineHeight: 1, margin : ' auto',marginRight:'22px' }} className=''>
              <Tooltip title={`${30} commandes en attente`} className=''>
                <IconButton aria-label="notifications">
                    <Badge badgeContent={30} color="secondary">
                        <FaBell size={32} className='text-gray-50' />
                    </Badge>
                </IconButton>
            </Tooltip>
            </Typography>
            <Typography variant="h6" noWrap>
              {`${user?.nom} ${user?.postnom}`}
            </Typography>
           
          </div>
        
        <div>
      <Button onClick={handleClick}>
        {/* {selectedItem || 'Select an option'} */}
        <Avatar alt="User" src={avatar1} sx={{ ml: 2 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>role : {user?.role}</MenuItem>
        <MenuItem> point vente : {user?.role === 'Vendeur' ? user?.pointVente?.nom : 'Depot Central'}</MenuItem>
        <Divider/>
        <MenuItem onClick={handleLogout}><LogoutIcon /> se deconnecter</MenuItem>
      </Menu>
    </div>
        </Toolbar>
      </AppBarStyled>
     
       <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1f2937',
        },
      }}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          ...theme.mixins.toolbar,
        }}
      >
        <IconButton onClick={handleDrawerToggle} className='text-white'>
          {theme.direction === 'ltr' ? <MenuIcon className='text-white' /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ textAlign: 'center', p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '76px', height: '76px', borderRadius: '50%',marginRight:'10px' }} />
        <Typography variant="h6" className='mr-5 text-white'>FFGGAASS</Typography>
      </Box>
      <Divider />
      <div className='flex-1'>
        {user?.role=='Vendeur' ? <VendeurOnglet/> : <AdminOnglet/>}
        {/* <AdminOnglet/> */}

      </div>
      <div className='p-3 flex'>
          <h6 className='text-gray-400 p-5'>Application realise par Inaf</h6>
      </div>
     
    </Drawer>      
      <Main open={!isMobile && open} className='bg-white ' sx={{minHeight:'100vh',width:`100%`,  padding:'0'}}>
        <DrawerHeader />
        <Outlet />
      </Main>
  </Box>
  );
};

export default MainLayout;

