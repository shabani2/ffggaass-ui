/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react'
import { Box, Button, Container, TextField, Typography, Avatar, InputAdornment } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Phone, Lock } from '@mui/icons-material';
import logo from '@/images/ai-generated-8201392_1280.png'
import { useNavigate } from 'react-router-dom';
import { fetchUsers, loginUser, selectAllUsers } from '@/Redux/Auth/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';

interface IFormInput {
  phone: string;
  password: string;
  
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => selectAllUsers(state));
  const auth = useSelector((state: RootState) => state.users);
  useSelector((state: RootState) => state.users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loginError, setLoginError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors },reset } = useForm<IFormInput>();
  useEffect(() => {
    dispatch(fetchUsers());
    console.log(users);
  }, []);

  const onSubmit: SubmitHandler<IFormInput> = async data => {  
    
   const resultAction = await dispatch(loginUser({numero:data.phone,password:data.password}));
    if (loginUser.fulfilled.match(resultAction)) {
      //console.log('the connected user is => : ',auth)
      //console.log('Login succeeded:', resultAction.payload);
      console.log('token : ',localStorage.getItem('jwt'))
      reset();  
      navigate('/');      
      console.log(data);
      setLoginError(null);
    } else {
      if ((await resultAction).payload) {
        setLoginError( (await resultAction).payload as string);
      } else {
        setLoginError(await (resultAction).error?.message || 'Login failed');
      }
    }
    reset()
    
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: '45%',
          maxWidth: '500px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          src={logo}
          alt="Logo"
          sx={{
            width: 150,
            height: 150,
            margin: '0 auto 20px auto',
          }}
        />
        <Typography component="h1" variant="h5">
          Se connecter
        </Typography>
        <Box
          component="form"
          autoComplete='none'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
          sx={{ mt: 4, mb: 2 ,padding: '16px auto'}}
          className='m-3'
            margin="normal"
            fullWidth
            label="Numéro de téléphone"
            autoComplete="none"
            type='tel'
            placeholder='0827337733'
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Phone />
                </InputAdornment>
              ),
            }}
            {...register('phone', { 
              required: 'Numéro de téléphone requis',
              pattern: {
                value: /^[0-9]{10}$/, 
                message: 'Numéro de téléphone invalide'
              }
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
          <TextField
          sx={{ mt: 4, mb: 2 ,padding: '16px auto'}}
            className='m-3'
            margin="normal"
            fullWidth
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Lock />
                </InputAdornment>
              ),
            }}
            {...register('password', { required: 'Mot de passe requis' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
          className='p-3 m-3'
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4, mb: 2 ,padding: '16px auto'}}
          >
            Se connecter
          </Button>
        </Box>
      </Box>
    </Container>
  );}
  export default Login


