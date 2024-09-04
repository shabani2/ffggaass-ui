/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';

import { Produit1 } from '@/Redux/Admin/productSlice';
import { format } from 'date-fns';
import { Livraison } from '@/Utils/dataTypes';
import { fetchAllStockLocals, selectAllStockLocals } from '@/Redux/Admin/stockLocalSlice';





const Stock = () => {
  const dispatch: AppDispatch = useDispatch();
 const stockLocal = useSelector((state:RootState)=>selectAllStockLocals(state)) 

  const loading = useSelector((state: RootState) => state.livraison.loading);
  //const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null);


 
  //const user = useSelector(selectCurrentUser)

  
useEffect(()=>{
  dispatch(fetchAllStockLocals())
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
    
    { field: 'produit', headerName: 'Produit', width: 100, valueGetter: (params:Produit1) => params.nom },
    { field: 'quantiteTotale', headerName: 'Quantité', width: 100 },  
 
    {
      field: 'createdAt',
      headerName: "Date d'opération",
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
   
  ];
  console.log('stock',stockLocal) 

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

        {stockLocal.length > 0 ? (
          <DataGrid
            rows={stockLocal}
            columns={columns}  // {
              //   field: 'createdAt',
              //   headerName: "Date d'opération",
              //   width: 200,
              //   renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
              // },
             
            pagination
            paginationMode="client"
            rowCount={stockLocal.length}
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

export default Stock;
