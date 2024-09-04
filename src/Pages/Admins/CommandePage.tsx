/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Stack, Typography, Modal, TextField, MenuItem, FormControl, InputLabel, Select, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch } from '@/Redux/Store';
import { fetchCommandes, addCommande, deleteCommande, selectAllCommandes } from '@/Redux/Admin/commandeSlice';
import { fetchProduits, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchClients, selectAllClients } from '@/Redux/Admin/clientSlice';
import { format } from 'date-fns';
import { Commande, Client } from '@/Utils/dataTypes';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EntityId } from '@reduxjs/toolkit';
import { Produit } from '@/Utils/dataTypes';

// Validation schema for the form
const validationSchema = yup.object({
  quantite: yup.number().required('Quantité is required').min(1, 'Quantité must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  client: yup.string().required('Client is required'),
});

const CommandePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const commandes = useSelector(selectAllCommandes);
  const produits = useSelector(selectAllProduits);
  const clients = useSelector(selectAllClients);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit| null>(null);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });

  // Initialize formik with initial values and validation schema
  const formik = useFormik({
    initialValues: {
      quantite: 0,
      montant: 0,
      produit: '',
      client: '',
      prix: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const commandeData = {
        ...values,
        produit: selectedProduit,
        client: values.client,
      };
      dispatch(addCommande(commandeData));
      dispatch(fetchCommandes());
      resetForm();
      handleCloseModal();
    },
  });

  useEffect(() => {
    dispatch(fetchCommandes());
    dispatch(fetchProduits());
    dispatch(fetchClients());
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
    { field: 'client', headerName: 'Client', width: 150, valueGetter: (params: Client) => params.nom },
    { field: 'produit', headerName: 'Produit', width: 150, valueGetter: (params: Produit1) => params.nom },
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
      headerName: 'Date de commande',
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
  ];

  const handleOpenModal = (mode: 'create' | 'edit', commande?: Commande) => {
    setModalMode(mode);
    setSelectedCommande(commande || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCommande(null);
  };

  const handleDeleteCommande = (id: EntityId) => {
    dispatch(deleteCommande(id));
  };

  const handleProduitChange = (event: { target: { value: any } }) => {
    const produitId = event.target.value as string;
    const selected = produits.find((produit) => produit?._id === produitId);
    setSelectedProduit(selected || null);
    formik.setFieldValue('produit', produitId);
    formik.setFieldValue('prix', selected?.prix);
  };

  useEffect(() => {
    const montant = formik.values.quantite * formik.values.prix;
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]);

  return (
    <div className='w-full h-screen p-8 bg-gray-200'>
      <Stack direction="row" spacing={3} mb={3}>
        <Typography variant="h4">Gestion de commandes</Typography>
      </Stack>

      <Box>
        <div className='flex items-center justify-between mb-4'>
          <Typography variant="h5" className='text-blue-500'>Tableau des commandes</Typography>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal('create')}>
            Nouvelle commande
          </Button>
        </div>

        {commandes.length > 0 ? (
          <DataGrid
            rows={commandes}
            columns={columns}
            pagination
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
            rowSelectionModel={selectionModel}
          />
        ) : (
          <div>No content</div>
        )}
      </Box>

      {/* Modal for creating/editing a Commande */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
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
          component='form' onSubmit={formik.handleSubmit}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {modalMode === 'create' ? 'Nouvelle Commande' : 'Modifier Commande'}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Client</InputLabel>
            <Select
              name="client"
              value={formik.values.client}
              onChange={formik.handleChange}
              error={formik.touched.client && Boolean(formik.errors.client)}
            >
              {clients.map((client) => (
                <MenuItem key={client._id} value={client._id}>
                  {client.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Produit</InputLabel>
            <Select
              name="produit"
              value={formik.values.produit}
              onChange={handleProduitChange}
              error={formik.touched.produit && Boolean(formik.errors.produit)}
            >
              {produits.map((produit) => (
                <MenuItem key={produit._id} value={produit._id}>
                  {produit.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            id="quantite"
            name="quantite"
            label="Quantité"
            type="number"
            value={formik.values.quantite}
            onChange={formik.handleChange}
            error={formik.touched.quantite && Boolean(formik.errors.quantite)}
            helperText={formik.touched.quantite && formik.errors.quantite}
          />

          <TextField
            fullWidth
            margin="normal"
            id="prix"
            name="prix"
            label="Prix"
            type="number"
            value={formik.values.prix}
            onChange={formik.handleChange}
            error={formik.touched.prix && Boolean(formik.errors.prix)}
            helperText={formik.touched.prix && formik.errors.prix}
            InputProps={{ readOnly: true }}
          />

          <TextField
            fullWidth
            margin="normal"
            id="montant"
            name="montant"
            label="Montant"
            type="number"
            value={formik.values.montant}
            onChange={formik.handleChange}
            error={formik.touched.montant && Boolean(formik.errors.montant)}
            helperText={formik.touched.montant && formik.errors.montant}
            InputProps={{ readOnly: true }}
          />

          <Stack direction="row" spacing={2} mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}
            </Button>
            <Button onClick={handleCloseModal} variant="outlined" color="secondary">
              Annuler
            </Button>
          </Stack>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CommandePage;
