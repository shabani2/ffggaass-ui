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
          <Typography variant="h4">Gestion de Clients</Typography>
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
      <Box>
     
   
      <div style={{ height: 500, width: '99%' }} className='mt-[25px]'>
          <Box>
            <Box className='flex justify-between mb-3'>
              <Typography className='m-3 text-4xl text-blue-500' sx={{fontSize:'2rem',margin:'3 0'}}>Liste des Clients</Typography>
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Ajouter Client
              </Button>
              
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
      

      <Modal open={open} onClose={handleClose}>
        <Box  sx={style}   
        >
          <Typography variant="h6" gutterBottom>
            {selectedClient ? 'Modifier Client' : 'Ajouter Client'}
          </Typography>    
            
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  
                  fullWidth
                  label="Nom"
                  name="nom"
                  onChange={formik.handleChange}
                  value={formik.values.nom}
                  variant="outlined"
                  margin="normal"
                  error={formik.touched.nom && Boolean(formik.errors.nom)}
                  helperText={formik.touched.nom && formik.errors.nom}
                />
                <TextField
                 
                  fullWidth
                  label="Postnom"
                  name="postnom"
                  variant="outlined"
                  margin="normal"
                  onChange={formik.handleChange}
                  value={formik.values.postnom}       
                 
                  error={formik.touched.postnom && Boolean(formik.errors.postnom)}
                  helperText={formik.touched.postnom && formik.errors.postnom}
                />
                <TextField
                 
                  fullWidth
                  label="Prénom"
                  name="prenom"
                  onChange={formik.handleChange}
                  value={formik.values.prenom}
                  variant="outlined"
                  margin="normal"
                  error={formik.touched.prenom && Boolean(formik.errors.prenom)}
                  helperText={formik.touched.prenom && formik.errors.prenom}
                />
                 <TextField
                  
                  fullWidth
                  label="numero"
                  name="numero"
                  onChange={formik.handleChange}
                  value={formik.values.numero}
                  variant="outlined"
                  margin="normal"
                  error={formik.touched.numero && Boolean(formik.errors.numero)}
                  helperText={formik.touched.numero && formik.errors.numero}
                />
                <TextField
                  
                  fullWidth
                  label="adresse"
                  name="adresse"
                  onChange={formik.handleChange}
                  value={formik.values.adresse}
                  variant="outlined"
                  margin="normal"
                  error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                  helperText={formik.touched.adresse && formik.errors.adresse}
                />
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button onClick={handleClose} color="secondary">
                    Annuler
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    {selectedClient ? 'Mettre à jour' : 'Ajouter'}
                  </Button>
                </Box>
              </form>
          
          
        </Box>
      </Modal>
    </Box>
      
    </div>
    
  );
}

export default ClientPage;

