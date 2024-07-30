import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { addMvtStock } from '@/Redux/Admin/mvtStockSlice';

const validationSchema = yup.object({
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  category: yup.string().required('Category is required'),
});

const CaisseVendeur: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));

  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const initPs = useSelector((state:RootState)=>state.pointVente.initPS);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduits());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      quantite: 0,
      montant: 0,
      produit: '',
      category: '',
      prix: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values,{resetForm}) => {
      const newMvtStock = { ...values, produit: selectedProduit };
      const data = {
        operation: 'vente',
        quantite:newMvtStock.quantite,
        montant:newMvtStock.montant ,
        produitId:newMvtStock.produit?.id,
        pointVenteId:initPs
        }
      console.log('mvtStock==> : ', data);
      dispatch(addMvtStock(data));
      resetForm();
    },
  });

  const handleCategoryChange = (event: { target: { value: any } }) => {
    const categoryId = event.target.value as string;
    formik.setFieldValue('category', categoryId);
    setFilteredProduits(produits.filter((produit: Produit1) => produit.category._id === categoryId));
    formik.setFieldValue('produit', '');
    formik.setFieldValue('prix', 0);
  };

  const handleProduitChange = (event: { target: { value: any } }) => {
    const produitId = event.target.value as string;
    const selected = produits.find((produit) => produit?._id === produitId);
    setSelectedProduit(selected || null);
    formik.setFieldValue('produit', produitId);
    formik.setFieldValue('prix', selected?.prix);
  };

  useEffect(() => {
    const montant = formik.values.quantite * formik.values.prix;
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
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
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CaisseVendeur;
function resetForm() {
  throw new Error('Function not implemented.');
}

