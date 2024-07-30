import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowId,
//  GridToolbarContainer,
 // GridToolbarExport,
  GridActionsCellItem
} from  '@mui/x-data-grid';

import { CircularProgress, MenuItem, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';



//import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { DownloadIcon, PlusIcon, SaveIcon, UploadIcon} from 'lucide-react';
import { User } from '@/Utils/dataTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { deleteUser, fetchUsers, registerUser, selectAllUsers, updateUser } from '@/Redux/Auth/userSlice';
import { fetchPointVentes, selectAllPointVentes } from '@/Redux/Admin/pointVenteSlice';

//import { Margin } from '@mui/icons-material';






const validationSchema = Yup.object({
  nom: Yup.string().required('Nom est requis'),
  postnom: Yup.string().required('Postnom est requis'),
  prenom: Yup.string().required('Prénom est requis'),
  numero: Yup.string().required('Numéro est requis'),
  role: Yup.string().oneOf(['Vendeur', 'Admin', 'SuperAdmin']).required('Rôle est requis'),
  pointVente: Yup.string().required('Point de vente est requis'),
});

const Vendeur = () => {

 // const auth = useSelector((state: RootState) => state.users);
  const [isEditMode, setIsEditMode] = useState(false);
  //const [vendeurs,setVendeurs]:User[]=useState<User[]>([]);
  const status = useSelector((state:RootState)=>state.users.status)

  const [open, setOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<User | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

  const users = useSelector((state: RootState) => selectAllUsers(state));
  const pofSale = useSelector((state:RootState)=>selectAllPointVentes(state))
  console.log('le pofsale====>',pofSale);
  const [selectedId,setSelectedId]=useState('');
 
  //
  const handleAddClick = () => {
    setClickedItem(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleRowClick = (id: GridRowId) => {
    const item = users.find(row => row.id === id);
    setClickedItem(item || null);
    setOpen(true);
    setSelectedId(id.toString());
    setIsEditMode(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (id: GridRowId) => {
    const item = users.find((row: { id: GridRowId; }) => row.id === id);
    setClickedItem(item || null);
    setSelectedId(id.toString());
    setIsEditMode(true)
    setOpen(true);
    
  };

  const handleDelete = (id: GridRowId) => {
   dispatch(deleteUser(id.toString()));
  };
 


  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'postnom', headerName: 'Postnom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'numero', headerName: 'Numéro', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];
  const dispatch:AppDispatch = useDispatch<AppDispatch>()
  const addStatus = useSelector((state: RootState) => state.users.addStatus);
  const updateStatus = useSelector((state: RootState) => state.users.updateStatus);
  const deleteStatus = useSelector((state: RootState) => state.users.deleteStatus);
  console.log( `tatuts=> ${addStatus}, ${deleteStatus}, ${updateStatus}, ${status}`)

  console.log(status);
  useEffect(()=>{   
    
      dispatch(fetchUsers()).then(()=>{
        dispatch(fetchPointVentes())
      }) 
      if(status==='idle') {
        dispatch(fetchUsers()).then(()=>{
          dispatch(fetchPointVentes())
        }) 
        
      }
     
    
  },[dispatch])

  useEffect(()=>{
    if(addStatus === 'succeeded' || updateStatus === 'succeeded' || deleteStatus === 'succeeded'){
      dispatch(fetchUsers())
    }
  },[dispatch, addStatus, updateStatus, deleteStatus])

  
  
  return (
    <>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Gestion des Vendeurs</Typography>
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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAddClick}>
            Nouveau
          </Button>
        </div>
      </Stack>

      {/* zone du tableau */}
      <div style={{ height: 400, width: '100%' }}>
      {status === 'loading' || addStatus === 'loading' || updateStatus === 'loading' || deleteStatus === 'loading' ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={users.filter(u=>u.role=='Vendeur')}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onSelectionModelChange={(newSelection: React.SetStateAction<GridRowId[]>) => {
            setSelectedRows(newSelection);
          }}
          onRowClick={(params) => handleRowClick(params.id)}
        />
        
      )}
        
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isEditMode ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </Typography>
          <Formik
            initialValues={{
              nom: clickedItem?.nom || '',
              postnom: clickedItem?.postnom || '',
              prenom: clickedItem?.prenom || '',
              numero: clickedItem?.numero || '',
              password: '',
              role: clickedItem?.role || '',
              pointVente: clickedItem?.pointVente?._id || '',
              isEditMode: isEditMode,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const data = {                
                nom: values.nom,
                numero: values.numero,
                password: values.password,
                pointVenteId: values.pointVente,  // Assurez-vous que `pointVente` est de type `PointVente`
                postnom: values.postnom,
                prenom: values.prenom,
                role: values.role
              }
               
              isEditMode ?           
               
                dispatch(updateUser({id:selectedId,user:data})).then(()=>{
                  dispatch(fetchUsers())
                })
                :
                dispatch(registerUser(data)).then(()=>{
                  dispatch(fetchUsers())
                })             
             
                handleClose();
                console.log( `statuts=> ${addStatus}, ${deleteStatus}, ${updateStatus}, ${status}`)
              
                
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Field
                  as={TextField}
                  name="nom"
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  error={touched.nom && !!errors.nom}
                  helperText={touched.nom && errors.nom}
                  sx={{ mb: 2, px: 1 }}
                />
                <Field
                  as={TextField}
                  name="postnom"
                  label="Postnom"
                  variant="outlined"
                  fullWidth
                  error={touched.postnom && !!errors.postnom}
                  helperText={touched.postnom && errors.postnom}
                  sx={{ mb: 2, px: 1 }}
                />
                <Field
                  as={TextField}
                  name="prenom"
                  label="Prénom"
                  variant="outlined"
                  fullWidth
                  error={touched.prenom && !!errors.prenom}
                  helperText={touched.prenom && errors.prenom}
                  sx={{ mb: 2, px: 1 }}
                />
                <Field
                  as={TextField}
                  name="numero"
                  label="Numéro"
                  variant="outlined"
                  fullWidth
                  error={touched.numero && !!errors.numero}
                  helperText={touched.numero && errors.numero}
                  sx={{ mb: 2, px: 1 }}
                />
                {!isEditMode && (
                  <Field
                    as={TextField}
                    name="password"
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ mb: 2, px: 1 }}
                  />
                )}
                <Field
                  as={TextField}
                  name="role"
                  label="Rôle"
                  select
                  variant="outlined"
                  fullWidth
                  error={touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                  sx={{ mb: 2, px: 1 }}
                >
                  <MenuItem value="Vendeur">Vendeur</MenuItem>
                  
                </Field>
                <Field
                  as={TextField}
                  name="pointVente"
                  label="Point de vente"
                  select
                  variant="outlined"
                  fullWidth
                  error={touched.pointVente && !!errors.pointVente}
                  helperText={touched.pointVente && errors.pointVente}
                  sx={{ mb: 2, px: 1 }}
                >
                  {pofSale.length > 0 && pofSale.map((pos) => (
                      <MenuItem key={pos.id} value={pos.id}>
                        {pos.nom}
                      </MenuItem>
                    ))}
                  
                  
                </Field>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ display: 'block', ml: 'auto', mt: 2 }}
                >
                  Sauvegarder
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
    
    
    </>
  )
}

export default Vendeur
