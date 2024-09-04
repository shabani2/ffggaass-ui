/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1 } from '@/Redux/Admin/productSlice';
import { format } from 'date-fns';
import { Livraison, PointVente1 } from '@/Utils/dataTypes';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { fetchStockVariationsByPointVente, selectAllStockVariations } from '@/Redux/Admin/stockVariationSlice';





const StockVendeur = () => {
  const dispatch: AppDispatch = useDispatch();
 const stockVariation = useSelector((state:RootState)=>selectAllStockVariations(state)) 

  const loading = useSelector((state: RootState) => state.livraison.loading);
  //const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null);
 
  const user = useSelector(selectCurrentUser)

  
useEffect(()=>{
  user && dispatch(fetchStockVariationsByPointVente(user?.pointVente?._id))
 // dispatch(fetchProduits())
},[dispatch])
  
 

  const columns: GridColDef[] = [
    {
      field: 'numéro',
      headerName: 'N°',
      width: 70,
      renderCell: (params) => {
        const startIndex = paginationModel.page * paginationModel.pageSize;
        return startIndex + params.api.getSortedRowIds().indexOf(params.id) + 1;
      },
    },    
    { field: 'pointVente', headerName: 'Point de vente', width: 150, valueGetter: (params:PointVente1) => params.nom },
    { field: 'produit', headerName: 'Produit', width: 100, valueGetter: (params:Produit1) => params.nom },
    { field: 'quantiteLivre', headerName: 'Total Livraison', width: 150 },  
    { field: 'quantiteVendu', headerName: 'Total Vente', width: 150 }, 
    { field: 'solde', headerName: 'Reste en Stock', width: 150 }, 
 
    {
      field: 'createdAt',
      headerName: "Date d'opération",
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
   
  ];
 // console.log('stock',stockVariation ) 

  return (
    <div className='w-full h-screen p-8 bg-gray-200'>
      <Stack direction="row" spacing={3} mb={3}>
        <Typography variant="h4">Gestion du Stock dans le Depot central</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
         
        </Stack>
      </Stack>

      <Box>
        <div className='flex items-center justify-between mb-4'>
          <Typography variant="h5" className='text-blue-500'>Resume du stock</Typography>
          
        </div>

        {stockVariation .length > 0 ? (
          <DataGrid
            rows={stockVariation }
            columns={columns}  // {
              //   field: 'createdAt',
              //   headerName: "Date d'opération",
              //   width: 200,
              //   renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
              // },
             
            pagination
            paginationMode="client"
            rowCount={stockVariation .length}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
            rowSelectionModel={selectionModel}
            paginationModel={paginationModel}
            getRowId={(row) => row._id}
          />
        ) : (
          <div>No content</div>
        )}
      </Box>

     
    </div>
  );
};

export default StockVendeur;
