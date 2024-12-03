/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */



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
  const { totalMontantLivre, totalMontantVendu, difference, loading } = useSelector((state) => ({
    //@ts-ignore
    ...selectMontantsTotal(state),
    //@ts-ignore
    loading: state.loading,
  }));

  useEffect(()=>{
    dispatch(fetchAllStockVariations())
  
  },[dispatch])
 // console.log(`pv : ${totalMontantVendu}, cr: ${totalMontantLivre}`)
 if(loading){
  console.log('chargement')
 }

  return (
    <>
      <div className="min-h-screen p-[2rem] bg-gray-400">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded  shadow-custom-lg  h-[150px]">
            <InfoCard 
            title="Chiffre d'affaires" 
            icon={<FaDollarSign className='text-green-600'/>} 
            amount={!loading?totalMontantVendu:0} 
          />     
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
            title="Coût de revient" 
            icon={<FaMoneyBillWave className='text-red-600'/>} 
            amount={!loading?totalMontantLivre:0} 
          />      
          
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
          title="Marge brute" 
          icon={<FaChartLine className='text-blue-600' />} 
          amount={!loading?difference:0} 
        />
        </div>
      </div>


  <div className="grid grid-cols-1 gap-4 mb-4">
  {/* Colonne de gauche */}
  <div className="p-4 bg-gray-50 rounded shadow h-[500px] w-full">
    <h2 className="text-xl text-center text-blue-600">
      evaluation de chaque produit
    </h2>
    <StockBarChart />
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

      <div className='grid grid-cols-1 gap-4 mb-4'>
    <div className="p-4 bg-white rounded shadow h-[500px]">      
      <LivraisonBarChart />
    </div>
  </div>   
  </div>

  
  </>
    
  )
}

export default Home
