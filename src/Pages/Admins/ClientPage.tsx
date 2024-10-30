/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, Modal, Box, TextField, Typography, Stack, IconButton } from '@mui/material';
import { AppDispatch, RootState } from '@/Redux/Store';
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
  //@ts-ignore
  searchClients,
  selectAllClients,
} from '@/Redux/Admin/clientSlice';
import { Client } from '@/Utils/dataTypes';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { DownloadIcon, UploadIcon } from 'lucide-react';



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
  postnom: yup.string().required('prenom is required'),
 // prixVente: yup.number().required('Prix is required').min(0, 'Prix must be at least 0'),
  prenom: yup.string().required('prenom is required'),
  adresse: yup.string().required('adresse is required'),
  
});


const ClientPage = () => {
  const dispatch:AppDispatch = useDispatch();
  const clients = useSelector((state: RootState) => selectAllClients(state));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  //const [] = useState('');
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };
  console.log('clients=',clients)


   

  const handleDeleteClient = (id: string) => {
    console.log('id client => ',id)
    dispatch(deleteClient(id));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formik = useFormik({
    initialValues: {
      nom: '',
      postnom:  '',
      prenom: '',
      numero:'',
      adresse: ' '
    },
    validationSchema:validationSchema,
    onSubmit:(values:Omit<Client,'id'>,resetForm)=>{
      console.log('values=>',values)
      if (selectedClient) {
        console.log('update')
        dispatch(updateClient({ id: selectedClient.id, updatedClient: values }));
      } else {
        console.log('create')
        dispatch(addClient(values));
      }
      resetForm
      handleClose();
    
      
    },
  })

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'postnom', headerName: 'Postnom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'numero', headerName: 'numero', width: 200 },
    { field: 'adresse', headerName: 'adresse', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        
        const row = params.row as Client
        return (
        <>
          <IconButton onClick={() => { setSelectedClient(row); handleOpen(); }}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteClient(row._id)}>
              <DeleteIcon color="error" />
            </IconButton>
          
          
        </>)
      },
    },
  ];

 

  return (
    <div className='min-w-10/12 p-7'>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <h4 className='text-2xl text-bold'>Gestion de Clients</h4>
        </Stack>
        <div>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-sm)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-sm)" />}>
              Export
            </Button>
          </Stack>
        </div>
          
        </Stack>  
      <Box>
     
   
      <div style={{ height: 500, width: '99%' }} className='mt-[25px]'>
          <Box>
            <Box className='flex justify-between mb-1'>
              <h6 className=' text-2xl text-bold text-blue-500' >Liste des Clients</h6>
              <button className='px-4 py-2 m-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500'  onClick={handleOpen}>
                Ajouter Client
              </button>
              
              </Box>
            
            <DataGrid rows={clients} columns={columns}
            //@ts-ignore
             pageSize={15} autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
              rowSelectionModel={selectionModel}
              getRowId={(row) => row._id} 
            />
          </Box>
      </div>
      

      {open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
      <h2 className="text-xl font-semibold mb-4">
        {selectedClient ? 'Modifier Client' : 'Ajouter Client'}
      </h2>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Champ Nom */}
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
            className={`w-full h-12 px-3 border border-gray-300 bg-white focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {formik.touched.nom && formik.errors.nom && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.nom}</p>
          )}
        </div>

        {/* Champ Postnom */}
        <div>
          <label htmlFor="postnom" className="block text-sm font-medium text-gray-700">
            Postnom
          </label>
          <input
            id="postnom"
            name="postnom"
            type="text"
            value={formik.values.postnom}
            onChange={formik.handleChange}
            className={`w-full h-12 px-3 border border-gray-300 bg-white focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {formik.touched.postnom && formik.errors.postnom && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.postnom}</p>
          )}
        </div>

        {/* Champ Prénom */}
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            value={formik.values.prenom}
            onChange={formik.handleChange}
            className={`w-full h-12 px-3 border border-gray-300 bg-white focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {formik.touched.prenom && formik.errors.prenom && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.prenom}</p>
          )}
        </div>

        {/* Champ Numéro */}
        <div>
          <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
            Numéro
          </label>
          <input
            id="numero"
            name="numero"
            type="text"
            value={formik.values.numero}
            onChange={formik.handleChange}
            className={`w-full h-12 px-3 border border-gray-300 bg-white focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {formik.touched.numero && formik.errors.numero && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.numero}</p>
          )}
        </div>

        {/* Champ Adresse */}
        <div className="col-span-2">
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            id="adresse"
            name="adresse"
            type="text"
            value={formik.values.adresse}
            onChange={formik.handleChange}
            className={`w-full h-12 px-3 border border-gray-300 bg-white focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
          {formik.touched.adresse && formik.errors.adresse && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.adresse}</p>
          )}
        </div>

        {/* Boutons */}
        <div className="col-span-2 flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 bg-white 
                       hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            Annuler
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-500 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          >
            {selectedClient ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </Box>
      
    </div>
    
  );
}

export default ClientPage;

