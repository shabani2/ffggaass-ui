/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/Redux/Store';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fetchCommandes, deleteCommande, selectAllCommandes } from '@/Redux/Admin/commandeSlice';
import * as yup from 'yup';
import { EntityId } from '@reduxjs/toolkit';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { Client, Commande, Livraison, PointVente1 } from '@/Utils/dataTypes';
import { fetchProduits, Produit1 } from '@/Redux/Admin/productSlice';
import { format } from 'date-fns';
import { fetchClients } from '@/Redux/Admin/clientSlice';

import { Box, Button, IconButton, Stack, Typography , Modal, TextField, MenuItem, Grid,Chip} from '@mui/material';



const validationSchema = yup.object({
  produit: yup.string().required('Produit is required'),
  client: yup.string().required('Client is required'),
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(0, 'Montant must be at least 0'),
});

const CommandePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const commandes = useSelector((state: RootState) => selectAllCommandes(state));
 
  const status = useSelector((state:RootState)=>state.commande.loading)
  
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  
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
    dispatch(fetchCommandes());
    dispatch(fetchProduits())
    dispatch(fetchClients())
    // Dispatch actions to fetch products and clients if necessary
  }, [dispatch]);  



 

  const handleDelete = (id: EntityId) => {
    dispatch(deleteCommande(id as string)).then(() => {
      dispatch(fetchCommandes());
    });
  };



  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date ',
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    { field: 'produit',
       headerName: 'Produit', 
       width: 200,
       valueGetter: (params : Produit1) => params?.nom,
       },
    { field: 'client',
       headerName: 'Client', 
       width: 250 ,
       valueGetter: (params : Client) => params?.nom+ ' '+params.postnom+' '+params.prenom,
      },
    { field: 'quantite', headerName: 'Quantité', width: 100 },
    { field: 'montant', headerName: 'Montant', width: 100 },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 150,
      renderCell: (params) => {
        const statut = params.value as string;
        return (
          //@ts-ignore
          <Chip color={status=='unvalidate' ? 'error' : 'success'} label={statut} size="small" />
         
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        const row = params.row as Commande;
        return (
          <>
            <IconButton onClick={() => handleOpenModal(row)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
        );
      },
    },
  ];

  
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
      <div className='min-w-10/12 p-7'>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Gestion de commandes</Typography>
        </Stack>
        <div>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </div>
          
        </Stack>    
        

        <div style={{ height: 500, width: '99%' }} className='mt-[25px]'>
          <Box>
            <Box className='flex justify-between mb-3'>
              <Typography className='m-3 text-4xl text-blue-500' sx={{fontSize:'2rem',margin:'3 0'}}>Liste des Commandes</Typography>
              <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" >
              Nouvelle commande
            </Button>
              </Box>
            <DataGrid
              rows={commandes}
              columns={columns}
              loading={status}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={selectionModel}
            />
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

export default CommandePage;
