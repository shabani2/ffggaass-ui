/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  
  searchLivraisonsByPointVente, 
  selectAllLivraisons 
} from '@/Redux/Admin/livraisonSlice';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Produit, PointVente1, Livraison } from '@/Utils/dataTypes';
import { format } from 'date-fns';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';

import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import {  Produit1 } from '@/Redux/Admin/productSlice';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { filterSituationsByPointVente, selectAllSituationsLivraison } from '@/Redux/Admin/situationLivraisonSlice';
import StockDonut from '@/components/chartComponents/vendeurs/livraisons/StockDonut';
import { selectAllVentes } from '@/Redux/Admin/venteSlice';
import { selectAllSituationsVente,filterSituationsBy_PointVente } from '@/Redux/Admin/situationVenteSlice';
import { addSituationsLivraison, addSituationsVente, selectAllSituations } from '@/Redux/Global/situationSlice';

const StockVendeur = () => {
  const dispatch :AppDispatch= useDispatch();
  const livraisons = useSelector(selectAllSituationsLivraison);  
  const user = useSelector(selectCurrentUser);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.livraison.loading);
  const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const ventes= useSelector(selectAllSituationsVente);  
  const situations = useSelector((state: RootState) => selectAllSituations(state));

  useEffect(() => {
    //console.log('pv=>',user?.pointVente)
    dispatch(filterSituationsByPointVente(user?.pointVente?._id)).then(()=>{
     // dispatch(addSituationsLivraison(livraisons));
    });
    dispatch(filterSituationsBy_PointVente(user?.pointVente?._id)).then(()=>{
     // dispatch(addSituationsVente(ventes));
    })
    
  }, [dispatch]); 
 useEffect(()=>{
  dispatch(addSituationsVente(ventes));
  dispatch(addSituationsLivraison(livraisons));
 })

  const columnsLivraison: GridColDef[] = [
    {
      field: 'numéro',
      headerName: 'N°',
      width: 70,
      renderCell: (params) => {
        const startIndex = paginationModel.page * paginationModel.pageSize;
        return startIndex + params.api.getSortedRowIds().indexOf(params.id) + 1;
      },
    },
    {
      field: 'produit',
      headerName: 'Produit',
      width: 100,
      valueGetter: (params: Produit1) => params?.nom,
    },
   
    { field: 'quantiteTotale', headerName: 'Quantité', width: 100 },
    { field: 'montantTotal', headerName: 'Montant', width: 150 },   
    {
      field: 'createdAt',
      headerName: "Date d'opération",
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    
  ];
  console.log('stock',situations)

  
  return (
    <>
        <div className="p-6 space-y-6 bg-gray-300">
      {/* Première ligne : 3 cartes */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md h-[150px]"></div>
        <div className="bg-white rounded-lg shadow-md h-[150px]"></div>
        <div className="bg-white rounded-lg shadow-md h-[150px]"></div>
      </div>

      {/* Deuxième ligne : 2 blocs, premier bloc 2 fois plus grand */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 bg-white rounded-lg shadow-md h-[500px]">
        <div className='flex flex-row justify-between w-full pt-5 pb-2 pl-3 pr-2'>
          <div className='w-4/5 ml-5'>
            <h1 className='text-3xl text-blue-500'>Tableau de bon d'entree en stock</h1>
          </div>          
        </div>
        
        {livraisons.length>0 ?
           <DataGrid
           rows={livraisons} 
           columns={columnsLivraison}
           pagination
           paginationMode="client"
           rowCount={livraisons.length}
           onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
           loading={loading}
           checkboxSelection
           onRowSelectionModelChange={(newSelection: React.SetStateAction<GridRowSelectionModel>) => {
             setSelectionModel(newSelection);
           }}
           rowSelectionModel={selectionModel}
           paginationModel={paginationModel}
           getRowId={(row)=>row._id}
           sx={{
            overflow:'scroll',
            height:'400px',
            margin:'0 auto',// Définition de la hauteur minimale
            width:'95%'
          }}
         />
          :
          <div>no content</div>}
        
         
        </div>
        <div className="bg-white rounded-lg shadow-md h-[500px]">
          <StockDonut data={livraisons}/>
        </div>
      </div>

      {/* Troisième ligne : 2 colonnes, première colonne 2 fois plus grande */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 bg-white rounded-lg shadow-md h-[500px]">
        <div className='flex flex-row justify-between w-full pt-5 pb-2 pl-3 pr-2'>
          <div className='w-4/5 ml-5'>
            <h1 className='text-3xl text-blue-500'>cumul de vente par produit</h1>
          </div>          
        </div>
        
        {ventes.length>0 ?
           <DataGrid
           rows={ventes} 
           columns={columnsLivraison}
           pagination
           paginationMode="client"
           rowCount={ventes.length}
           onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
           loading={loading}
           checkboxSelection
           onRowSelectionModelChange={(newSelection: React.SetStateAction<GridRowSelectionModel>) => {
             setSelectionModel(newSelection);
           }}
           rowSelectionModel={selectionModel}
           paginationModel={paginationModel}
           getRowId={(row)=>row._id}
           sx={{
            overflow:'scroll',
            height:'400px',
            margin:'0 auto',// Définition de la hauteur minimale
            width:'95%'
          }}
         />
          :
          <div>no content</div>}
        
         
        </div>
        <div className="bg-white rounded-lg shadow-md h-[500px]">
          <StockDonut data={ventes}/>
        </div>
      </div>
     
    </div>
    </>
  )
}

export default StockVendeur
