//import { Suspense, useState } from 'react'
//import { Loader, LogIn } from 'lucide-react'
import { Routes, Route } from 'react-router-dom'
import routes, { configRoute, vendeurRoute } from './Routes/AppRoute'
import MainLayout from './Layout/MainLayout'
import Login from './Pages/Auth/Login'
import Home from './Pages/Admins/Home'
import { Suspense, useEffect } from 'react'
import { Loader } from 'lucide-react'
import Generale from './Pages/Admins/Conf/Generale'
import Configuration from './Pages/Admins/Configuration'
import PrivateRoute from './components/ui/PrivateRoute'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './Redux/Store'
import { loadUserFromToken } from './Redux/Auth/userSlice'
import HomeVendeur from './Pages/Vendeurs/HomeVendeur'

function App() {
  const { user} = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  //const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    if(localStorage.getItem('jwt')){
      dispatch(loadUserFromToken());
      console.log('nous avons => : ',user)

    }
    
  }, []);

  
  
 

  return (
    
    <>
      <Routes>
       
        <Route path="/auth/login" element={<Login/>} />
       
        <Route  element={<MainLayout />}>
          <Route  element={<PrivateRoute/>}>
          { user?.role !='Vendeur' ? (<Route index element={<Home />} />) : (<Route path='/' index element={<HomeVendeur/>}></Route>)
          
          
          }
          
            
            
            {/* zone des onglets pour la configuration */}
            <Route path='/settings' element={<Configuration/>}>
            <Route index element={<Generale/>}></Route>            
              {configRoute.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
            </Route>
            {/* zone des onglets pour Admin */}
            {routes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
            {/* zone des onglets pour les vendeurs */}
            {vendeurRoute.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Route>
        
      </Routes>
    </>
  )
}

export default App
