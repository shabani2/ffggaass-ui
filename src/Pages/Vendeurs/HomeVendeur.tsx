/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { FaDollarSign, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { fetchStockVariationsByPointVente, selectAllStockVariations, selectMontantsTotalForPointVente, selectStockVariationWithMontants } from '@/Redux/Admin/stockVariationSlice';
import { AppDispatch, RootState } from '@/Redux/Store';
import { useDispatch, useSelector } from 'react-redux';

import InfoCard from '@/components/InfoCard';
import { useEffect } from 'react';


const HomeVendeur = () => {
  const dispatch: AppDispatch = useDispatch();
  const stockVariation = useSelector((state:RootState)=>selectAllStockVariations(state))
   const stockVariationsWithMontants = useSelector(selectStockVariationWithMontants);
  
 
   useEffect(()=>{
   user &&  dispatch(fetchStockVariationsByPointVente(user?._id))
    // dispatch(fetchProduits())
   },[dispatch])
 
  const user = useSelector(selectCurrentUser); 
  //@ts-ignore 
  const { totalMontantLivre, totalMontantVendu, difference } =user&& useSelector(selectMontantsTotalForPointVente(user.pointVente?._id));
 

  return (
    <>
      <div className="min-h-screen p-[2rem] bg-gray-400">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className=" bg-white rounded shadow h-[150px]">
              <InfoCard 
              title="Chiffre d'affaires" 
              icon={<FaDollarSign />} 
              amount={totalMontantVendu} 
            />     
          </div>
          <div className=" bg-white rounded shadow h-[150px]">
            <InfoCard 
              title="Coût de revient" 
              icon={<FaMoneyBillWave />} 
              amount={totalMontantLivre}
            />      
            
          </div>
          <div className=" bg-white rounded shadow h-[150px]">
            <InfoCard 
            title="Bénéfice" 
            icon={<FaChartLine />} 
          amount={difference}
          />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="col-span-2 p-4 bg-white rounded shadow h-[500px] z-50"> 
          {/* <ProductPerformanceChart pointVenteId={user?.pointVente?._id}/>  */}
            
          </div>
          <div className="p-4 bg-white rounded shadow h-[500px]"> 
          {/* <DonutChartProd data={productContributions} /> */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-white rounded shadow h-[500px]">
          {/* <WeeklySalesEvolutionChart  /> */}
          </div>
          <div className="p-4 bg-white rounded shadow h-[500px]">
            
            <div className="p-2">
              <h2 className="text-2xl text-blue-600">Résumé de vente par produit</h2>
            </div>
            <div className="overflow-auto max-h-[400px] z-10">           
              <div className="overflow-auto max-h-[400px] z-10">
                {/* <TrafficTableForPv pointVenteId={user?.pointVente?._id}/> */}
              </div>
            </div>
          </div>

        </div>

      
    </div>
  </>
    
  )
}

export default HomeVendeur


