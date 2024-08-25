/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
 
  searchLivraisonsByPointVente, 
  selectAllLivraisons 
} from '@/Redux/Admin/livraisonSlice';
import { Box, Button, IconButton, Stack, Typography , Modal, TextField, MenuItem, Grid} from '@mui/material';
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
//import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material';



const BonEntrePage = () => {
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

  const [produits, setProduits] = useState<Produit1[]>([]);
  const [pointVente, setPointVente] = useState<PointVente1 | null>(null);
  const [category, setCategory] = useState<string>('');
  const [produit, setProduit] = useState<string>('');
  const [prix, setPrix] = useState<number | string>('');
  const [quantite, setQuantite] = useState<number | string>('');
  const [montant, setMontant] = useState<number | string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [categories, setCategories] = useState<{ _id: string; nom: string }[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null)

  useEffect(() => {
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
    // {
    //   field: 'statut',
    //   headerName: 'Statut',
    //   width: 150,
    //   renderCell: (params) => {
    //     const statut = params.value as string;
    //     return (
    //       <Chip
    //         color={statut === 'unvalidate' ? 'error' : 'success'}
    //         label={statut}
    //         size="small"
    //       />
    //     );
    //   },
    // },
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
          <IconButton
            color="primary"
            // onClick={() => handleEditClick(params.row as MvtStock)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
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

  const handleOpenModal = (mode: 'create' | 'edit', delivery?: Livraison) => {
    setModalMode(mode);
    setSelectedDelivery(delivery || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  const handleSave = () => {
    // Handle save logic here
    handleCloseModal();
  };

  return (
  <>
   <div className='p-[2rem] w-full bg-gray-200 h-screen'>
     <div>
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
      <div style={{ width: '99%',maxHeight:'500px'}} className='mt-[25px]'>
        
        <Box >
        <div className='flex flex-row justify-between w-full pt-5 pb-2'>
          <div className='w-2/5'>
            <h1 className='text-3xl text-blue-500'>Tableau de bon d'entree en stock</h1>
          </div>
          <div className='flex justify-end w-1/5'>
            <Button 
              variant="contained" color="primary"
              onClick={()=>handleOpenModal('create')}
              >
              
              Nouvel entre
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

        <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className="max-w-lg p-6 mx-auto mt-10 bg-white rounded"
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            
            transform: 'translate(-40%, -50%)',
            width: '90%',
            maxWidth: '700px',
          }}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {modalMode === 'create' ? 'Bon d\'entree ' : 'Modifier Livraison'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Point de Vente"
                value={pointVente?._id || ''}
                onChange={(e) => setPointVente(e.target.value)}
              >
                <MenuItem value="1">Point de Vente 1</MenuItem>
                <MenuItem value="2">Point de Vente 2</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Catégorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Produit"
                value={produit}
                onChange={(e) => setProduit(e.target.value)}
              >
                {produits.map((prod) => (
                  <MenuItem key={prod._id} value={prod._id}>
                    {prod.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantité"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                disabled
              />
            </Grid>
          </Grid>
          <Box className="flex justify-end mt-4">
            <button 
            onClick={handleSave}
            className="px-4 py-2 m-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
            >
              {modalMode === 'create' ? 'Créer' : 'Modifier'}
            </button>
            <button 
            onClick={handleCloseModal}
            className="px-4 py-2 m-3 text-white bg-red-600 rounded-lg shadow-md bg--600 hover:bg-red-500">
              Annuler
            </button>
          </Box>
        </Box>
      </Modal>
       </div>
   </div>
     

</>

  );
};

export default BonEntrePage;




