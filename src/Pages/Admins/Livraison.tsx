/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Chip, Typography, Modal, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
import { addLivraison, fetchExcludedLivraisons, selectAllLivraisons,exportLivraison, importLivraison } from '@/Redux/Admin/livraisonSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
//import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
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
  const [modalMode] = useState<'create' | 'edit'>('create');
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
  

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    dispatch(exportLivraison(format)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const url = window.URL.createObjectURL(new Blob([action.payload]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `livraisons.${format}`);
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      dispatch(importLivraison(file));
      
      dispatch(await fetchProduits());
      dispatch(await fetchCategories());
      dispatch(await fetchExcludedLivraisons(user?.pointVente?.nom)).then((rep)=>{
        console.log('rep',rep.payload)
      }); 
    }
  };

  // const handleOpenModal = (mode: 'create' | 'edit', delivery?: Livraison) => {
  //   setModalMode(mode);
  //   setSelectedDelivery(delivery || null);
  //   setIsModalOpen(true);
  // };

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
    <div className='min-w-10/12 bg-gray-200 p-7'>
     
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-2xl">Gestion de livraisons</h4>
        
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
      </div>


      <Box>
        <div className='mb-4 flex items-center justify-between'>
          <h6 className='text-xl text-blue-500'>journal de livraisons</h6>
          {/* <button
            onClick={() => handleOpenModal('create')}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Nouveau livraison
          </button> */}

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
          className="mx-auto mt-10 max-w-lg rounded bg-white p-6"
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
         
          <div className="-mx-3 flex flex-wrap">
            <div className="mb-6 w-full px-3 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Point de vente</InputLabel>
                <Select
                  name="pointvente"
                  value={formik.values.pointvente}
                  onChange={formik.handleChange}
                  error={formik.touched.pointvente && Boolean(formik.errors.pointvente)}
                  className="rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {pointventes.map((pv) => (
                    <MenuItem key={pv.id} value={pv.id}>
                      {pv.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="mb-6 w-full px-3 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={handleCategoryChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  className="rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="mb-6 w-full px-3 md:w-1/3">
              <FormControl fullWidth margin="normal">
                <InputLabel>Produit</InputLabel>
                <Select
                  name="produit"
                  value={formik.values.produit}
                  onChange={handleProduitChange}
                  error={formik.touched.produit && Boolean(formik.errors.produit)}
                  className="rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
                >
                  {filteredProduits.map((produit) => (
                    <MenuItem key={produit.id} value={produit.id}>
                      {produit.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="mb-6 w-full px-3 md:w-1/3">
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

            <div className="mb-6 w-full px-3 md:w-1/3">
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

            <div className="mb-6 w-full px-3 md:w-1/3">
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
          <Box className="mt-4 flex justify-end">
            <button 
           // onClick={handleSave}
           type='submit'
            className="m-3 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-500"
            >
              {modalMode === 'create' ? 'Créer' : 'Modifier'}
            </button>
            <button 
            onClick={handleCloseModal}
            className="bg--600 m-3 rounded-lg bg-red-600 px-4 py-2 text-white shadow-md hover:bg-red-500">
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
