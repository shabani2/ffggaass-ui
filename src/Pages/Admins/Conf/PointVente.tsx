import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPointVentes,
  addPointVente,
  updatePointVente,
  deletePointVente,
  selectAllPointVentes,
  pvapi,
} from '@/Redux/Admin/pointVenteSlice'
import { RootState,AppDispatch } from '@/Redux/Store';
import {
  DataGrid,
  GridColDef,
 // GridToolbarContainer,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
//mport AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DownloadIcon, PlusIcon, UploadIcon } from 'lucide-react';

const PointVente: React.FC = () => {
  const dispatch:AppDispatch = useDispatch<AppDispatch>();
  const pointVentes = useSelector((state: RootState) => selectAllPointVentes(state));
  const status = useSelector((state: RootState) => state.pointVente.status);
  const error = useSelector((state: RootState) => state.pointVente.error);

  //const status = useSelector((state: RootState) => state.pointVente.status);
  const addStatus = useSelector((state: RootState) => state.pointVente.addStatus);
  const updateStatus = useSelector((state: RootState) => state.pointVente.updateStatus);
  const deleteStatus = useSelector((state: RootState) => state.pointVente.deleteStatus);
  
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPointVente, setCurrentPointVente] = useState({ id:'',_id: '', nom: '', emplacement: '',createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString() });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPointVentes());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (addStatus === 'succeeded' || updateStatus === 'succeeded' || deleteStatus === 'succeeded') {
      dispatch(fetchPointVentes());
    }
  }, [dispatch, addStatus, updateStatus, deleteStatus]);
  const handleOpen = () => {
    setEditMode(false);
    setCurrentPointVente({ _id: '', nom: '', emplacement: '',createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),id:''  });
    setOpen(true);
  };

  const handleEdit = (id: string) => {
    const pointVente = pointVentes.find((pv) => pv._id === id);
    if (pointVente) {
      setEditMode(true);
      const mergeDate = {
        ...pointVente,
        createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),id:''
      }
      setCurrentPointVente(mergeDate);
      setOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deletePointVente(id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const createPv = {
      nom : currentPointVente.nom,
      emplacement :currentPointVente.emplacement
    }
    const id= currentPointVente._id ;
    if (editMode) {
      const apiv ={
        nom : createPv.nom,
        emplacement:createPv.emplacement
      }
      dispatch(updatePointVente({id,updatedPointVente: apiv}));
    } else {
      dispatch(addPointVente(createPv)).then(()=>{
        dispatch(fetchPointVentes());
      });
    }
    handleClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPointVente({ ...currentPointVente, [name]: value });
  };

  const columns: GridColDef[] = [
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'emplacement', headerName: 'Emplacement', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.id as string)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id as string)}
        />,
      ],
    },
  ];

  return (

    <>
 <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Gestion point de vente</Typography>
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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleOpen}>
            Nouveau
          </Button>
        </div>
   </Stack>
    

<div style={{ height: 400, width: '100%' }}>
    
      {status === 'loading' || addStatus === 'loading' || updateStatus === 'loading' || deleteStatus === 'loading' ? (
        <CircularProgress />
      ) : (
        <DataGrid rows={pointVentes} columns={columns} checkboxSelection />
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? 'Edit PointVente' : 'Add PointVente'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="nom"
            label="Nom"
            type="text"
            fullWidth
            value={currentPointVente.nom}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="emplacement"
            label="Emplacement"
            type="text"
            fullWidth
            value={currentPointVente.emplacement}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </>
    
  );
};

export default PointVente;
