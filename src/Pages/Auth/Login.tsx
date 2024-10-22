/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
//@ts-ignore
import { Box, Container, TextField, Typography, Avatar, InputAdornment,CircularProgress } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Phone, Lock } from '@mui/icons-material';
import logo from '@/images/ai-generated-8201392_1280.png'
import { useNavigate } from 'react-router-dom';
import { fetchUsers, loginUser, selectAllUsers } from '@/Redux/Auth/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';



interface IFormInput {
  phone: string;
  password: string;
  
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => selectAllUsers(state));
  const [loading, setLoading] = useState(false);
  const addStatus = useSelector((state:RootState)=>state.users.status)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@ts-ignore
  const auth = useSelector((state: RootState) => state.users);
//@ts-ignore
  useSelector((state: RootState) => state.users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@ts-ignore
  const [loginError, setLoginError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors },reset } = useForm<IFormInput>();
  useEffect(() => {
    dispatch(fetchUsers());
    console.log(users);
    
    //@ts-ignore
  }, []);

  useEffect(()=>{
    if (addStatus === 'failed') {
      toast.error(`Erreur: numero ou mot de passe incorrect`);
    }

  },[addStatus])

  const onSubmit: SubmitHandler<IFormInput> = async data => {  
    try {
      setLoading(true)
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
      
    } catch (error) {
      console.log(error)
      
    }finally{
      setLoading(false)
    }
    
   
    
  };

  return (
    <>
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
          {/* <Button
          className='p-3 m-3'
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 4, mb: 2 ,padding: '16px auto'}}
          >
             {loading ? <CircularProgress size={24} /> : 'se connecter'}
          </Button> */}

          <button
          disabled={loading}
           type="submit"  // Assurez-vous que le bouton est de type "submit"
            className=" px-4 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 w-full"
          >
           {loading ? <CircularProgress size={24} /> : 'se connecter'}
          </button>
        </Box>
      </Box>


    </Container>
    <ToastContainer 
       position="top-center"
       autoClose={5000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
      />
    </>
  
  );}
  export default Login


