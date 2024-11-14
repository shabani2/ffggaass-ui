/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';

import { fetchProduits, Produit1 } from '@/Redux/Admin/productSlice';
import { format } from 'date-fns';
//import { Livraison } from '@/Utils/dataTypes';
import { fetchAllStockLocals, selectAllStockLocals } from '@/Redux/Admin/stockLocalSlice';

import { DownloadIcon, UploadIcon } from 'lucide-react';
import { exportMvtStock, fetchMvtStocks, importMvtStock } from '@/Redux/Admin/mvtStockSlice';
import { fetchCategories } from '@/Redux/Admin/categorySlice';
//import { Button } from '@/components/ui/button';





const Stock = () => {
  const dispatch: AppDispatch = useDispatch();
 const stockLocal = useSelector((state:RootState)=>selectAllStockLocals(state)) 

  const loading = useSelector((state: RootState) => state.livraison.loading);
  //const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@ts-ignore
 // const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null);


 
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
  
  
  const error = useSelector((state: RootState) => state.livraison.error);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    dispatch(exportMvtStock(format)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const url = window.URL.createObjectURL(new Blob([action.payload]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `mvtStock.${format}`);
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      dispatch(importMvtStock(file));
      dispatch(fetchMvtStocks());
      dispatch(fetchProduits());
      dispatch(fetchCategories());
    }
  };

  return (
    <div className='h-screen w-full bg-gray-200 p-8'>
     <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <h3 className='text-2xl font-bold' >Situation en stock</h3>
        </Stack>
        <div>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={inputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          
          <Button
            color="inherit"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
            disabled={loading}
          >
            Upload
          </Button>

          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          <Button
            color="inherit"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('xlsx')}
          >
            Export
          </Button>
        </div>
          </Stack>
        </div>
          
        </Stack>  

      <Box>
        {/* <div className='mb-4 flex items-center justify-between'>
          <Typography variant="h5" className='text-blue-500'>Situation du stock general</Typography>
          
        </div> */}

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
