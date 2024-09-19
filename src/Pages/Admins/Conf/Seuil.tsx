/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSeuils, addSeuil, updateSeuil, deleteSeuil, selectAllSeuils } from '@/Redux/Admin/seuilSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { AppDispatch, RootState } from '@/Redux/Store';
import { EntityId } from '@reduxjs/toolkit';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PlusIcon } from 'lucide-react';
//import {  PlusIcon } from 'lucide-react';

// Define the types for the form values
interface SeuilFormValues {
  produit: string;
  quantite: number;
  category: string;
}

// Define the types for the Seuil record
interface SeuilRecord {
  id: EntityId;
  _id: string;
  produit: Produit;
  quantite: number;
}

// Define the types for Category and Produit
interface Category1 {
  id: EntityId;
  _id: string;
  nom: string;
  unite: string;
  piecenombre: number;
}

interface Produit {
  id: EntityId;
  _id: string;
  nom: string;
  prix: number;
  category: Category1 | null;
  createdAt: string;
  updatedAt: string;
}

const Seuil: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const seuils = useSelector((state: RootState) => selectAllSeuils(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const produits = useSelector((state: RootState) => selectAllProduits(state));

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSeuil, setSelectedSeuil] = useState<SeuilRecord | null>(null);
  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);

  useEffect(() => {
    dispatch(fetchSeuils());
    dispatch(fetchCategories());
    dispatch(fetchProduits());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSeuil?.produit) {
      const categoryId = selectedSeuil.produit.category?.id;
      if (categoryId) {
        const produitsInCategory = produits.filter(p => p.category?.id === categoryId);
        setFilteredProduits(produitsInCategory);
      }
    }
  }, [selectedSeuil, produits]);

  const handleOpen = (seuil?: SeuilRecord) => {
    setSelectedSeuil(seuil || {
      id: '',
      _id: '',
      produit: { id: '', _id: '', nom: '', prix: 0, category: { id: '', _id: '', nom: '', unite: '', piecenombre: 0 }, createdAt: '', updatedAt: '' },
      quantite: 0
    });
    setIsEditing(!!seuil);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (values: SeuilFormValues) => {
    const seuilToSubmit = {
      ...values,
      produit: produits.find(p => p._id === values.produit),
    };
    const data ={
      quantite : seuilToSubmit.quantite,
      produitId :seuilToSubmit.produit?._id
    }

    if (isEditing && selectedSeuil) {
      await dispatch(updateSeuil({ id: selectedSeuil.id.toString(), updates:data }));
    } else {
      await dispatch(addSeuil(data));
    }
    handleClose();
    dispatch(fetchSeuils());
  };

  const handleDelete = async (_id: EntityId) => {
    await dispatch(deleteSeuil(_id.toString()));
  };
 
  console.log('seuil=>',seuils)

  const columns: GridColDef[] = [
   // { field: 'id', headerName: 'ID', width: 150 },
    { field: 'produit', headerName: 'Produit', width: 200, valueGetter: (params:Produit) => params?.nom },
    { field: 'quantite', headerName: 'Quantité', width: 150 },
    // { field: 'category', headerName: 'Category', width: 200, valueGetter: (params:Produit1) => params?.category.nom || ''},
   
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpen(params.row as SeuilRecord)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // Validation Schema
  const validationSchema = Yup.object({
    produit: Yup.string().required('Produit is required'),
    quantite: Yup.number().required('Quantité is required').min(1, 'Quantité must be greater than 0'),
    category: Yup.string().required('Category is required'),
  });

  return (
    <>
     <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Gestion point de seuil de stock</Typography>          
        </Stack>
        <div>         
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            style={{ marginBottom: '16px' }}
          >
        Add New Seuil
      </Button>
        </div>
   </Stack>
      
      <DataGrid
        rows={seuils}
        columns={columns}
        //@ts-ignore
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: 400, p: 3, mx: 'auto', my: 5, bgcolor: 'background.paper', borderRadius: 1 }}>
          <h2 id="modal-title">{isEditing ? 'Edit Seuil' : 'Add Seuil'}</h2>
          <Formik
            initialValues={{
              produit: selectedSeuil?.produit._id || '',
              quantite: selectedSeuil?.quantite || 0,
              category: selectedSeuil?.produit.category?._id || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue, errors, touched }) => (
              <Form>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Field
                    as={Select}
                    labelId="category-select-label"
                    name="category"
                    value={values.category}
                    onChange={(e: any) => {
                      const selectedCategoryId = e.target.value;
                      setFieldValue('category', selectedCategoryId);
                      setFieldValue('produit', '');
                      const produitsInCategory = produits.filter(p => p.category?._id === selectedCategoryId);
                      setFilteredProduits(produitsInCategory);
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.nom}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="produit-select-label">Produit</InputLabel>
                  <Field
                    as={Select}
                    labelId="produit-select-label"
                    name="produit"
                    value={values.produit}
                    onChange={(e: any) => setFieldValue('produit', e.target.value)}
                  >
                    {filteredProduits.map((produit) => (
                      <MenuItem key={produit._id} value={produit._id}>
                        {produit.nom}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
                <TextField
                  fullWidth
                  margin="normal"
                  name="quantite"
                  label="Quantité"
                  type="number"
                  value={values.quantite}
                  onChange={handleChange}
                  error={touched.quantite && Boolean(errors.quantite)}
                  helperText={touched.quantite && errors.quantite}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="prix"
                  label="Prix"
                  type="number"
                  value={produits.find(p => p._id === values.produit)?.prix || 0}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="montant"
                  label="Montant"
                  type="number"
                  value={(produits.find(p => p._id === values.produit)?.prix || 0) * values.quantite}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '16px' }}
                >
                  {isEditing ? 'Update' : 'Add'}
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default Seuil;
