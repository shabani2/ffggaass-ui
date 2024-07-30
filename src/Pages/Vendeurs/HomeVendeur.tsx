import { RootState } from '@/Redux/Store';
import React from 'react'
import { useSelector } from 'react-redux';

const HomeVendeur = () => {
  
  const initPs = useSelector((state:RootState)=>state.pointVente.initPS);
  return (
    <div>
      home from vendeur
      <div>{initPs && initPs}</div>
    </div>
  )
}

export default HomeVendeur
