import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
 
  searchLivraisonsByPointVente, 
  selectAllLivraisons, 
  updateLivraisonStatut
} from '@/Redux/Admin/livraisonSlice';
import { Box, Button, Chip, IconButton, Radio, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Produit, PointVente1, Livraison } from '@/Utils/dataTypes';
import {  DownloadIcon, UploadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { fetchCategories } from '@/Redux/Admin/categorySlice';
import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits, Produit1 } from '@/Redux/Admin/productSlice';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';


const LivraisonVendeur = () => {
  const dispatch :AppDispatch= useDispatch();
  const livraisons = useSelector(selectAllLivraisons);  
  const user = useSelector(selectCurrentUser);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.livraison.loading);
  const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    console.log('pv=>',user?.pointVente?.nom)
    dispatch(searchLivraisonsByPointVente(user?.pointVente?.nom));
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
      valueGetter: (params: Produit1) => params?.nom,
    },
    {
      field: 'pointVente',
      headerName: 'Point de Vente',
      width: 150,
      valueGetter: (params: PointVente1) => params?.nom,
    },
    { field: 'quantite', headerName: 'Quantité', width: 100 },
    { field: 'montant', headerName: 'Montant', width: 150 },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 150,
      renderCell: (params) => {
        const statut = params.value as string;
        return <Chip color={statut === 'unvalidate' ? 'error' : 'success'} label={statut} size="small" />;
      },
    },
    {
      field: '',
      headerName: 'Valider',
      width: 150,
      renderCell: (params) => {
        const statut = params.row.statut as string;
        const livraisonId = params.row._id; // Assurez-vous que l'ID de la livraison est présent dans `params.row`
          console.log('staut',statut)
        const handleChange = () => {
          
          if (statut !== 'validate') {
            const newStatut = 'validate';
            // Appel du thunk pour mettre à jour le statut
            dispatch(updateLivraisonStatut({ id: livraisonId, statut: newStatut })).then(() => {
              user && dispatch(searchLivraisonsByPointVente(user?.pointVente?.nom));
            });
          }
        };
    
        return (
          <Radio
            checked={statut === 'validate'}
            onChange={handleChange}
            disabled={statut === 'validate'}
            sx={{
              color: statut === 'validate' ? 'red' : 'blue', // Couleur rouge si "validate", sinon bleue
              '&.Mui-checked': {
                color: 'red', // Couleur rouge lorsque coché
              },
            }}
          />
        );
      },
    },
    
    {
      field: 'createdAt',
      headerName: "Date d'opération",
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 100,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton
    //         color="primary"
    //         // onClick={() => handleEditClick(params.row as MvtStock)}
    //       >
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton
    //         color="secondary"
    //         onClick={() => handleDelete(params.row.id)}
    //       >
    //         <DeleteIcon />
    //       </IconButton>
    //     </>
    //   ),
    // },
  ];
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  function handleDelete(id) {
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
      <div >
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Gestion d'entre en stock</Typography>            
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
                  Upload
                </Button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </div>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={() => handleExport('xlsx')}>
                Export
              </Button>
            </Stack>
        </div>
        </Stack>
      </div>
      <div style={{ width: '95%',maxHeight:'500px'}}>
        
        <Box >
        <div className='flex flex-row justify-between w-full pt-5 pb-2'>
          <div className='w-2/5'>
            <h1 className='text-3xl text-blue-500'>Tableau de bon d'entree en stock</h1>
          </div>
          <div className='flex justify-end w-1/5'>
            <Button variant="contained" color="primary">
              Nouveau livraison
            </Button>
          </div>
        </div>
              
          {livraisons.length>0 ?
           <DataGrid
           rows={livraisons} 
           columns={columns}
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
         />
          :
          <div>no content</div>}
        </Box>
    </div>
      </div>

</>

  );
};

export default LivraisonVendeur;




