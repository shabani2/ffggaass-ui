/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Produit, PointVente1 } from '@/Utils/dataTypes';
import {  DownloadIcon, UploadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { fetchCategories } from '@/Redux/Admin/categorySlice';
import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits } from '@/Redux/Admin/productSlice';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//@ts-ignore
import { fetchVentes, searchVentes, selectAllVentes } from '@/Redux/Admin/venteSlice';




const VentePage = () => {
  const dispatch :AppDispatch= useDispatch();
  const ventes= useSelector(selectAllVentes);  
  const user = useSelector(selectCurrentUser);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.vente.loading);
  const error = useSelector((state: RootState) => state.vente.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
 

  useEffect(() => {
    console.log('pvname=>',user?.pointVente?.nom)
    dispatch(fetchVentes());
  }, [dispatch]); 

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
    {
      field: 'produit',
      headerName: 'Produit',
      width: 100,
      valueGetter: (params: Produit) => params?.nom,
    },
    {
      field: 'pointVente',
      headerName: 'Point de Vente',
      width: 150,
      valueGetter: (params: PointVente1) => params?.nom,
    },
    { field: 'quantite', headerName: 'Quantité', width: 100 },
    
    // Nouvelle colonne "Coût d'achat" avec couleur bleue
    {
      field: 'coutAchat',
      headerName: 'Coût d\'achat',
      width: 150,
      renderCell: (params) => {
        const prix = params?.row.produit.prix;
        const vente = params.row;
        const coutAchat = prix * vente.quantite;
  
        return (
          <span style={{ color: '#4FC3F7' /* Bleu clair */ }}>
            {coutAchat}
          </span>
        );
      },
    },
  
    // Colonne "Prix de vente" avec couleur verte
    { 
      field: 'montant', 
      headerName: 'Prix de vente', 
      width: 150, 
      renderCell: (params) => (
        <span style={{ color: '#388E3C' /* Vert foncé */ }}>
          {params.value}
        </span>
      ),
    },
  
    // Colonne "Marge" avec couleur orange
    {
      field: 'Marge',
      headerName: 'Marge',
      width: 150,
      renderCell: (params) => {
        const vente = params.row;
        const cout = params?.row.produit.prix * vente.quantite;
        const prixVente = params?.row.produit.prixVente * vente.quantite;
        const marge = prixVente - cout;
  
        return (
          <span style={{ color: '#FF9800' /* Orange */ }}>
            {marge}
          </span>
        );
      },
    },
  
    {
      field: 'createdAt',
      headerName: "Date d'opération",
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  
  

  
  
  function handleDelete(id: any) {
    console.log('hello',id)
  }

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
  <>
     <div className='p-[2rem] w-full'>
     <div>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <h4 className='text-3xl text-bold'>Gestion de Vente</h4>            
          </Stack>
          <div>            
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <div>
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Button
                  color="inherit"
                  startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  importer
                </Button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </div>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={() => handleExport('xlsx')}>
                Exporter
              </Button>
            </Stack>
        </div>
        </Stack>
      </div>
      <div style={{ width: '95%',maxHeight:'500px'}}>
        
        <Box >
        <div className='flex flex-row justify-between w-full pt-5 pb-2'>
          <div className='w-2/5'>
            <h5 className='text-2xl text-blue-500'>fiche de vente journaliere</h5>
          </div>
          <div className='flex justify-end w-1/5'>
            {/* <button className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-500 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
              Nouveau livraison
            </button> */}
          </div>
        </div>
              
          {ventes.length>0 ?
           <DataGrid
           rows={ventes} 
           columns={columns}
           pagination
           paginationMode="client"
           rowCount={ventes.length}
           onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
           loading={loading}
           checkboxSelection
           onRowSelectionModelChange={(newSelection: React.SetStateAction<GridRowSelectionModel>) => {
             setSelectionModel(newSelection);
           }}
           getRowId={(row)=>row._id}
           rowSelectionModel={selectionModel}
           paginationModel={paginationModel}
         />
          :
          <div>no content</div>}
        </Box>

        
       </div>
       
     </div>
    
    

</>

  );
};

export default VentePage;



