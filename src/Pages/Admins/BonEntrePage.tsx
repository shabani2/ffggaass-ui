/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Stack, Typography, Modal, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { exportMvtStock, importMvtStock, fetchMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { Livraison } from '@/Utils/dataTypes';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addBonEntre, fetchBonsEntres, selectAllBonsEntres } from '@/Redux/Admin/bonEntreSlice';



const validationSchema = yup.object({
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  category: yup.string().required('Category is required'),
});

const BonEntrePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const entreStock = useSelector((state:RootState)=>selectAllBonsEntres(state))
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
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  //const user = useSelector(selectCurrentUser)
  




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
        //pointVente:livraisonData.pointvente
        }
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
     //@ts-ignore     
      
      dispatch(addBonEntre(data)).then((rep)=>{
        //fetchLivraisons()
        dispatch(fetchCategories());
        dispatch(fetchProduits());
        dispatch(fetchBonsEntres())
        
        console.log('data==> : ', rep);
      });
      
      resetForm();
      handleCloseModal()
    },
  });
  
 
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
    formik.setFieldValue('produit', '');
    formik.setFieldValue('prix', 0);
    formik.setFieldValue('category','')
    formik.setFieldValue('quantite',0)
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  useEffect(() => {
    //setLoading1(true);    
    dispatch(fetchProduits());
    dispatch(fetchCategories());
    dispatch(fetchBonsEntres())
  }, [ dispatch]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCategoryChange = (event: { target: { value: any } }) => {
    const categoryId = event.target.value as string;
    formik.setFieldValue('category', categoryId);
    setFilteredProduits(produits.filter((produit: Produit1) => produit.category._id === categoryId));
    formik.setFieldValue('produit', '');
    formik.setFieldValue('prix', 0);
    // formik.setFieldValue('category','')
    formik.setFieldValue('quantite',0)
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  console.log('bon d entre',entreStock)

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
                  startIcon={<UploadIcon //@ts-ignore
                    fontSize="var(--icon-fontSize-md)" />}
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  Upload
                </Button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </div>
              <Button color="inherit" startIcon={<DownloadIcon
              //@ts-ignore
               fontSize="var(--icon-fontSize-md)" />} onClick={() => handleExport('xlsx')}>
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
              
          {entreStock.length>0 ?
           <DataGrid
           rows={entreStock} 
           columns={columns}
           pagination
           paginationMode="client"
           rowCount={entreStock.length}
           onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
           loading={loading}
           checkboxSelection
           onRowSelectionModelChange={(newSelection: React.SetStateAction<GridRowSelectionModel>) => {
             setSelectionModel(newSelection);
           }}
           rowSelectionModel={selectionModel}
           paginationModel={paginationModel}
           getRowId={(raw)=>raw._id}
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
          component='form' onSubmit={formik.handleSubmit}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {modalMode === 'create' ? 'Nouvelle Livraison' : 'Modifier Livraison'}
          </Typography>
         
          <div className="flex flex-wrap -mx-3">           

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

        
       </div>
   </div>
     

</>

  );
};

export default BonEntrePage;




