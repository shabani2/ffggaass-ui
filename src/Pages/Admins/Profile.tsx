/* eslint-disable @typescript-eslint/no-unused-vars */
import {  Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid,  Stack, Typography } from '@mui/material'
//import { UploadIcon, DownloadIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { findUserById,} from '@/Redux/Auth/userSlice';
import { AppDispatch, RootState } from '@/Redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import * as jwt_decode from 'jwt-decode'
import UserForm from '@/components/ui/UserForm';

const Profile = () => {

  const { user, status, error } = useSelector((state: RootState) => state.users);
  const [userId, setUserId] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decodedToken = jwt_decode.jwtDecode<{ userId: string }>(token);
      setUserId(decodedToken.userId);
      dispatch(findUserById(decodedToken.userId));
      console.log('user connected=>',user)
    }
  }, [dispatch]);


  return (
    <>
    <div className='p-[2rem] w-full bg-gray-200 h-screen'>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Profile</Typography>
         
        </Stack> 
      </Stack>
      <Stack spacing={3} >
      
      <Grid container spacing={3} gap={4} margin={3}>
        <Grid lg={3} md={6} xs={12}>
        <Card className='rounded-lg'>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={''} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.nom} {user?.postnom} {user?.prenom}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.role} {user?.pointVente?.nom}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.role!='Vendeur' ? "Depot central" : user?.pointVente?.emplacement}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
         </Card>
        </Grid>

        <Grid lg={8} md={6} xs={12} className='bg-gray-100 rounded shadow-lg h-40b-lg' >
          <UserForm user={user}/>
        </Grid>
      </Grid>
    </Stack>
    </div>
      
    </>
  )
}

export default Profile
