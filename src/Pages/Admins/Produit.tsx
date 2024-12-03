import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, IconButton, Modal, Box, Stack } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, addProduit, updateProduit, deleteProduit, selectAllProduits, exportProduit, importProduit } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice'; // Assuming categorySlice is already set up
import { useFormik } from 'formik';
import * as yup from 'yup';
import { EntityId } from '@reduxjs/toolkit';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';
//import { exportMvtStock, fetchMvtStocks, importMvtStock } from '@/Redux/Admin/mvtStockSlice';

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
  boxShadow: 24,
  borderRadius : '10px',
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

  const error = useSelector((state: RootState) => state.livraison.error);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // const handleUploadClick = (inputRef: React.RefObject<HTMLInputElement>) => {
  //   inputRef.current?.click();
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUploadClick = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // L'accès à inputRef est interne, pas besoin de le passer dans l'événement
    if (inputRef.current) {
      inputRef.current.click();  // Clique sur l'élément input via ref
    }
  };

  

  const handleExport = (format: 'csv' | 'xlsx') => {
    dispatch(exportProduit(format)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const url = window.URL.createObjectURL(new Blob([action.payload]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `produits.${format}`);
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      dispatch(importProduit(file));
      //dispatch(fetchMvtStocks());
      dispatch(fetchProduits());
      dispatch(fetchCategories());
    }
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
    <div className='min-w-6/12 p-7'>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <h3 className='text-2xl font-bold' >Gestion de Produit</h3>
        </Stack>
        <div>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
          </Stack>
        </div>
          
        </Stack>  



      <div style={{ height: 500, width: '99%' }} className='mt-[25px]'> 
        <Box>
          <Box className='flex justify-between'>
            <h4 className='m-3 text-xl text-blue-500' >Liste de produits</h4>
            <div>
            <button
  className="flex items-center rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow transition duration-200 ease-in-out hover:bg-blue-600"
  onClick={() => handleOpenModal()}
>
  <PlusIcon className="mr-2 h-5 w-5" />
  Nouveau
</button>

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
            <h6 className="text-gl mb-5 text-center text-blue-800">{selectedProduct? 'Modifier Produit' : 'Ajouter Produit'}</h6>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${
                    formik.touched.category && formik.errors.category ? 'border-red-500' : ''
                  }pl-2 h-10`} // Hauteur ajustée
                >
                  <option>choisir une categorie...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nom}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formik.values.nom}
                  onChange={formik.handleChange}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${
                    formik.touched.nom && formik.errors.nom ? 'border-red-500' : ''
                  } pl-2 h-10`} // Hauteur ajustée
                />
                {formik.touched.nom && formik.errors.nom && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.nom}</p>
                )}
              </div>

              <div>
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">
                  Prix
                </label>
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  value={formik.values.prix}
                  onChange={formik.handleChange}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${
                    formik.touched.prix && formik.errors.prix ? 'border-red-500' : ''
                  } pl-2 h-10`} // Hauteur ajustée
                />
                {formik.touched.prix && formik.errors.prix && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.prix}</p>
                )}
              </div>

              <div>
                <label htmlFor="prixVente" className="block text-sm font-medium text-gray-700">
                  Prix Vente
                </label>
                <input
                  id="prixVente"
                  name="prixVente"
                  type="number"
                  value={formik.values.prixVente}
                  onChange={formik.handleChange}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 ${
                    formik.touched.prixVente && formik.errors.prixVente ? 'border-red-500' : ''
                  } pl-2 h-10`} // Hauteur ajustée
                />
                {formik.touched.prixVente && formik.errors.prixVente && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.prixVente}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-blue-600"
              >
                {selectedProduct ? 'modifier' : 'Ajouter'}
              </button>
</form>


          </Box>
        </Modal>
      </div>

    </div>
     
    </>
    
  );
};

export default Produit;


