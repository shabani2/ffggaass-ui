/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, Stack, Typography, Modal, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
import { addLivraison, fetchExcludedLivraisons, selectAllLivraisons } from '@/Redux/Admin/livraisonSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Livraison, PointVente1 } from '@/Utils/dataTypes';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { fetchPointVentes, selectAllPointVentes } from '@/Redux/Admin/pointVenteSlice';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validationSchema = yup.object({
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  category: yup.string().required('Category is required'),
});

const LivraisonPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const livraisons = useSelector(selectAllLivraisons);  
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.livraison.loading);
  const error = useSelector((state: RootState) => state.livraison.error);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //@ts-ignore
  const [selectedDelivery, setSelectedDelivery] = useState<Livraison | null>(null);
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const pointventes = useSelector((state: RootState) => selectAllPointVentes(state));
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const user = useSelector(selectCurrentUser)
  const addStatus = useSelector((state: RootState) => state.livraison.status);
  

  const formik = useFormik({
    initialValues: {
      quantite: 0,
      montant: 0,
      produit: '',
      category: '',
      prix: 0,
      pointvente:''
    },
    validationSchema: validationSchema,
    onSubmit: (values,{resetForm}) => {
      const livraisonData = { ...values, produit: selectedProduit };
      const data = {        
        quantite:livraisonData.quantite,
        montant:livraisonData.montant ,
        produit:livraisonData?.produit,
        pointVente:livraisonData.pointvente
        }
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     //@ts-ignore     
      
      dispatch(addLivraison(data)).then((rep)=>{
        dispatch(fetchExcludedLivraisons(user?.pointVente?.nom)).then((rep)=>{
          console.log('rep',rep.payload)
        });  
        
        console.log('data==> : ', rep);
      });
      
      resetForm();
      handleCloseModal()
    },
  });
  
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduits());
    dispatch(fetchPointVentes())
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchExcludedLivraisons(user?.pointVente?.nom)).then((rep)=>{
      console.log('rep',rep.payload)
    }); 
    //@ts-ignore   
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
    { field: 'pointVente', headerName: 'Point de Vente', width: 150, valueGetter: (params:PointVente1) => params.nom },
    { field: 'produit', headerName: 'Produit', width: 100, valueGetter: (params:Produit1) => params.nom },
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
    // {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   width: 100,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton color="primary" onClick={() => handleOpenModal('edit', params.row as Livraison)}>
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
    //         <DeleteIcon />
    //       </IconButton>
    //     </>
    //   ),
    // },
  ];
  //console.log('user pv name',user?.pointVente?.nom)

  // const handleDelete = (id: string) => {
  //   dispatch(deleteLivraison((id))).then(()=>{
  //    // dispatch(fetchLivraisons())
  //   // console.log('rep',rep.payload)
  //     dispatch(fetchCategories());
  //     dispatch(fetchProduits());
  //     dispatch(fetchPointVentes())
  //   })
  // };

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
  
  useEffect(() => {
    if (addStatus === 'failed') {
      toast.error(`Erreur: la quantite en stock est inferieur pour accepter cette operation`);
    }
  }, [addStatus, error]);


  const handleCategoryChange = (event: { target: { value: any } }) => {
    const categoryId = event.target.value as string;
    formik.setFieldValue('category', categoryId);
    setFilteredProduits(produits.filter((produit: Produit1) => produit.category._id === categoryId));
    formik.setFieldValue('produit', '');
    formik.setFieldValue('prix', 0);
    formik.setFieldValue('quantite',0)
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
    //@ts-ignore
  }, [formik.values.quantite, formik.values.prix]);  

  

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

        {livraisons.length > 0 ? (
          <DataGrid
            rows={livraisons}
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
            getRowId={(row) => row._id}
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
          component='form' onSubmit={formik.handleSubmit}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {modalMode === 'create' ? 'Nouvelle Livraison' : 'Modifier Livraison'}
          </Typography>
         
          <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-6 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Point de vente</InputLabel>
                <Select
                  name="pointvente"
                  value={formik.values.pointvente}
                  onChange={formik.handleChange}
                  error={formik.touched.pointvente && Boolean(formik.errors.pointvente)}
                  className="bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {pointventes.map((pv) => (
                    <MenuItem key={pv.id} value={pv.id}>
                      {pv.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="w-full px-3 mb-6 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={handleCategoryChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  className="bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="w-full px-3 mb-6 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Produit</InputLabel>
                <Select
                  name="produit"
                  value={formik.values.produit}
                  onChange={handleProduitChange}
                  error={formik.touched.produit && Boolean(formik.errors.produit)}
                  className="bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {filteredProduits.map((produit) => (
                    <MenuItem key={produit.id} value={produit.id}>
                      {produit.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="w-full px-3 mb-6 md:w-1/3">
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
                InputProps={{
                  readOnly: true,
                  className: "bg-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500",
                }}
              />
            </div>

            <div className="w-full px-3 mb-6 md:w-1/3">
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
                InputProps={{
                  className: "bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500",
                }}
              />
            </div>

            <div className="w-full px-3 mb-6 md:w-1/3">
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
                InputProps={{
                  readOnly: true,
                  className: "bg-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500",
                }}
              />
            </div>
          </div>
          <Box className="flex justify-end mt-4">
            <button 
           // onClick={handleSave}
           type='submit'
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
      <ToastContainer 
       position="top-center"
       autoClose={5000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
      />
    </div>
  );
};

export default LivraisonPage;
