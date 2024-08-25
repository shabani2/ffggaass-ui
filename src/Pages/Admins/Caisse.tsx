/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress, Modal, Typography, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { Vente } from '@/Utils/dataTypes';
import { addVente } from '@/Redux/Admin/venteSlice';
import {jsPDF} from 'jspdf';  // Import jsPDF
import 'jspdf-autotable';
//import { DownloadIcon } from 'lucide-react';
import {Download as DownloadIcon} from '@mui/icons-material';



const validationSchema = yup.object({
  quantite: yup.number().required('Quantite is required').min(1, 'Quantite must be at least 1'),
  montant: yup.number().required('Montant is required').min(1, 'Montant must be at least 1'),
  produit: yup.string().required('Produit is required'),
  category: yup.string().required('Category is required'),
});

const validationClientSchema = yup.object({ 
  name: yup.string().required('name is required'),
  numero: yup.string().required('numero is required'),
  adresse:yup.string().required('adresse is required'),
});

const CaisseVendeur: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));

  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const [client,setClient] = useState({nom:'',numero:'',adresse:''})
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
 
  const user = useSelector(selectCurrentUser);

  const [products, setProducts] = useState<Vente[]>([]);

 

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
    formik.setFieldValue('prix', selected?.prixVente);
  };

  useEffect(() => {
    const montant = formik.values.quantite * formik.values.prix;
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]);  

  const totalAmount = products.reduce((acc, product) => acc + product.montant, 0);

  const clientFormik = useFormik({
    initialValues: {nom: '', numero: '', adresse: ''},
    validationSchema: validationClientSchema,
    onSubmit: (values, { resetForm }) => {
      console.log('Form Submitted', client);
      products.forEach((p) => dispatch(addVente(p)));
      setClient(values);
      resetForm();
      setProducts([]);
    },
  });
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };
  const validateFacture = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true); // Commencez le chargement

    try {
      console.log('Form Submitted', client);
      for (const p of products) {
        await dispatch(addVente(p)); // Ajoutez des ventes une par une
      }
      
     
      setProducts([]);
      setModalOpen(true)
    } finally {
      setLoading(false); // Terminez le chargement
    }
  };

  const generateInvoicePDF = () => {
    const doc = new jsPDF();

    doc.text("Facture", 20, 20);
    doc.text(`Client: ${client.nom}`, 20, 30);
    doc.text(`Numéro: ${client.numero}`, 20, 40);
    doc.text(`Adresse: ${client.adresse}`, 20, 50);

   // Ajouter un en-tête pour les produits
  let y = 60; // Position de départ pour les lignes de produits
  doc.text("Produit", 20, y);
  doc.text("Quantité", 80, y);
  doc.text("Prix Unitaire", 140, y);
  doc.text("Montant", 200, y);

  // Ajouter les lignes de produits
  y += 10; // Déplacement vers le bas après l'en-tête
  products.forEach((product) => {
    doc.text(product?.produit.nom, 20, y);
    doc.text(product.quantite.toString(), 80, y);
    doc.text(product?.produit.prixVente.toFixed(2), 140, y);
    doc.text(product.montant.toFixed(2), 200, y);
    y += 10; // Déplacement vers le bas pour la prochaine ligne
  });

  // Ajouter le total
  doc.text(`Total: fc ${totalAmount.toFixed(2)}`, 20, y + 10);


    doc.save(`facture_${client.nom}.pdf`);
    setClient({ nom: '', numero: '', adresse: '' });
    setModalOpen(false);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setClient({ nom: '', numero: '', adresse: '' });
  };

  return (
    <>
    <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          
        >
          <Box        
           
            sx={{
              maxWidth:"90%",
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              bgcolor:"background.paper",
              p:4,
              position:"fixed",
              borderRadius:4,
              boxShadow:3,
              width:"400px",
              top:"50%",
              left:"50%",
              transform:"translate(-50%, -50%)"
            }}
          >
            <Typography variant="h6" id="modal-title" gutterBottom>
              imprimer la facture
            </Typography>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              flexGrow={1}
              mt={2}
            >
              <IconButton
                color="primary"
                style={{ fontSize: '3rem' }} // Grande taille pour l'icône
                onClick={generateInvoicePDF}
              >
                <DownloadIcon />
              </IconButton>
            </Box>

            <Box
              display="flex"
              justifyContent="flex-end"
              gap={1}
              mt={2}
            >
              <button
                onClick={generateInvoicePDF}
                 className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
              >
                confirmer
              </button>

              <button
                onClick={handleModalClose}
                 className="px-4 py-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-500"
              >
                annuler
              </button>
            </Box>
          </Box>
    </Modal>
    <div className='p-[2rem] w-full bg-gray-300'>
    
      
    <div className="flex flex-col items-center w-full min-h-screen p-6 ">
      {/* Header */}
      <header className="w-full p-6 mb-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Gestion de  Caisse</h1>
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
            {products.map((product:any, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg shadow-inner bg-gray-50">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-600">{product?.produit?.nom}</span>
                  <span className="font-semibold text-gray-800">
                    {product.quantite} x fc :{product?.produit?.prixVente}
                  </span>
                </div>
                <span className="font-bold text-gray-800">fc: {product.montant.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Invoice Creation Area */}
        <section className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">Rédiger la Facture</h2>

          {/* Client Information */}
          <form  onSubmit={validateFacture} className="mb-4 space-y-4">
            <input
              type="text"
              name="nom"
              value={client.nom}
              onChange={handleChange}
              placeholder="Nom du client"
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                clientFormik.touched.nom && clientFormik.errors.nom
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}     
             
            />
            {clientFormik.touched.nom && clientFormik.errors.nom ? (
              <div className="mt-1 text-sm text-red-500">{clientFormik.errors.nom}</div>
            ) : null}
            <input
              type="text"
              name="numero"
              value={client.numero}
              onChange={handleChange}
              placeholder="numero du client"
             
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                clientFormik.touched.nom && clientFormik.errors.nom
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {clientFormik.touched.numero&& clientFormik.errors.numero? (
              <div className="mt-1 text-sm text-red-500">{clientFormik.errors.numero}</div>
            ) : null}
             <input
              type="text"
              name="adresse"
              value={client.adresse}
              onChange={handleChange}
              placeholder="Adresse du client"
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                clientFormik.touched.nom && clientFormik.errors.nom
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              
            />
              {clientFormik.touched.adresse && clientFormik.errors.adresse ? (
              <div className="mt-1 text-sm text-red-500">{clientFormik.errors.adresse}</div>
            ) : null}

          {/* Selected Products Summary */}
          <div className="mb-4 space-y-2">
            {products.map((product:any, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{product?.produit.nom}</span>
                <span className="font-semibold text-gray-800">
                  fc: {product?.produit.prixVente} x {product.quantite}
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
   

    </>
    
  );
};


export default CaisseVendeur