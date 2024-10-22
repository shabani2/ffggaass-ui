/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { CircularProgress, Modal} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';



//import AddIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { DownloadIcon, PlusIcon, UploadIcon} from 'lucide-react';
import { User } from '@/Utils/dataTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/Redux/Store';
import { deleteUser, fetchUsers, registerVendeur, selectAllUsers, updateUser } from '@/Redux/Auth/userSlice';
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
  //@ts-ignore
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);

  const users = useSelector((state: RootState) => selectAllUsers(state));
  const pofSale = useSelector((state:RootState)=>selectAllPointVentes(state)) 
  const [selectedId,setSelectedId]=useState('');
 
  //
  const handleAddClick = () => {
    setClickedItem(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleRowClick = (id: GridRowId) => {
    const item = users.find(row => row.id === id);
    //@ts-ignore
    setClickedItem(item || null);
    setOpen(true);
    setSelectedId(id.toString());
    setIsEditMode(true)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (id: GridRowId) => {
    //@ts-ignore
    const item = users.find((row: { id: GridRowId; }) => row.id === id);
    //@ts-ignore
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
  useEffect(()=>{   
    
      dispatch(fetchUsers()).then(()=>{
        dispatch(fetchPointVentes())
      }) 
      if(status==='idle') {
        dispatch(fetchUsers()).then(()=>{
          dispatch(fetchPointVentes())
        }) 
        
      }
     
   //@ts-ignore 
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
    <Typography variant="h5" sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontWeight: 'bold' }}>
      Gestion des Vendeurs
    </Typography>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        Import
      </Button>
      <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} sx={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        Export
      </Button>
    </Stack>
  </Stack>
  <div>
    <Button
      startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
      className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleAddClick}
      sx={{background : '#3B82F6',color :'white'}}
    >
      ajouter 
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
          //@ts-ignore
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
      height: '70%', // Hauteur du modal à 70% de l'écran
      bgcolor: 'background.paper',     
      boxShadow: 24,
      p: 4,
      overflowY: 'auto', // Pour gérer le scroll si besoin
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
        role: 'Vendeur',
        pointVente: clickedItem?.pointVente?._id || '',
        isEditMode: isEditMode,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const data = {
          nom: values.nom,
          numero: values.numero,
          password: values.password,
          pointVente: values.pointVente,
          postnom: values.postnom,
          prenom: values.prenom,
          role: values.role,
        };

        console.log('Données envoyées au serveur :', data); // Affichage des données dans la console

        if (isEditMode) {
          dispatch(updateUser({ id: selectedId, user: data })).then(() => {
            dispatch(fetchUsers());
          });
        } else {
          dispatch(registerVendeur(data)).then(() => {
            dispatch(fetchUsers());
          });
        }

        handleClose();
      }}
    >
      {({ errors, touched }) => (
       <Form>
       {/* Nom et Postnom sur une même ligne */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
         {/* Champ Nom */}
         <div>
           <label className="block text-sm font-medium text-gray-700">Nom</label>
           <Field
             name="nom"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             placeholder="Entrez votre nom"
           />
           {touched.nom && errors.nom && (
             <div className="text-red-500 text-sm mt-1">{errors.nom}</div>
           )}
         </div>
     
         {/* Champ Postnom */}
         <div>
           <label className="block text-sm font-medium text-gray-700">Postnom</label>
           <Field
             name="postnom"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             placeholder="Entrez votre postnom"
           />
           {touched.postnom && errors.postnom && (
             <div className="text-red-500 text-sm mt-1">{errors.postnom}</div>
           )}
         </div>
       </div>
     
       {/* Prénom */}
       <div className="mb-5">
         <label className="block text-sm font-medium text-gray-700">Prénom</label>
         <Field
           name="prenom"
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           placeholder="Entrez votre prénom"
         />
         {touched.prenom && errors.prenom && (
           <div className="text-red-500 text-sm mt-1">{errors.prenom}</div>
         )}
       </div>
     
       {/* Numéro */}
       <div className="mb-5">
         <label className="block text-sm font-medium text-gray-700">Numéro</label>
         <Field
           name="numero"
           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           placeholder="Entrez votre numéro de téléphone"
         />
         {touched.numero && errors.numero && (
           <div className="text-red-500 text-sm mt-1">{errors.numero}</div>
         )}
       </div>
     
       {/* Mot de passe (si non en mode édition) */}
       {!isEditMode && (
         <div className="mb-5">
           <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
           <Field
             name="password"
             type="password"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             placeholder="Entrez un mot de passe"
           />
           {touched.password && errors.password && (
             <div className="text-red-500 text-sm mt-1">{errors.password}</div>
           )}
         </div>
       )}
     
       {/* Rôle et Point de vente sur la même ligne */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
         {/* Champ Rôle */}
         <div>
  <label className="block text-sm font-medium text-gray-700">Rôle</label>
  <Field
    name="role"
    as="input"
    type="text"
    
    disabled
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-gray-100 sm:text-sm"
  />
  {touched.role && errors.role && (
    <div className="text-red-500 text-sm mt-1">{errors.role}</div>
  )}
</div>

     
         {/* Champ Point de vente */}
         <div>
           <label className="block text-sm font-medium text-gray-700">Point de vente</label>
           <Field
             as="select"
             name="pointVente"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           >
            <option>choisir un point de vente</option>
             {pofSale.length > 0 &&
               pofSale.map((pos) => (
                 <option key={pos.id} value={pos.id}>
                   {pos.nom}
                 </option>
               ))}
           </Field>
           {touched.pointVente && errors.pointVente && (
             <div className="text-red-500 text-sm mt-1">{errors.pointVente}</div>
           )}
         </div>
       </div>
     
       {/* Bouton Submit avec Tailwind (design moderne) */}
       <button
         type="submit"
         className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mt-4"
       >
         Enregistrer
       </button>
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
