//import { selectAllUsers } from '@/Redux/Auth/userSlice';
import BarChart from '@/components/ui/BarChart';
import VenteCard from '@/components/ui/Cards/VenteCard';
import PieChart from '@/components/ui/PieChart';
import { fakeData } from '@/FakeData/FakeMvt';
//import { fakeData } from '@/FakeData/FakeMvt';
import {  RootState } from '@/Redux/Store';
import { Button, CardHeader } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import MixedBarChart from '@/components/MixedBarChart';

const Home = () => {
  //const dispatch = useDispatch<AppDispatch>();
 // const users = useSelector((state: RootState) => selectAllUsers(state));

 /*****************le useSelector(state:RootState) detiens les informations du client connecte */
 
  const auth = useSelector((state: RootState) => state.users);

  /************************************************************************************* */
  console.log('the token is here => : ',auth.token);
  localStorage.getItem('token') && console.log(localStorage.getItem('token'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { status, error, token } = useSelector((state: RootState) => state.users);
  console.log(status);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginError, setLoginError] = useState<string | null>(null);
  const fakemvt = fakeData;
  console.log(fakemvt)
  return (
    <>
      <div>
      home from admin
    </div>
    <div>
    {auth.token ? <p>Logged in as {`${auth.user?.nom } ${auth.user?.postnom} dont le role est : ${auth.user?.role }` }  </p> : <p>Not logged in</p>}
    </div>
  
    <Grid container spacing={3}>
  {/* Cards */}
  <Grid item lg={3} sm={6} xs={12}>
      <VenteCard diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <VenteCard diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <VenteCard diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
    </Grid>
    <Grid item lg={3} sm={6} xs={12}>
      <VenteCard diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
    </Grid>

    {/* Zone de graphiques */}
    <Grid item lg={7} xs={12} sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden', padding: 3, margin: 3 , marginTop:4}}>
    <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title="Livraisons/Ventes des Produits"
      />
      <BarChart data={fakeData} />
    </Grid>
    <Grid item lg={4} xs={12} sx={{ boxShadow: 3, borderRadius: '8px', overflow: 'hidden', padding: 3, height: 500, margin:3 }}>
      <PieChart data={fakeData} />
    </Grid>
  
  </Grid>


    </>
    
  )
}

export default Home
