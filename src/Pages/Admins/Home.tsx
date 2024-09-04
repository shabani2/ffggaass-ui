


// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fetchAllStockVariations, selectMontantsTotal } from '@/Redux/Admin/stockVariationSlice';
import { AppDispatch } from '@/Redux/Store';
import ContributionPieChart from '@/components/Charts/amdins/ContributionPieChart';
import LivraisonBarChart from '@/components/Charts/amdins/LivraisonBarChart';
import VenteBarChart from '@/components/Charts/amdins/VenteBarChart';
import StockBarChart from '@/components/Charts/amdins/stockBarChart';
import InfoCard from '@/components/InfoCard';
import { useEffect } from 'react';
import { FaDollarSign, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';



const Home = () => {
  const dispatch: AppDispatch = useDispatch();
// const stockVariation = useSelector((state:RootState)=>selectAllStockVariations(state))
 // const stockVariationsWithMontants = useSelector(selectStockVariationWithMontants);
  const { totalMontantLivre, totalMontantVendu, difference } = useSelector(selectMontantsTotal);
  

  useEffect(()=>{
    dispatch(fetchAllStockVariations())
   // dispatch(fetchProduits())
  },[dispatch])
 

  return (
    <>
      <div className="min-h-screen p-[2rem] bg-gray-400">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded  shadow-custom-lg  h-[150px]">
            <InfoCard 
            title="Chiffre d'affaires" 
            icon={<FaDollarSign className='text-green-600'/>} 
            amount={totalMontantVendu} 
          />     
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
            title="Coût de revient" 
            icon={<FaMoneyBillWave className='text-red-600'/>} 
            amount={totalMontantLivre} 
          />      
          
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
          title="Marge brute" 
          icon={<FaChartLine className='text-blue-600' />} 
          amount={difference} 
        />
        </div>
      </div>


      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-gray-50 rounded shadow h-[500px] ">
        {/* <VenteBarChart/> */}
        <h2 className='text-xl text-center text-blue-600'>Situation de stock pour chaque produit</h2>
        <StockBarChart/>
        </div>
        <div className="p-4 bg-white rounded shadow h-[500px] col-span-2">
          
        <LivraisonBarChart/>
        </div>

      </div>


      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-white rounded shadow h-[500px]  col-span-2">
        <h2 className='text-xl text-center text-blue-600'>Repartition de vente de produits par boutique</h2>
        <VenteBarChart/>
        </div>
        <div className="p-4 bg-white rounded shadow h-[500px] col-span-1">
        <ContributionPieChart/>
        </div>

      </div>

  </div>
  </>
    
  )
}

export default Home
