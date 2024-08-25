import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, IconButton, Stack, Typography, Modal, TextField, MenuItem, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchLivraisons, selectAllLivraisons } from '@/Redux/Admin/livraisonSlice';
import { fetchCategories } from '@/Redux/Admin/categorySlice';
import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits, Produit1 } from '@/Redux/Admin/productSlice';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { Download as DownloadIcon, Upload as UploadIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { PointVente1, Livraison } from '@/Utils/dataTypes';

const LivraisonPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const livraisons = useSelector(selectAllLivraisons);  
  const user = useSelector(selectCurrentUser);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.livraison.loading);
  const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null);
  const [categories, setCategories] = useState<{ _id: string; nom: string }[]>([]);
  const [produits, setProduits] = useState<Produit1[]>([]);
  const [pointVente, setPointVente] = useState<PointVente1 | null>(null);
  const [category, setCategory] = useState<string>('');
  const [produit, setProduit] = useState<string>('');
  const [prix, setPrix] = useState<number | string>('');
  const [quantite, setQuantite] = useState<number | string>('');
  const [montant, setMontant] = useState<number | string>('');

  useEffect(() => {
    dispatch(fetchLivraisons());
    dispatch(fetchCategories()).then((res) => setCategories(res.payload));
    dispatch(fetchProduits()).then((res) => setProduits(res.payload));
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
    { field: 'produit', headerName: 'Produit', width: 100, valueGetter: (params) => params?.nom },
    { field: 'pointVente', headerName: 'Point de Vente', width: 150, valueGetter: (params) => params?.nom },
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
          <IconButton color="primary" onClick={() => handleOpenModal('edit', params.row as Livraison)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    console.log('Delete ID:', id);
  };

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
    <div className='w-full h-screen p-8 bg-gray-200'>
      <Stack direction="row" spacing={3} mb={3}>
        <Typography variant="h4">Gestion de livraisons</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
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
        </Stack>
      </Stack>

      <Box>
        <div className='flex items-center justify-between mb-4'>
          <Typography variant="h5" className='text-blue-500'>Tableau de bon de livraisons</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal('create')}>
            Nouveau livraison
          </Button>
        </div>

        {livraisons.filter((liv) => liv.pointVente._id !== user?.pointVente?._id).length > 0 ? (
          <DataGrid
            rows={livraisons.filter((liv) => liv.pointVente._id !== user?.pointVente?._id)}
            columns={columns}
            pagination
            paginationMode="client"
            rowCount={livraisons.length}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            loading={loading}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
            rowSelectionModel={selectionModel}
            paginationModel={paginationModel}
          />
        ) : (
          <div>No content</div>
        )}
      </Box>

      {/* Modal for creating/editing delivery */}
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
            {modalMode === 'create' ? 'Nouvelle Livraison' : 'Modifier Livraison'}
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
  );
};

export default LivraisonPage;
