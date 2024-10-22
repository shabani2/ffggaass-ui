import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, IconButton, Modal, Box, TextField, MenuItem, Select, FormControl, InputLabel, Stack, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, addProduit, updateProduit, deleteProduit, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice'; // Assuming categorySlice is already set up
import { useFormik } from 'formik';
import * as yup from 'yup';
import { EntityId } from '@reduxjs/toolkit';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';

interface Category {
  
  id: EntityId;
  _id: string;
  nom: string;
}

interface Produit1 {
  prixVente: number;
  id: EntityId;
  _id: string;
  nom: string;
  prix: number;
  //prixVente:number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  nom: yup.string().required('Nom is required'),
  prix: yup.number().required('Prix is required').min(0, 'Prix must be at least 0'),
 // prixVente: yup.number().required('Prix is required').min(0, 'Prix must be at least 0'),
  category: yup.string().required('Category is required'),
});

const Produit: React.FC = () => {
  const dispatch :AppDispatch= useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const loading = useSelector((state: RootState) => state.produits.loading);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produit1 | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    dispatch(fetchProduits());
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { nom: '', prix: 0,prixVente:0, category: '' },
    validationSchema: validationSchema,
    onSubmit: (values) => {
     
      const category = categories.find(cat => cat._id === values.category);
      const newProduct = { ...values, category: category! };
      const data = {
        nom : newProduct.nom,
        prix : newProduct.prix,
        prixVente:newProduct.prixVente,
        categoryId : newProduct.category?._id
      }
      if (selectedProduct) {
        dispatch(updateProduit({ id: selectedProduct._id, produit: data })).then(() => {
          dispatch(fetchProduits());
        });
      } else {
       
        console.log('from user =>: ',newProduct);
        dispatch(addProduit(data)).then(() => {
          dispatch(fetchProduits());
        });
      }
      handleCloseModal();
    },
  });

  const handleOpenModal = (produit?: Produit1) => {
    if (produit) {
      setSelectedProduct(produit);
      formik.setValues({ nom: produit.nom, prix: produit.prix, prixVente:produit.prixVente,category: produit.category._id });
    } else {
      setSelectedProduct(null);
      formik.resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    formik.resetForm();
  };

  const handleDelete = (id: EntityId) => {
    dispatch(deleteProduit(id as string)).then(() => {
      dispatch(fetchProduits());
    });
  };

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 200 },
    { field: 'prix', headerName: 'Prix', width: 200 },
    { field: 'prixVente', headerName: 'Prix de vente', width: 200 },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
      valueGetter: (params:Category) => params?.nom
      // valueGetter: (params) => params.row?.category?.nom || '' 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => {
        const row = params.row as Produit1;
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

  return (

    <>
    <div className='min-w-10/12 p-7'>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Gestion de Produit</Typography>
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
          <Box className='flex justify-between'>
            <Typography className='m-3 text-4xl text-blue-500' sx={{fontSize:'2rem',margin:'3 0'}}>Liste de produits</Typography>
            <div>
                <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => handleOpenModal()}>
                  Nouveau
                </Button>
            </div>
                
          </Box>
          <DataGrid
            rows={produits}
            columns={columns}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            rowSelectionModel={selectionModel}
          />
          
        </Box>  
        
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box sx={style}>
            <Typography sx={{margin:2}}>{selectedProduct? 'Modifier Produit' : 'Ajouter Produit'}</Typography>
            <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="nom"
                label="Nom"
                value={formik.values.nom}
                onChange={formik.handleChange}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
                fullWidth
                margin="normal"
              />
              <TextField
                name="prix"
                label="Prix"
                type="number"
                value={formik.values.prix}
                onChange={formik.handleChange}
                error={formik.touched.prix && Boolean(formik.errors.prix)}
                helperText={formik.touched.prix && formik.errors.prix}
                fullWidth
                margin="normal"
              />
               <TextField
                name="prixVente"
                label="PrixVente"
                type="number"
                value={formik.values.prixVente}
                onChange={formik.handleChange}
                error={formik.touched.prix && Boolean(formik.errors.prix)}
                helperText={formik.touched.prix && formik.errors.prix}
                fullWidth
                margin="normal"
              />
             
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {selectedProduct ? 'Update' : 'Add'}
              </Button>
            </form>
          </Box>
        </Modal>
      </div>

    </div>
     
    </>
    
  );
};

export default Produit;
