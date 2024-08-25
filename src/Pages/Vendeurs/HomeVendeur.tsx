

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { FaDollarSign, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

import { filterSituationsByPointVente, selectAllSituationsLivraison } from '@/Redux/Admin/situationLivraisonSlice';
import { filterSituationsBy_PointVente, selectAllSituationsVente } from '@/Redux/Admin/situationVenteSlice';
import { addSituationsLivraison, addSituationsVente, selectAllSituations, selectPointVenteTrafficForPv, selectProductContributionForPv, selectWeeklySalesEvolution } from '@/Redux/Global/situationSlice';
import WeeklySalesEvolutionChart from '@/components/chartComponents/vendeurs/WeeklySalesEvolutionCharts';
import TrafficTableForPv from '@/components/chartComponents/vendeurs/ventes/TrafficTableForPv';
import DonutChartProd from '@/components/chartComponents/vendeurs/ventes/DonutChartProd';
import ProductPerformanceChart from '@/components/chartComponents/vendeurs/ventes/ ProductPerformanceChart';
import InfoCard from '@/components/InfoCard';


const HomeVendeur = () => {
  const dispatch :AppDispatch= useDispatch();
  const livraisons = useSelector(selectAllSituationsLivraison);  
  const user = useSelector(selectCurrentUser);
  
  const ventes= useSelector(selectAllSituationsVente);  
  const situations = useSelector((state: RootState) => selectAllSituations(state));
  const pointVenteTraffic = useSelector((state: RootState) => selectPointVenteTrafficForPv(state,user?.pointVente?._id));
  const weeklySalesData = useSelector(selectWeeklySalesEvolution);
  //const productContributions = useSelector(state => selectProductContributionForPv());
  const productContributions = useSelector((state: RootState) =>
    selectProductContributionForPv(state, user?.pointVente?._id)
  );

  useEffect(() => {
    if (user?.pointVente?._id) {
      console.log('pv=>', user?.pointVente);
  
      // Charger les situations filtrées par point de vente
      dispatch(filterSituationsByPointVente(user.pointVente._id)).then(() => {
        dispatch(addSituationsLivraison(livraisons));
      });
  
      dispatch(filterSituationsBy_PointVente(user.pointVente._id)).then(() => {
        dispatch(addSituationsVente(ventes));
      });
    }
  }, [dispatch, user?.pointVente?._id]); // Ajout de la dépendance user?.pointVente?._id pour éviter l'appel inutile
  
  useEffect(() => {
    // Ce useEffect se déclenche uniquement si les livraisons ou les ventes changent
    if (livraisons.length > 0) {
      dispatch(addSituationsLivraison(livraisons));
    }
  
    if (ventes.length > 0) {
      dispatch(addSituationsVente(ventes));
    }
  }, [dispatch, livraisons, ventes]); // Ajout de la dépendance aux livraisons et ventes pour garantir l'actualisation
  
  
  



  
  console.log('situation',situations)
  console.log('pointVenteTraffic',pointVenteTraffic)
  console.log('weekly',weeklySalesData)

  return (
    <>
      <div className="min-h-screen p-[2rem] bg-gray-400">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className=" bg-white rounded shadow h-[150px]">
              <InfoCard 
              title="Chiffre d'affaires" 
              icon={<FaDollarSign />} 
              amount="12,345" 
            />     
          </div>
          <div className=" bg-white rounded shadow h-[150px]">
            <InfoCard 
              title="Coût de revient" 
              icon={<FaMoneyBillWave />} 
              amount="8,000" 
            />      
            
          </div>
          <div className=" bg-white rounded shadow h-[150px]">
            <InfoCard 
            title="Bénéfice" 
            icon={<FaChartLine />} 
            amount="4,345" 
          />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="col-span-2 p-4 bg-white rounded shadow h-[500px] z-50"> 
          <ProductPerformanceChart pointVenteId={user?.pointVente?._id}/> 
            
          </div>
          <div className="p-4 bg-white rounded shadow h-[500px]"> 
          <DonutChartProd data={productContributions} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-white rounded shadow h-[500px]">
          <WeeklySalesEvolutionChart  />
          </div>
          <div className="p-4 bg-white rounded shadow h-[500px]">
            
            <div className="p-2">
              <h2 className="text-2xl text-blue-600">Résumé de vente par produit</h2>
            </div>
            <div className="overflow-auto max-h-[400px] z-10">           
              <div className="overflow-auto max-h-[400px] z-10">
                <TrafficTableForPv pointVenteId={user?.pointVente?._id}/>
              </div>
            </div>
          </div>

        </div>

      
    </div>
  </>
    
  )
}

export default HomeVendeur
