/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import {jsPDF} from 'jspdf';  // Import jsPDF
import 'jspdf-autotable';
//import { DownloadIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPointVentes, selectAllPointVentes } from '@/Redux/Admin/pointVenteSlice';
import { addLivraison } from '@/Redux/Admin/livraisonSlice';




const validationSchema = yup.object({
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  category: yup.string().required('Category is required'),
});

const Caisse: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));

  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const [pv,setPv] = useState('')
  const [loading, setLoading] = useState(false);
  //@ts-ignore
  const [modalOpen, setModalOpen] = useState(false);
  const pointventes = useSelector((state: RootState) => selectAllPointVentes(state));
 
  const user = useSelector(selectCurrentUser);
//@ts-ignore
  const [products, setProducts]:livraison[]= useState<Livraison[]>([]);
  const addStatus = useSelector((state: RootState) => state.livraison.status);
 

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduits());
    dispatch(fetchPointVentes())
  }, [dispatch]);

  useEffect(() => {
    if (addStatus === 'failed') {
      toast.error(`Erreur: la quantite en stock est inferieur pour accepter cette operation`);
    }
  }, [addStatus]);

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
        quantite:newMvtStock.quantite,
        montant:newMvtStock.montant ,
        produit:newMvtStock?.produit,
        pointVente:user?.pointVente
        }
     //@ts-ignore
      setProducts([...products,data])
      console.log('pruits selected==> : ', products);
      //dispatch(addVente(data));
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
    //@ts-ignore
  }, [formik.values.quantite, formik.values.prix]);  
//@ts-ignore
  const totalAmount = products.reduce((acc, product) => acc + product.montant, 0);

 //@ts-ignore
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    //@ts-ignore
    setClient({
      //@ts-ignore
      ...client,
      [name]: value,
    });
  };
  const validateLivraison = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true); // Commencez le chargement
    try {      
      //@ts-ignore
      products.forEach(async (p)=> {
        p = {...p,pointVente:pv}
        //console.log('pv id :', p);
         await dispatch(addLivraison(p)); // Ajoutez des ventes une par une
        if(addStatus=='fulfilled'){
          toast.success('Vente effectuee avec succes');
        }
        
      }  )   
     
      setProducts([]);
      //setModalOpen(true)
    } finally {
      setLoading(false); // Terminez le chargement
    }
  };
//@ts-ignore
  const generateInvoicePDF = () => {
    const doc = new jsPDF();

    doc.text("Facture", 20, 20);
    //@ts-ignore
    doc.text(`Client: ${client.nom}`, 20, 30);
    //@ts-ignore
    doc.text(`Numéro: ${client.numero}`, 20, 40);
    //@ts-ignore
    doc.text(`Adresse: ${client.adresse}`, 20, 50);

   // Ajouter un en-tête pour les produits
  let y = 60; // Position de départ pour les lignes de produits
  doc.text("Produit", 20, y);
  doc.text("Quantité", 80, y);
  doc.text("Prix Unitaire", 140, y);
  doc.text("Montant", 200, y);

  // Ajouter les lignes de produits
  y += 10; // Déplacement vers le bas après l'en-tête
  //@ts-ignore
  products.forEach((product) => {
    doc.text(product?.produit.nom, 20, y);
    doc.text(product.quantite.toString(), 80, y);
    doc.text(product?.produit.prixVente.toFixed(2), 140, y);
    doc.text(product.montant.toFixed(2), 200, y);
    y += 10; // Déplacement vers le bas pour la prochaine ligne
  });

  // Ajouter le total
  doc.text(`Total: fc ${totalAmount.toFixed(2)}`, 20, y + 10);

//@ts-ignore
    doc.save(`facture_${client.nom}.pdf`);
    //@ts-ignore
    setClient({ nom: '', numero: '', adresse: '' });
    setModalOpen(false);
  };
  

  return (
    <>
    
    <div className='p-[2rem] w-full bg-gray-300'>
    
      
    <div className="flex flex-col items-center w-full min-h-screen p-6 ">
      {/* Header */}
      <header className="w-full p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Operation de Bon d'Entre</h1>
      </header>

      {/* Main Content */}
      <main className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        {/* Product Selection Area */}
        <section className="p-6 bg-white rounded-lg shadow-lg md:col-span-2">
        

          {/* Product Input */}
          <div className="space-y-4 ">           
             
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                    <h2 className="mb-4 text-2xl font-semibold text-gray-700">Sélection des Produits</h2>
                    </Grid>
                    <Grid item xs={3}>
                    <Box >
                      <button  className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500" type='submit'>
                        Ajouter le produit
                      </button>
                    </Box>
                    </Grid>
                </Grid>
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
                    disabled
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
                    disabled
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

              
            </Box>  
            </div>
            {/* <button
              onClick={addProduct}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
            >
              Ajouter le Produit
            </button> */}
          

          {/* Products List */}
          <div className="mt-6 space-y-4">
          
            {//@ts-ignore
            products.map((product:any, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg shadow-inner bg-gray-50">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-600">{product?.produit?.nom}</span>
                  <span className="font-semibold text-gray-800">
                    {product.quantite} x fc :{product?.produit?.prix}
                  </span>
                </div>
                <span className="font-bold text-gray-800">fc: {product.montant.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Invoice Creation Area */}
        <section className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Rédiger le Bon d'Entre</h2>

          {/* Client Information */}
          <form  onSubmit={validateLivraison} className="mb-4 space-y-4">
            <FormControl fullWidth margin="normal">
                  <InputLabel>Point de vente</InputLabel>
                  <Select
                    name="pointvente"
                    value={pv}
                    onChange={(e)=>setPv(e.target.value)}
                    required                   
                     >
                    {pointventes.map((pv) => (
                      <MenuItem key={pv.id} value={pv.id}>
                        {pv.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

          {/* Selected Products Summary */}
          <div className="mb-4 space-y-2">
            
            {//@ts-ignore
            products.map((product:any, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{product?.produit.nom}</span>
                <span className="font-semibold text-gray-800">
                  fc: {product?.produit.prix} x {product.quantite}
                </span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* Total Amount */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-medium text-gray-600">Montant Total :</span>
            <span className="font-bold text-gray-800">fc: {totalAmount.toFixed(2)}</span>
          </div>

          {/* Validate Invoice Button */}
          <button
          disabled={loading}
           type="submit"  // Assurez-vous que le bouton est de type "submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-500"
          >
           {loading ? <CircularProgress size={24} /> : 'Validate Facture'}
          </button>
        </form>
        
        </section>
        
      </main>
    </div>

            
    </div>
   
    <ToastContainer 
       position="top-center"
       autoClose={5000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
      />
    </>
    
  );
};


export default Caisse