import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { fetchPointVentes, selectAllPointVentes } from '@/Redux/Admin/pointVenteSlice';
import { addMvtStock } from '@/Redux/Admin/mvtStockSlice';


const validationSchema = yup.object({
  operation: yup.string().required('Operation is required'),
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  statut: yup.string().required('Statut is required'),
  produit: yup.string().required('Produit is required'),
  pointVente: yup.string().required('PointVente is required'),
  category: yup.string().required('Category is required'),
});

const Caisse: React.FC = () => {
  const dispatch:AppDispatch = useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const pointVentes = useSelector((state: RootState) => selectAllPointVentes(state));

  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const [selectedProduit, setSelectedProduit]= useState<Produit1|null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduits());
    dispatch(fetchPointVentes());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      operation: 'vente',
      quantite: 0,
      montant: 0,
      statut: 'unvalidate',
      produit: '',
      pointVente: '',
      category: '',
      prix: 0,
      prixVente:0
    },
    validationSchema: validationSchema,
    onSubmit: (values,{resetForm}) => {
      
      const newMvtStock = { ...values, produit: selectedProduit, pointVente: pointVentes.find((pv) => pv.id === values.pointVente) };
      const data = {
         operation: newMvtStock.operation,
         quantite:newMvtStock.quantite,
         montant:newMvtStock.montant ,
         statut:newMvtStock?.statut,
          produitId:newMvtStock.produit?.id,
          pointVenteId:newMvtStock.pointVente?._id
         }
         console.log('mvtStock==> : ',data)
      dispatch(addMvtStock(data));
      resetForm()
    },
  });

  const handleCategoryChange = (event: { target: { value: any; }; }) => {
    const categoryId = event.target.value as string;
    formik.setFieldValue('category', categoryId);
    setFilteredProduits(produits.filter((produit :Produit1) => produit.category._id === categoryId));
    formik.setFieldValue('produit', '');
    formik.setFieldValue('prix', 0);
    formik.setFieldValue('prixVente', 0);
  };

  const handleProduitChange = (event: { target: { value: any; }; }) => {
    const produitId = event.target.value as string;
    const selected = produits.find((produit) => produit?._id === produitId);
    setSelectedProduit(selected || null);
    formik.setFieldValue('produit', produitId);
    formik.setFieldValue('prix', selected?.prix);
    formik.setFieldValue('prixVente', selected?.prixVente);
  };

  useEffect(() => {
    
    const montant = formik.values.operation==='vente' ? formik.values.quantite * formik.values.prixVente :formik.values.quantite * formik.values.prix
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]);

  return (
    <div className='flex justify-center'>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ flexGrow: 1,width:'80%', boxShadow: 3, borderRadius: '8px', overflow: 'hidden', padding: 3, height: 500, margin:3 }} >
    <div className='text-xl text-blue-500'>Operation de livraison ou de vente</div>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Operation</InputLabel>
          <Select
            name="operation"
            value={formik.values.operation}
            onChange={formik.handleChange}
            error={formik.touched.operation && Boolean(formik.errors.operation)}
          >
            <MenuItem value="vente">Vente</MenuItem>
            <MenuItem value="livraison">Livraison</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>PointVente</InputLabel>
          <Select
            name="pointVente"
            value={formik.values.pointVente}
            onChange={formik.handleChange}
            error={formik.touched.pointVente && Boolean(formik.errors.pointVente)}
          >
            {pointVentes.map((pointVente) => (
              <MenuItem key={pointVente.id} value={pointVente.id}>
                {pointVente.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formik.values.category}
            onChange={handleCategoryChange}
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Produit</InputLabel>
          <Select
            name="produit"
            value={formik.values.produit}
            onChange={handleProduitChange}
            error={formik.touched.produit && Boolean(formik.errors.produit)}
          >
            {filteredProduits.map((produit) => (
              <MenuItem key={produit.id} value={produit.id}>
                {produit.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          margin="normal"
          id="prix"
          name="prix"
          label="Prix"
          type="number"
          value={formik.values.prix}
          onChange={formik.handleChange}
          error={formik.touched.prix && Boolean(formik.errors.prix)}
          helperText={formik.touched.prix && formik.errors.prix}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          margin="normal"
          id="prixVente"
          name="prixVente"
          label="PrixVente"
          type="number"
          value={formik.values.prixVente}
          onChange={formik.handleChange}           
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={4}>
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
      </Grid>

      <Grid item xs={4}>
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
      </Grid>

      <Grid item xs={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Statut</InputLabel>
          <Select
            name="statut"
            value={formik.values.statut}
            onChange={formik.handleChange}
            error={formik.touched.statut && Boolean(formik.errors.statut)}
          >
            <MenuItem value="validate">Validate</MenuItem>
            <MenuItem value="unvalidate">Unvalidate</MenuItem>
          </Select>
        </FormControl>
      </Grid>      

      
    </Grid>

    <Box sx={{ mt: 3 }}>
      <Button color="primary" variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  </Box>
    </div>
    
  );
};

export default Caisse;

