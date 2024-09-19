/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Button, IconButton, Modal, Box, TextField, Stack, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/Redux/Store'
import { fetchCategories, addCategory, updateCategory, deleteCategory, selectAllCategories,Category1 } from '@/Redux/Admin/categorySlice';
import { EntityId } from '@reduxjs/toolkit';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';


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
  unite: yup.string().required('Unité is required'),
  piecenombre: yup.number().required('Nombre de pièces is required').min(0, 'Nombre de pièces must be at least 0'),
});

const Category: React.FC = () => {
 
  const dispatch:AppDispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const loading = useSelector((state: RootState) => state.categories.loading);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category1 | null>(null);
  //@ts-ignore
  const [selectionModel, setSelectionModel] = useState<SelectionMode>([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { nom: '', unite: '', piecenombre: 0 },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (selectedCategory) {
        dispatch(updateCategory({ id: selectedCategory.id, category: values })).then(() => {
          dispatch(fetchCategories());
        });
      } else {
        dispatch(addCategory(values)).then(() => {
          dispatch(fetchCategories());
        });
      }
      handleCloseModal();
    },
  });

  const handleOpenModal = (category?: Category1) => {
    if (category) {
      setSelectedCategory(category);
      formik.setValues({ nom: category.nom, unite: category.unite, piecenombre: category.piecenombre });
    } else {
      setSelectedCategory(null);
      formik.resetForm();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleDelete = (id: EntityId) => {
    dispatch(deleteCategory(id as string)).then(() => {
      dispatch(fetchCategories());
    });
  };

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'unite', headerName: 'Unité', width: 150 },
    { field: 'piecenombre', headerName: 'Nombre de pièces', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      //@ts-ignore
      renderCell: (params: GridRowParams) => (
        <>
          <IconButton onClick={() => handleOpenModal(params.row as Category1)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
    <Stack direction="row" spacing={3}>
      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Gestion Category</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
            Import
          </Button>
          <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
            Export
          </Button>
        </Stack>
      </Stack>
<div>
  <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => handleOpenModal()}>
    Nouveau
  </Button>
</div>
</Stack>

{/* zone du tableau */}

    <div style={{ minHeight: 300, width: '100%' }}>      
      <DataGrid rows={categories} columns={columns} loading={loading} 
         checkboxSelection
         disableRowSelectionOnClick
         onRowSelectionModelChange={(newSelectionModel) => {
          //@ts-ignore
           setSelectionModel(newSelectionModel);
         }}
         rowSelectionModel={selectionModel}
      />
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
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
              name="unite"
              label="Unité"
              value={formik.values.unite}
              onChange={formik.handleChange}
              error={formik.touched.unite && Boolean(formik.errors.unite)}
              helperText={formik.touched.unite && formik.errors.unite}
              fullWidth
              margin="normal"
            />
            <TextField
              name="piecenombre"
              label="Nombre de pièces"
              type="number"
              value={formik.values.piecenombre}
              onChange={formik.handleChange}
              error={formik.touched.piecenombre && Boolean(formik.errors.piecenombre)}
              helperText={formik.touched.piecenombre && formik.errors.piecenombre}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {selectedCategory ? 'Update' : 'Add'}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  </>)
};

export default Category;























      
