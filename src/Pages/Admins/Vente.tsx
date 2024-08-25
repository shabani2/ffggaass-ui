/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, IconButton, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Badge, Stack, Typography } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { RootState } from '@/Redux/Store';
import { fetchMvtStocks, addMvtStock, updateMvtStock, deleteMvtStock, selectAllMvtStocks, exportMvtStock, importMvtStock, selectTotalMvtStocks } from '@/Redux/Admin/mvtStockSlice';
import { fetchProduits, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { MvtStock, PointVente1, Produit } from '@/Utils/dataTypes';
import { AppDispatch } from '@/Redux/Store';
import { EntityId } from '@reduxjs/toolkit';
import { CheckCircleIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { format } from 'date-fns';
import Chip from '@mui/material/Chip';

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
  operation: yup.string().required('Operation is required'),
  quantite: yup.number().required('Quantite is required').min(0, 'Quantite must be at least 0'),
  montant: yup.number().required('Montant is required').min(0, 'Montant must be at least 0'),
  statut: yup.string().required('Statut is required'),
  produit: yup.string().required('Produit is required'),
  pointVente: yup.string().required('PointVente is required'),
});


const Vente: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const mvtStocks = useSelector((state: RootState) => selectAllMvtStocks(state));
  const totalRows = useSelector((state: RootState) => selectTotalMvtStocks(state));
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const loading = useSelector((state: RootState) => state.mvtStock.loading);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMvtStock, setSelectedMvtStock] = useState<MvtStock | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const error = useSelector((state: RootState) => state.mvtStock.error);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [page, setPage] = useState(0);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    setLoading1(true);
    dispatch(fetchMvtStocks());
    dispatch(fetchProduits());
    dispatch(fetchCategories());
  }, [page, dispatch]);

  const formik = useFormik({
    initialValues: {
      operation: 'vente',
      quantite: 0,
      montant: 0,
      statut: 'unvalidate',
      produit: '',
      pointVente: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const produit = produits.find(prod => prod.id === values.produit);
      const pointVente = categories.find(cat => cat.id === values.pointVente);
      const newMvtStock = { ...values, produit: produit!, pointVente: pointVente! };
      const data = {
        operation: newMvtStock.operation,
        montant: newMvtStock.montant,
        quantite: newMvtStock.quantite,
        produitId: newMvtStock.produit?._id,
        pointVenteId: newMvtStock.pointVente?._id
      };
      if (selectedMvtStock) {
        dispatch(updateMvtStock({ id: selectedMvtStock.id, mvtStock: data })).then(() => {
          dispatch(fetchMvtStocks());
        });
      } else {
        dispatch(addMvtStock(data)).then(() => {
          dispatch(fetchMvtStocks());
        });
      }
      setModalOpen(false);
      setSelectedMvtStock(null);
    },
  });

  const handleEditClick = (mvtStock: MvtStock) => {
    setSelectedMvtStock(mvtStock);
    formik.setValues({
      operation: mvtStock.operation,
      quantite: mvtStock.quantite,
      montant: mvtStock.montant,
      statut: mvtStock.statut,
      produit: mvtStock.produit.id.toString(),
      pointVente: mvtStock.pointVente.id.toString(),
    });
    setModalOpen(true);
  };

  const handleDeleteClick = (id: EntityId) => {
    dispatch(deleteMvtStock(id.toString())).then(() => {
      dispatch(fetchMvtStocks());
    });
  };

  const handleAddClick = () => {
    setSelectedMvtStock(null);
    formik.resetForm();
    setModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'operation', headerName: 'Operation', width: 130 },
    { field: 'quantite', headerName: 'Quantite', width: 100 },
    { field: 'montant', headerName: 'Montant', width: 150 },
    {
      field: 'statut',
      headerName: 'Statut',
      width: 150,
      renderCell: (params) => {
        const statut = params.value as string;
        return (
          <Chip color={status=='unvalidate' ? 'error' : 'success'} label={statut} size="small" />
         
        );
      },
    },
    {
      field: 'produit',
      headerName: 'Produit',
      width: 100,
      valueGetter: (params : Produit) => params?.nom,
    },
    {
      field: 'pointVente',
      headerName: 'PointVente',
      width: 150,
      valueGetter: (params : PointVente1) => params?.nom,
    },
    {
      field: 'createdAt',
      headerName: 'Date d\'operation',
      width: 200,
      renderCell: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row as MvtStock)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

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

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
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

  return (
    <>
      <div>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Gestion de livraisons</Typography>
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
                  startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
                  onClick={handleUploadClick}
                  disabled={loading}
                >
                  Upload
                </Button>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
              </div>
              <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={() => handleExport('xlsx')}>
                Export
              </Button>
            </Stack>
          </Stack>
          <div>
            <Button variant="contained" color="primary" onClick={handleAddClick}>
            Add MvtStock
          </Button>
        </div>
        </Stack>
      </div>

      <div style={{ width: '95%',height:'500px'}}>
        
        <Box >
        <Typography className='text-blue-500' sx={{fontSize:'2em',margin:'3 0'}}>Tableau de bon de livraisons</Typography>
          {mvtStocks.length>0 ?
          <DataGrid
            rows={mvtStocks}
            columns={columns}
            pageSize={20}
            loading={loading}
            checkboxSelection
            onSelectionModelChange={(newSelection: React.SetStateAction<GridRowSelectionModel>) => {
              setSelectionModel(newSelection);
            }}
            selectionModel={selectionModel}           
          />
          :
          <div>no content</div>}
        </Box>
       </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2 id="modal-modal-title">MvtStock</h2>
            <form onSubmit={formik.handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Operation</InputLabel>
                <Select
                  name="operation"
                  value={formik.values.operation}
                  onChange={formik.handleChange}
                  error={formik.touched.operation && Boolean(formik.errors.operation)}
                  fullWidth
                >
                  <MenuItem value="vente">Vente</MenuItem>
                  <MenuItem value="livraison">Livraison</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="normal"
                id="quantite"
                name="quantite"
                label="Quantite"
                type="number"
                value={formik.values.quantite}
                onChange={formik.handleChange}
                error={formik.touched.quantite && Boolean(formik.errors.quantite)}
                helperText={formik.touched.quantite && formik.errors.quantite}
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
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Statut</InputLabel>
                <Select
                  name="statut"
                  value={formik.values.statut}
                  onChange={formik.handleChange}
                  error={formik.touched.statut && Boolean(formik.errors.statut)}
                  fullWidth
                >
                  <MenuItem value="validate">Validate</MenuItem>
                  <MenuItem value="unvalidate">Unvalidate</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Produit</InputLabel>
                <Select
                  name="produit"
                  value={formik.values.produit}
                  onChange={formik.handleChange}
                  error={formik.touched.produit && Boolean(formik.errors.produit)}
                  fullWidth
                >
                  {produits.map((produit) => (
                    <MenuItem key={produit.id} value={produit.id}>
                      {produit.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>PointVente</InputLabel>
                <Select
                  name="pointVente"
                  value={formik.values.pointVente}
                  onChange={formik.handleChange}
                  error={formik.touched.pointVente && Boolean(formik.errors.pointVente)}
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button color="primary" variant="contained" fullWidth type="submit">
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
     
    </>
  );
};

export default Vente;
