

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectCurrentUser } from '@/Redux/Auth/userSlice';

import { filterSituationsNotByPointVente, selectAllSituationsLivraison } from '@/Redux/Admin/situationLivraisonSlice';
import { selectAllSituationsVente,filterSituationsNotBy_PointVente } from '@/Redux/Admin/situationVenteSlice';
import { addSituationsLivraison, addSituationsVente, selectAllSituations, selectPerfomanceByPointVente, selectPointVenteContribution, selectPointVenteTraffic, selectProductPerformance, selectTotalVentesAndLivraisonsByCurrentMonth, selectTotalVentesAndLivraisonsByLatestDate } from '@/Redux/Global/situationSlice';
import StackedBarChart from '@/components/chartComponents/admins/StackedBarChart';
import PointVenteTrafficTable from '@/components/chartComponents/admins/PointVenteTrafficTable';
import ParetoChart from '@/components/chartComponents/admins/ParetoChart';
import DonutChart from '@/components/chartComponents/admins/DonutChart';
import InfoCard from '@/components/InfoCard';
import { FaDollarSign, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';



const Home = () => {
  const dispatch :AppDispatch= useDispatch();
  const livraisons = useSelector(selectAllSituationsLivraison);  
  const user = useSelector(selectCurrentUser);  
  const ventes= useSelector(selectAllSituationsVente);  
  const situations = useSelector((state: RootState) => selectAllSituations(state));
  const performances = useSelector(selectPerfomanceByPointVente);
  const pointVenteTraffic = useSelector((state: RootState) => selectPointVenteTraffic(state));
  const productPerformance = useSelector((state: RootState) => selectProductPerformance(state));
  const pointVenteContributions = useSelector((state: RootState) => selectPointVenteContribution(state));
const { totalVentes, totalLivraisons, difference } = useSelector(selectTotalVentesAndLivraisonsByLatestDate);


  useEffect(() => {
    console.log('pv=>',user?.pointVente)
    dispatch(filterSituationsNotByPointVente(user?.pointVente?._id)).then(()=>{
      dispatch(addSituationsLivraison(livraisons));
    }).then(()=>dispatch(filterSituationsNotBy_PointVente(user?.pointVente?._id)).then(()=>{
      dispatch(addSituationsVente(ventes));
     }))
    
    
  }, [dispatch]); 
 useEffect(()=>{
  dispatch(addSituationsVente(ventes));
  dispatch(addSituationsLivraison(livraisons));
 })

 

 


//  console.log('le total de  ventes:', situations.filter((s)=>s.operation=='vente').length);
console.log('le total de situation:', situations.filter((s)=>s.operation=='livraison').length);
  console.log('livraison',livraisons.length)
  console.log('vente',ventes.length)
  console.log('totaux',{totalLivraisons,totalVentes,difference})

  return (
    <>
      <div className="min-h-screen p-[2rem] bg-gray-400">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className=" bg-white rounded shadow h-[150px]">
            <InfoCard 
            title="Chiffre d'affaires" 
            icon={<FaDollarSign />} 
            amount={totalVentes} 
          />     
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
            title="Coût de revient" 
            icon={<FaMoneyBillWave />} 
            amount={totalLivraisons} 
          />      
          
        </div>
        <div className=" bg-white rounded shadow h-[150px]">
          <InfoCard 
          title="Marge brute" 
          icon={<FaChartLine />} 
          amount={difference} 
        />
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-white rounded shadow h-[500px]">
        <ParetoChart data={productPerformance} />
        </div>
        <div className="p-4 bg-white rounded shadow h-[500px]">
        <StackedBarChart data={performances} />
        </div>

      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4 bg-white rounded shadow h-[500px] z-50"> 
        <div className="p-2">
            <h2 className="text-2xl text-blue-600">Résumé de vente par point de vente</h2>
          </div>
          <div className="overflow-auto max-h-[400px] z-10">
            <PointVenteTrafficTable data={pointVenteTraffic} />
          </div>
          
           </div>
        <div className="p-4 bg-white rounded shadow h-[500px]"> 
        <DonutChart data={pointVenteContributions} />
        </div>
      </div>
    </div>
  </>
    
  )
}

export default Home
