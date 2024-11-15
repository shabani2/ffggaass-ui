/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
//@ts-ignore
import { Box, Container, TextField, Typography, Avatar, InputAdornment,CircularProgress, IconButton } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Phone,Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '@/images/inaf.png';
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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
    backgroundColor: '#f7f7f7',
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
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    }}
  >
   <Avatar
  src={logo}
  alt="Logo"
  sx={{
    width: 120,
    height: 120,
    marginBottom: '20px',
    objectFit: 'contain',  // Empêche le rognage de l'image
    borderRadius: '50%',   // Rend l'image arrondie
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',  // Ajoute une ombre subtile pour un effet moderne
    backgroundColor: '#fff',  // Assure un fond uniforme dans le cas d'images transparentes
  }}
/>

    <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
      Se connecter
    </Typography>
    <Box
      component="form"
      autoComplete="none"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 2, width: '100%' }}
    >
      <TextField
        sx={{ mt: 2, mb: 2 }}
        fullWidth
        label="Numéro de téléphone"
        autoComplete="none"
        type="tel"
        placeholder="0827337733"
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
            message: 'Numéro de téléphone invalide',
          },
        })}
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />
      {/* <TextField
        sx={{ mt: 2, mb: 2 }}
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
      /> */}
       <TextField
      sx={{ mt: 2, mb: 2 }}
      fullWidth
      label="Mot de passe"
      type={showPassword ? 'text' : 'password'}
      autoComplete="current-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...register('password', { required: 'Mot de passe requis' })}
      error={!!errors.password}
      helperText={errors.password?.message}
    />
      <button
        disabled={loading}
        type="submit"
        className="px-4 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 w-full mt-4"
      >
        {loading ? <CircularProgress size={24} /> : 'Se connecter'}
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


