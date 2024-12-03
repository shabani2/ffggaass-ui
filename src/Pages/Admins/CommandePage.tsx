/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch } from '@/Redux/Store';
import { fetchCommandes, addCommande, selectAllCommandes } from '@/Redux/Admin/commandeSlice';
import { fetchProduits } from '@/Redux/Admin/productSlice';
import { fetchClients } from '@/Redux/Admin/clientSlice';
import { format } from 'date-fns';
import { Commande, Client, Produit } from '@/Utils/dataTypes';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
//@ts-ignore
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  //@ts-ignore
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);
  //@ts-ignore
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  //@ts-ignore
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  //@ts-ignore
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
       //@ts-ignore
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
    { field: 'produit', headerName: 'Produit', width: 150, valueGetter: (params: Produit) => params.nom },
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
  };

  const handleCloseModal = () => {
    setSelectedCommande(null);
  };

  // Calculer le montant à chaque changement de quantite ou prix
  useEffect(() => {
    const montant = formik.values.quantite * formik.values.prix;
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]); // Mettre à jour uniquement lorsque quantite ou prix changent

  return (
    <div className='h-screen w-full bg-gray-200 p-8'>
      <Stack direction="row" spacing={3} mb={3}>
        <Typography variant="h4">Gestion de commandes</Typography>
      </Stack>

      <Box>
        <div className='mb-4 flex items-center justify-between'>
          <Typography variant="h5" className='text-blue-500'>Tableau des commandes</Typography>
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => handleOpenModal('create')}>
            Nouvelle commande
          </button>
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

      <ToastContainer />
    </div>
  );
};

export default CommandePage;
